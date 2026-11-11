import { useEffect, useState } from "react";

/** Curs aproximativ, folosit dacă API-ul nu răspunde (RON pentru o unitate de monedă). */
export const CURS_REZERVA = { EUR: 5.08, USD: 4.4, GBP: 5.85 };

// Cursul se cere o singură dată pe sesiune; deschiderile următoare ale calculatorului îl refolosesc.
let cache = null;

/**
 * Încarcă cursul zilei de la Frankfurter (date publicate de Banca Centrală Europeană).
 * API public, fără cheie.
 */
export function useCursValutar() {
    const [stare, setStare] = useState(() => cache ?? { status: "loading", curs: CURS_REZERVA, data: null });

    useEffect(() => {
        if (cache) return;
        const controller = new AbortController();

        async function incarca() {
            try {
                const raspuns = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=RON,USD,GBP", {
                    signal: controller.signal
                });
                if (!raspuns.ok) throw new Error("Cursul nu a putut fi încărcat.");
                const json = await raspuns.json();
                const { RON, USD, GBP } = json.rates;
                cache = {
                    status: "success",
                    curs: { EUR: RON, USD: RON / USD, GBP: RON / GBP },
                    data: json.date
                };
                setStare(cache);
            } catch (eroare) {
                if (eroare.name !== "AbortError") setStare({ status: "error", curs: CURS_REZERVA, data: null });
            }
        }

        incarca();
        return () => controller.abort();
    }, []);

    return stare;
}
