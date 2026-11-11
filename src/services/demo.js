import { ORIGINE, codIata, coordonate, distantaKm } from "../data/destinatii.js";
import { genereazaId } from "../utils/id.js";
import { adaugaZile } from "../utils/date.js";
import { formateazaDurata } from "../utils/text.js";

/*
 * Date demonstrative, folosite când nu există cheie API sau când API-ul nu răspunde.
 * Funcțiile sunt pure (primesc generatorul de numere aleatoare), deci pot fi testate.
 */

export const logoCompanie = (cod) => `https://images.kiwi.com/airlines/64/${cod}.png`;

const COMPANII = [
    { nume: "TAROM", cod: "RO", culoare: "#1f4e9c" },
    { nume: "Wizz Air", cod: "W6", culoare: "#c6007e" },
    { nume: "Ryanair", cod: "FR", culoare: "#073590" },
    { nume: "Lufthansa", cod: "LH", culoare: "#f5a300" },
    { nume: "Austrian", cod: "OS", culoare: "#d81e05" },
    { nume: "Turkish Airlines", cod: "TK", culoare: "#c70a0c" }
];

const POZE_HOTEL = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=400&q=80"
];

const HOTELURI = ["Sunny Beach Resort", "Sky Tower Hotel", "Cabana Brazilor", "Casa Flamingo", "Marina Bay Suites", "Old Town Loft", "Alpine Lodge", "Villa Bougainvillea"];

// forma și culoarea sunt folosite de ilustrația afișată când poza nu se încarcă
const MASINI = [
    { nume: "Fiat 500", clasa: "Mini", cutie: "Manuală", locuri: 4, pretBaza: 110, forma: "mini", culoare: "#1fc490", img: null },
    { nume: "Dacia Logan", clasa: "Economic", cutie: "Manuală", locuri: 5, pretBaza: 120, forma: "sedan", culoare: "#2f7bff", img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80" },
    { nume: "Toyota Yaris", clasa: "Compact", cutie: "Automată", locuri: 5, pretBaza: 150, forma: "hatch", culoare: "#ff4f7b", img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80" },
    { nume: "Dacia Duster", clasa: "SUV", cutie: "Manuală", locuri: 5, pretBaza: 190, forma: "suv", culoare: "#ff8a3d", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80" },
    { nume: "BMW Seria 3", clasa: "Premium", cutie: "Automată", locuri: 5, pretBaza: 320, forma: "sedan", culoare: "#7b5cff", img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80" }
];

export const IMAGINI_REZERVA = {
    zboruri: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=300&q=80",
    cazari: POZE_HOTEL[0],
    masini: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80"
};

export const linkZbor = (din, catre, data) =>
    `https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(din)}+to+${encodeURIComponent(catre)}+on+${data}`;
export const linkBooking = (oras, data) =>
    `https://www.booking.com/searchresults.ro.html?ss=${encodeURIComponent(oras)}&checkin=${data}`;
export const linkKayak = (oras, data) => `https://www.kayak.com/cars/${encodeURIComponent(oras)}/${data}`;

const oraDinMinute = (min) => {
    const m = ((min % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

function zboruri(p, int, item) {
    const a = coordonate(p.din);
    const b = coordonate(p.catre);
    const km = a && b ? distantaKm(a, b) : null;
    const durataBaza = km ? Math.round((km / 780) * 60 + 35) : int(95, 240);
    const deLa = codIata(p.din);
    const panaLa = codIata(p.catre);

    return Array.from({ length: int(3, 7) }, () => {
        const companie = item(COMPANII);
        const escala = durataBaza > 330 || (durataBaza > 150 && int(0, 3) === 0);
        const durata = durataBaza + (escala ? int(70, 180) : int(-10, 15));
        const plecare = int(5, 22) * 60 + item([0, 15, 30, 45]);
        const pret = Math.round((int(160, 380) + durata * (escala ? 1.1 : 1.6)) / 5) * 5;
        return {
            id: genereazaId(),
            tip: "zboruri",
            titlu: `${companie.nume} · ${deLa} → ${panaLa}`,
            pret,
            moneda: "RON",
            link: linkZbor(p.din, p.catre, p.data),
            imagine: logoCompanie(companie.cod),
            extra: {
                companie: companie.nume,
                cod: companie.cod,
                culoare: companie.culoare,
                nrZbor: `${companie.cod} ${int(100, 9899)}`,
                deLa,
                panaLa,
                orasDin: p.din,
                orasCatre: p.catre,
                plecare: oraDinMinute(plecare),
                sosire: oraDinMinute(plecare + durata),
                durata: formateazaDurata(durata),
                escale: escala ? "1 escală" : "Direct",
                data: p.data
            }
        };
    });
}

function cazari(p, int, item) {
    return Array.from({ length: int(3, 7) }, () => {
        const pretNoapte = int(180, 650);
        const varianta = int(0, POZE_HOTEL.length - 1);
        const nota = (int(78, 97) / 10).toFixed(1);
        return {
            id: genereazaId(),
            tip: "cazari",
            titlu: `${item(HOTELURI)} ${p.oras}`,
            subtitlu: `La ${(int(2, 45) / 10).toFixed(1)} km de centru`,
            detalii: [`${p.nopti} ${p.nopti === 1 ? "noapte" : "nopți"}`, `Check-in ${p.data}`, `Check-out ${adaugaZile(p.data, p.nopti)}`],
            pret: pretNoapte * p.nopti,
            pretUnitar: `${pretNoapte} RON / noapte`,
            moneda: "RON",
            link: linkBooking(p.oras, p.data),
            imagine: POZE_HOTEL[varianta],
            extra: { nota, varianta }
        };
    });
}

function masini(p, int, item) {
    return Array.from({ length: int(3, 7) }, () => {
        const masina = item(MASINI);
        const pretZi = masina.pretBaza + int(-10, 35);
        return {
            id: genereazaId(),
            tip: "masini",
            titlu: masina.nume,
            subtitlu: `Preluare din ${p.oras} · ${p.data}`,
            detalii: [masina.clasa, masina.cutie, `${masina.locuri} locuri`, `${p.zile} ${p.zile === 1 ? "zi" : "zile"}`],
            pret: pretZi * p.zile,
            pretUnitar: `${pretZi} RON / zi`,
            moneda: "RON",
            link: linkKayak(p.oras, p.data),
            imagine: masina.img,
            extra: { forma: masina.forma, culoare: masina.culoare }
        };
    });
}

/** Generează între 3 și 7 oferte demonstrative, sortate crescător după preț. */
export function genereazaRezultate(tip, parametri, rng = Math.random) {
    const int = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
    const item = (lista) => lista[Math.floor(rng() * lista.length)];
    const generatoare = { zboruri, cazari, masini };
    const generator = generatoare[tip];
    if (!generator) return [];
    const p = { din: ORIGINE.oras, ...parametri };
    return generator(p, int, item).sort((a, b) => a.pret - b.pret);
}
