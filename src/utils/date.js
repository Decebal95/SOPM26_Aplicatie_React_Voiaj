const doi = (n) => String(n).padStart(2, "0");

/**
 * Data de azi în format AAAA-LL-ZZ, după ora locală.
 * (toISOString() folosește ora UTC și poate întoarce ziua de ieri după miezul nopții în România.)
 */
export function dataAzi(acum = new Date()) {
    return `${acum.getFullYear()}-${doi(acum.getMonth() + 1)}-${doi(acum.getDate())}`;
}

/** Adaugă zile la o dată AAAA-LL-ZZ. */
export function adaugaZile(dataText, zile) {
    const [a, l, z] = dataText.split("-").map(Number);
    const d = new Date(a, l - 1, z + zile);
    return dataAzi(d);
}

/** „2026-11-09“ → „luni, 9 noiembrie“. */
export function dataLizibila(dataText, optiuni = { weekday: "long", day: "numeric", month: "long" }) {
    if (!dataText) return "";
    const [a, l, z] = dataText.split("-").map(Number);
    return new Intl.DateTimeFormat("ro-RO", optiuni).format(new Date(a, l - 1, z));
}
