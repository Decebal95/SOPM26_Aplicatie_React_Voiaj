import { useEffect, useState } from "react";

/**
 * Ca useState, dar valoarea rămâne salvată în localStorage după reîncărcarea paginii.
 * Datele se transformă în JSON la salvare și se parsează la citire.
 */
export function useLocalStorage(cheie, valoareInitiala) {
    const [valoare, setValoare] = useState(() => {
        try {
            const salvat = localStorage.getItem(cheie);
            return salvat !== null ? JSON.parse(salvat) : valoareInitiala;
        } catch {
            return valoareInitiala;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(cheie, JSON.stringify(valoare));
        } catch {
            // localStorage poate fi indisponibil (fereastră privată, spațiu plin); aplicația merge oricum.
        }
    }, [cheie, valoare]);

    return [valoare, setValoare];
}
