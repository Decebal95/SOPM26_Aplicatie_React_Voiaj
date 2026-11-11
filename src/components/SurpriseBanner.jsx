import { AnimatePresence, motion } from "framer-motion";
import { codIata } from "../data/destinatii.js";
import { IconX } from "./Icons.jsx";

const LUNGIME_TABLA = 10;

/** Tablă de plecări cu litere care se răsucesc, ca în aeroporturile de altădată. */
function TablaSplitFlap({ text }) {
    const caractere = text.toUpperCase().padEnd(LUNGIME_TABLA, " ").slice(0, LUNGIME_TABLA).split("");
    return (
        <div className="flap-rand" role="img" aria-label={text}>
            {caractere.map((caracter, i) => (
                <span key={i} className="flap" aria-hidden="true">
                    <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                            key={`${caracter}-${i}`}
                            className="flap__caracter"
                            initial={{ rotateX: -90, opacity: 0 }}
                            animate={{ rotateX: 0, opacity: 1 }}
                            exit={{ rotateX: 90, opacity: 0 }}
                            transition={{ duration: 0.16, delay: i * 0.012 }}
                        >
                            {caracter === " " ? " " : caracter}
                        </motion.span>
                    </AnimatePresence>
                </span>
            ))}
        </div>
    );
}

export default function SurpriseBanner({ afisat, aleasa, ruleaza, onInchide }) {
    return (
        <motion.aside
            className="surpriza"
            aria-label="Destinație surpriză"
            initial={{ opacity: 0, rotateX: -35, y: -20 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: 25, y: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
            <div className="surpriza__cap">
                <span className="eticheta-mono">{ruleaza ? "Se învârte zarul…" : "Destinația ta surpriză"}</span>
                {!ruleaza && (
                    <button type="button" className="buton-icon buton-icon--mic" onClick={onInchide} aria-label="Ascunde destinația surpriză">
                        <IconX />
                    </button>
                )}
            </div>
            <div className="surpriza__tabla">
                <TablaSplitFlap text={afisat} />
                <span className="surpriza__cod">OTP → {codIata(afisat)}</span>
            </div>
            <AnimatePresence>
                {!ruleaza && aleasa && (
                    <motion.p className="surpriza__mesaj" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <strong>
                            {aleasa.steag} {aleasa.tara}.
                        </strong>{" "}
                        {aleasa.mesaj}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.aside>
    );
}
