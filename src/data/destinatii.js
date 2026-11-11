import { normalizeaza } from "../utils/text.js";

/** Orașul de plecare implicit; de aici pornesc arcele de pe glob. */
export const ORIGINE = { oras: "București", lat: 44.43, lon: 26.1 };

/** Destinațiile pentru „Surprinde-mă“, sugestii și arcele de pe globul 3D. */
export const DESTINATII = [
    { oras: "Barcelona", tara: "Spania", steag: "🇪🇸", lat: 41.39, lon: 2.17, mesaj: "Soare, plaje urbane și arhitectura lui Gaudí." },
    { oras: "Roma", tara: "Italia", steag: "🇮🇹", lat: 41.9, lon: 12.5, mesaj: "Colosseum, gelato și istorie la fiecare colț." },
    { oras: "Paris", tara: "Franța", steag: "🇫🇷", lat: 48.86, lon: 2.35, mesaj: "Turnul Eiffel, cafenele și Sena seara." },
    { oras: "Londra", tara: "Marea Britanie", steag: "🇬🇧", lat: 51.51, lon: -0.13, mesaj: "Muzee gratuite, Big Ben și piețe de weekend." },
    { oras: "Lisabona", tara: "Portugalia", steag: "🇵🇹", lat: 38.72, lon: -9.14, mesaj: "Tramvaie galbene, pastéis de nata și apusuri pe Tejo." },
    { oras: "Reykjavik", tara: "Islanda", steag: "🇮🇸", lat: 64.15, lon: -21.94, mesaj: "Aurora boreală, gheizere și izvoare termale." },
    { oras: "Dubai", tara: "Emiratele Arabe Unite", steag: "🇦🇪", lat: 25.2, lon: 55.27, mesaj: "Burj Khalifa, dune de nisip și piețe de aur." },
    { oras: "Maldive", tara: "Maldive", steag: "🇲🇻", lat: 4.17, lon: 73.51, mesaj: "Apă de cristal, recife de corali și nisip alb." },
    { oras: "Tokyo", tara: "Japonia", steag: "🇯🇵", lat: 35.68, lon: 139.69, mesaj: "Neon, temple liniștite și sushi autentic." },
    { oras: "New York", tara: "SUA", steag: "🇺🇸", lat: 40.71, lon: -74.0, mesaj: "Zgârie-nori, Central Park și pizza la felie." }
];

/** Coduri IATA ale aeroporturilor principale (cheile sunt normalizate, fără diacritice). */
const COD_IATA = {
    bucuresti: "OTP",
    brasov: "GHV",
    "cluj-napoca": "CLJ",
    cluj: "CLJ",
    iasi: "IAS",
    timisoara: "TSR",
    sibiu: "SBZ",
    constanta: "CND",
    suceava: "SCV",
    londra: "LHR",
    london: "LHR",
    paris: "CDG",
    roma: "FCO",
    rome: "FCO",
    barcelona: "BCN",
    madrid: "MAD",
    lisabona: "LIS",
    lisbon: "LIS",
    reykjavik: "KEF",
    dubai: "DXB",
    maldive: "MLE",
    male: "MLE",
    tokyo: "HND",
    "new york": "JFK",
    viena: "VIE",
    berlin: "BER",
    amsterdam: "AMS",
    milano: "MXP",
    atena: "ATH",
    istanbul: "IST",
    praga: "PRG"
};

/** „București“ → „OTP“. Pentru orașe necunoscute întoarce primele trei litere. */
export function codIata(oras) {
    const cheie = normalizeaza(oras);
    if (COD_IATA[cheie]) return COD_IATA[cheie];
    const litere = cheie.replace(/[^a-z]/g, "").slice(0, 3).toUpperCase();
    return litere || "---";
}

/** Găsește destinația cunoscută după nume (acceptă și varianta în engleză, ex. „London“). */
export function gasesteDestinatie(nume) {
    if (!nume || !nume.trim()) return null;
    const cod = codIata(nume);
    return DESTINATII.find((d) => codIata(d.oras) === cod) ?? null;
}

/** Distanța în km între două puncte (formula haversine). */
export function distantaKm(a, b) {
    const rad = (g) => (g * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat);
    const dLon = rad(b.lon - a.lon);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
}

/** Coordonatele unui oraș cunoscut (destinație sau origine). */
export function coordonate(nume) {
    if (codIata(nume) === codIata(ORIGINE.oras)) return ORIGINE;
    return gasesteDestinatie(nume);
}
