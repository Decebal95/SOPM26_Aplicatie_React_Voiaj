/** Litere mici, fără diacritice și fără spații la capete: „  Brașov “ → „brasov“. */
export function normalizeaza(text = "") {
    return String(text)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim()
        .toLowerCase();
}

const formatorNumere = new Map();

/** Formatează un număr în stil românesc: 1234.5 → „1.234,5“. */
export function formateazaNumar(valoare, zecimale = 0) {
    if (!formatorNumere.has(zecimale)) {
        formatorNumere.set(
            zecimale,
            new Intl.NumberFormat("ro-RO", { minimumFractionDigits: zecimale, maximumFractionDigits: zecimale })
        );
    }
    return formatorNumere.get(zecimale).format(valoare);
}

/** Durata în minute → „2h 45m“. */
export function formateazaDurata(minute) {
    const h = Math.floor(minute / 60);
    const m = minute % 60;
    return h ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
}
