import { genereazaRezultate, IMAGINI_REZERVA, linkBooking, linkZbor, logoCompanie } from "./demo.js";
import { codIata } from "../data/destinatii.js";
import { genereazaId } from "../utils/id.js";
import { adaugaZile } from "../utils/date.js";

/*
 * Cheia nu mai stă în cod: se citește din .env.local (VITE_RAPIDAPI_KEY).
 * Variabilele VITE_ ajung totuși în bundle; pentru producție, cererile ar trebui trecute printr-un server propriu.
 */
const CHEIE = import.meta.env.VITE_RAPIDAPI_KEY;

/** Pauză care se poate anula cu AbortController. */
export function asteapta(ms, signal) {
    return new Promise((resolve, reject) => {
        const eroareAnulare = () => new DOMException("Căutarea a fost anulată.", "AbortError");
        if (signal?.aborted) return reject(eroareAnulare());
        const t = setTimeout(resolve, ms);
        signal?.addEventListener(
            "abort",
            () => {
                clearTimeout(t);
                reject(eroareAnulare());
            },
            { once: true }
        );
    });
}

async function cereJson(url, host, signal) {
    const raspuns = await fetch(url, {
        headers: { "x-rapidapi-host": host, "x-rapidapi-key": CHEIE },
        signal
    });
    if (!raspuns.ok) throw new Error(`Serverul a răspuns cu ${raspuns.status}.`);
    return raspuns.json();
}

/** Încearcă API-ul real; dacă lipsește cheia sau apare o eroare, întoarce date demonstrative. */
async function cuRezerva(tip, parametri, signal, cerereLive) {
    if (CHEIE && cerereLive) {
        try {
            const rezultate = await cerereLive();
            if (rezultate.length > 0) return { rezultate, sursa: "live" };
        } catch (eroare) {
            if (eroare.name === "AbortError") throw eroare;
            console.warn(`API-ul pentru ${tip} nu a răspuns, folosesc date demonstrative.`, eroare);
        }
    }
    await asteapta(900, signal);
    return { rezultate: genereazaRezultate(tip, parametri), sursa: "demo" };
}

function zboruriLive({ din, catre, data }, signal) {
    const host = "kiwi-com-cheap-flights.p.rapidapi.com";
    const url = `https://${host}/round-trip?source=${encodeURIComponent(din)}&destination=${encodeURIComponent(catre)}&currency=RON&locale=ro&adults=1&limit=10`;
    return cereJson(url, host, signal).then((json) =>
        (json.data ?? [])
            .filter((zbor) => Number(zbor.price) > 0)
            .map((zbor) => {
                const cod = zbor.airlines?.[0] ?? "RO";
                return {
                    id: zbor.id ?? genereazaId(),
                    tip: "zboruri",
                    titlu: `${zbor.airlines?.join(", ") ?? "Companie aeriană"} · ${codIata(din)} → ${codIata(catre)}`,
                    pret: Math.round(Number(zbor.price)),
                    moneda: "RON",
                    link: zbor.deep_link ?? linkZbor(din, catre, data),
                    imagine: logoCompanie(cod),
                    extra: {
                        companie: zbor.airlines?.join(", ") ?? "Companie aeriană",
                        nrZbor: cod,
                        deLa: zbor.flyFrom ?? codIata(din),
                        panaLa: zbor.flyTo ?? codIata(catre),
                        orasDin: zbor.cityFrom ?? din,
                        orasCatre: zbor.cityTo ?? catre,
                        plecare: "—",
                        sosire: "—",
                        durata: "",
                        escale: zbor.route?.length > 1 ? `${zbor.route.length - 1} escale` : "Direct",
                        data
                    }
                };
            })
    );
}

async function cazariLive({ oras, nopti, data }, signal) {
    const host = "booking-com15.p.rapidapi.com";
    const dest = await cereJson(`https://${host}/api/v1/hotels/searchDestination?query=${encodeURIComponent(oras)}`, host, signal);
    const destinatie = dest.data?.[0];
    if (!destinatie) return [];

    const url = `https://${host}/api/v1/hotels/searchHotels?dest_id=${destinatie.dest_id}&search_type=${destinatie.search_type}&arrival_date=${data}&departure_date=${adaugaZile(data, nopti)}&adults=1&room_qty=1&page_number=1&currency_code=RON`;
    const json = await cereJson(url, host, signal);

    return (json.data?.hotels ?? []).slice(0, 10).map((hotel) => {
        const p = hotel.property ?? {};
        const pret = p.priceBreakdown?.grossPrice?.value ?? hotel.composite_price_breakdown?.gross_amount?.value ?? 0;
        return {
            id: String(hotel.hotel_id ?? genereazaId()),
            tip: "cazari",
            titlu: p.name ?? "Hotel",
            subtitlu: destinatie.name ?? oras,
            detalii: [`${nopti} ${nopti === 1 ? "noapte" : "nopți"}`, `Check-in ${data}`],
            pret: Math.round(pret),
            pretUnitar: pret ? `${Math.round(pret / nopti)} RON / noapte` : "Preț pe site",
            moneda: p.priceBreakdown?.grossPrice?.currency ?? "RON",
            link: p.url ?? linkBooking(oras, data),
            imagine: p.photoUrls?.[0] ?? IMAGINI_REZERVA.cazari,
            extra: { nota: p.reviewScore ? Number(p.reviewScore).toFixed(1) : "—" }
        };
    });
}

/*
 * Pentru mașini nu există încă un API configurat (endpoint-ul Priceline din versiunea veche
 * căuta zboruri lângă New York). Afișăm date demonstrative, marcate ca atare în interfață.
 */
export function cautaDupaTip(tip, parametri, signal) {
    if (tip === "zboruri") return cuRezerva(tip, parametri, signal, () => zboruriLive(parametri, signal));
    if (tip === "cazari") return cuRezerva(tip, parametri, signal, () => cazariLive(parametri, signal));
    return cuRezerva(tip, parametri, signal, null);
}
