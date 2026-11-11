import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCursValutar } from "../hooks/useCursValutar.js";
import { formateazaNumar } from "../utils/text.js";
import { dataLizibila } from "../utils/date.js";
import NumarAnimat from "./NumarAnimat.jsx";
import { IconInversare, IconX } from "./Icons.jsx";

const MONEDE = [
    { cod: "EUR", simbol: "€" },
    { cod: "USD", simbol: "$" },
    { cod: "GBP", simbol: "£" }
];

export default function CurrencyModal({ deschis, onInchide }) {
    return <AnimatePresence>{deschis && <ContinutModal onInchide={onInchide} />}</AnimatePresence>;
}

function ContinutModal({ onInchide }) {
    const { curs, status, data } = useCursValutar();
    const [suma, setSuma] = useState("100");
    const [moneda, setMoneda] = useState("EUR");
    const [spreRon, setSpreRon] = useState(true);
    const campSuma = useRef(null);

    useEffect(() => {
        campSuma.current?.focus();
        const laTasta = (e) => e.key === "Escape" && onInchide();
        window.addEventListener("keydown", laTasta);
        return () => window.removeEventListener("keydown", laTasta);
    }, [onInchide]);

    const valoare = Math.max(0, parseFloat(String(suma).replace(",", ".")) || 0);
    const rata = curs[moneda];
    const rezultat = spreRon ? valoare * rata : valoare / rata;
    const [deLa, panaLa] = spreRon ? [moneda, "RON"] : ["RON", moneda];

    return (
        <motion.div
            className="modal-fundal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && onInchide()}
        >
            <motion.div
                className="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titlu-valuta"
                initial={{ opacity: 0, scale: 0.9, rotateX: 22, y: 40 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, rotateX: -12, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
                <div className="modal__cap">
                    <div>
                        <h2 id="titlu-valuta">Calculator valutar</h2>
                        <p className="modal__sub">Cât te costă vacanța în lei.</p>
                    </div>
                    <button type="button" className="buton-icon" onClick={onInchide} aria-label="Închide calculatorul">
                        <IconX />
                    </button>
                </div>

                <div className="camp">
                    <label htmlFor="suma-valuta">Suma în {deLa}</label>
                    <input
                        id="suma-valuta"
                        ref={campSuma}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        value={suma}
                        onChange={(e) => setSuma(e.target.value)}
                    />
                </div>

                <div className="modal__rand">
                    <div className="monede" role="group" aria-label="Moneda străină">
                        {MONEDE.map((m) => {
                            const activa = m.cod === moneda;
                            return (
                                <button
                                    key={m.cod}
                                    type="button"
                                    className={`moneda${activa ? " moneda--activa" : ""}`}
                                    aria-pressed={activa}
                                    onClick={() => setMoneda(m.cod)}
                                >
                                    {activa && <motion.span layoutId="moneda-pastila" className="moneda__pastila" />}
                                    <span className="moneda__text">
                                        {m.simbol} {m.cod}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    <motion.button
                        type="button"
                        className="buton-icon"
                        onClick={() => setSpreRon((v) => !v)}
                        animate={{ rotate: spreRon ? 0 : 180 }}
                        aria-label={`Schimbă direcția: acum ${deLa} în ${panaLa}`}
                    >
                        <IconInversare />
                    </motion.button>
                </div>

                <div className="rezultat-valuta" aria-live="polite">
                    <span className="eticheta-mono">
                        {formateazaNumar(valoare, 2)} {deLa} =
                    </span>
                    <span className="rezultat-valuta__suma">
                        <NumarAnimat valoare={rezultat} zecimale={2} /> {panaLa}
                    </span>
                    <span className="rezultat-valuta__curs">
                        1 {moneda} = {formateazaNumar(rata, 4)} RON ·{" "}
                        {status === "loading"
                            ? "se încarcă cursul zilei…"
                            : status === "success"
                              ? `curs BCE din ${dataLizibila(data, { day: "numeric", month: "long" })}`
                              : "curs aproximativ, fără conexiune"}
                    </span>
                </div>

                <button type="button" className="buton-principal" onClick={onInchide}>
                    Gata
                </button>
            </motion.div>
        </motion.div>
    );
}
