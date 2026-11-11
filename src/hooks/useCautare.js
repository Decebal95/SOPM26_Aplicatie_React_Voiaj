import { useCallback, useEffect, useRef, useState } from "react";
import { cautaDupaTip } from "../services/api.js";
import { genereazaId } from "../utils/id.js";

const STARE_INITIALA = { status: "idle", rezultate: [], eroare: "", sursa: null, interogare: null };

/**
 * Gestionează o căutare: încărcare, succes, eroare.
 * O căutare nouă o anulează pe cea veche prin AbortController, ca rezultatele să nu se amestece.
 */
export function useCautare() {
    const [stare, setStare] = useState(STARE_INITIALA);
    const controllerRef = useRef(null);

    useEffect(() => () => controllerRef.current?.abort(), []);

    const cauta = useCallback(async (tip, parametri) => {
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        const interogare = { id: genereazaId(), tip, ...parametri };
        setStare((curenta) => ({ ...curenta, status: "loading", eroare: "", interogare }));

        try {
            const { rezultate, sursa } = await cautaDupaTip(tip, parametri, controller.signal);
            if (controller.signal.aborted) return;
            setStare({ status: "success", rezultate, sursa, eroare: "", interogare });
        } catch (eroare) {
            if (eroare.name === "AbortError") return;
            setStare((curenta) => ({
                ...curenta,
                status: "error",
                eroare: eroare.message || "Căutarea nu a reușit. Verifică conexiunea și încearcă din nou."
            }));
        }
    }, []);

    const reseteaza = useCallback(() => {
        controllerRef.current?.abort();
        setStare(STARE_INITIALA);
    }, []);

    return { ...stare, cauta, reseteaza };
}
