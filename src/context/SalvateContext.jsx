import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const SalvateContext = createContext(null);

/** Ofertele salvate sunt folosite în bara de navigare, în rezultate și pe pagina Favorite. */
export function SalvateProvider({ children }) {
    const [salvate, setSalvate] = useLocalStorage("voiaj:salvate", []);

    const esteSalvat = useCallback((id) => salvate.some((s) => s.id === id), [salvate]);

    /** Adaugă oferta dacă nu e salvată, altfel o scoate. Întoarce true dacă a fost adăugată. */
    const comuta = useCallback(
        (oferta) => {
            const exista = salvate.some((s) => s.id === oferta.id);
            setSalvate((curente) =>
                exista ? curente.filter((s) => s.id !== oferta.id) : [...curente, { ...oferta, salvatLa: Date.now() }]
            );
            return !exista;
        },
        [salvate, setSalvate]
    );

    const goleste = useCallback(() => setSalvate([]), [setSalvate]);

    const valoare = useMemo(() => ({ salvate, esteSalvat, comuta, goleste }), [salvate, esteSalvat, comuta, goleste]);

    return <SalvateContext.Provider value={valoare}>{children}</SalvateContext.Provider>;
}

export function useSalvate() {
    const context = useContext(SalvateContext);
    if (!context) throw new Error("useSalvate trebuie folosit în interiorul lui SalvateProvider.");
    return context;
}
