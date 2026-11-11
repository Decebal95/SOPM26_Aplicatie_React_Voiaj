import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { genereazaId } from "../utils/id.js";
import { IconInima } from "../components/Icons.jsx";

const ToastContext = createContext(null);

/** Mesaje scurte de confirmare („Salvat în Favorite“), anunțate și cititoarelor de ecran. */
export function ToastProvider({ children }) {
    const [mesaje, setMesaje] = useState([]);

    const arata = useCallback((text, tip = "info") => {
        const id = genereazaId();
        setMesaje((curente) => [...curente.slice(-2), { id, text, tip }]);
        setTimeout(() => setMesaje((curente) => curente.filter((m) => m.id !== id)), 2600);
    }, []);

    const valoare = useMemo(() => ({ arata }), [arata]);

    return (
        <ToastContext.Provider value={valoare}>
            {children}
            <div className="toasturi" role="status" aria-live="polite">
                <AnimatePresence>
                    {mesaje.map((m) => (
                        <motion.div
                            key={m.id}
                            layout
                            className={`toast toast--${m.tip}`}
                            initial={{ opacity: 0, y: 30, scale: 0.7 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 460, damping: 18 }}
                        >
                            {m.tip === "succes" && <IconInima umplut />}
                            {m.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast trebuie folosit în interiorul lui ToastProvider.");
    return context;
}
