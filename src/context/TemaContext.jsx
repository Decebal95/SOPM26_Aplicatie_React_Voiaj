import { createContext, useContext, useMemo, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export const TEME = ["zboruri", "cazari", "masini"];

const TemaContext = createContext(null);

/**
 * Tab-ul activ decide tema vizuală a întregii aplicații (fundal, culori, scena 3D),
 * deci stă într-un Context folosit de mai multe componente.
 */
export function TemaProvider({ children }) {
    const [tema, setTema] = useLocalStorage("voiaj:tab", "zboruri");
    const [destinatie, setDestinatie] = useState(null);

    const valoare = useMemo(
        () => ({ tema: TEME.includes(tema) ? tema : "zboruri", setTema, destinatie, setDestinatie }),
        [tema, setTema, destinatie]
    );

    return <TemaContext.Provider value={valoare}>{children}</TemaContext.Provider>;
}

export function useTema() {
    const context = useContext(TemaContext);
    if (!context) throw new Error("useTema trebuie folosit în interiorul lui TemaProvider.");
    return context;
}
