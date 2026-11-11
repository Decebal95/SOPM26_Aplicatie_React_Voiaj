import { useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { valideaza } from "../utils/validare.js";
import { dataAzi } from "../utils/date.js";
import { DESTINATII, ORIGINE } from "../data/destinatii.js";
import { IconAvion, IconInversare, IconMasina, IconPat } from "./Icons.jsx";

const ICONITE = { zboruri: IconAvion, cazari: IconPat, masini: IconMasina };

export const CONFIG_FORMULARE = {
    zboruri: {
        titlu: "Caută zboruri",
        buton: "Caută zboruri",
        campuri: [
            { nume: "din", eticheta: "De unde pleci", tip: "text", placeholder: "ex: București", lista: true },
            { nume: "catre", eticheta: "Unde ajungi", tip: "text", placeholder: "ex: Londra", lista: true },
            { nume: "data", eticheta: "Data plecării", tip: "date" }
        ]
    },
    cazari: {
        titlu: "Caută cazări",
        buton: "Caută cazări",
        campuri: [
            { nume: "oras", eticheta: "Orașul", tip: "text", placeholder: "ex: Paris", lista: true },
            { nume: "nopti", eticheta: "Nopți", tip: "number", min: 1, max: 30 },
            { nume: "data", eticheta: "Check-in", tip: "date" }
        ]
    },
    masini: {
        titlu: "Mașini de închiriat",
        buton: "Caută mașini",
        campuri: [
            { nume: "oras", eticheta: "Preluare din", tip: "text", placeholder: "ex: Roma", lista: true },
            { nume: "zile", eticheta: "Zile", tip: "number", min: 1, max: 60 },
            { nume: "data", eticheta: "Data preluării", tip: "date" }
        ]
    }
};

/**
 * Formular controlat: valorile vin din componenta părinte prin props,
 * iar fiecare modificare e anunțată prin onChange. Validarea se face la trimitere.
 */
export default function SearchForm({ tip, valori, onChange, onSubmit, seIncarca = false, onInverseaza }) {
    const config = CONFIG_FORMULARE[tip];
    const Icon = ICONITE[tip];
    const [erori, setErori] = useState({});
    const control = useAnimationControls();
    const azi = dataAzi();

    function handleSubmit(event) {
        event.preventDefault();
        const { erori: eroriNoi, curate } = valideaza(tip, valori);
        setErori(eroriNoi);
        if (Object.keys(eroriNoi).length > 0) {
            control.start({ x: [0, -10, 10, -6, 6, -2, 0], transition: { duration: 0.45 } });
            return;
        }
        onSubmit(curate);
    }

    function handleCamp(nume, valoare) {
        onChange(nume, valoare);
        if (erori[nume]) {
            setErori((curente) => {
                const copie = { ...curente };
                delete copie[nume];
                return copie;
            });
        }
    }

    return (
        <motion.form className="panou formular" onSubmit={handleSubmit} noValidate animate={control} aria-labelledby={`titlu-formular-${tip}`}>
            <div className="formular__cap">
                <h2 id={`titlu-formular-${tip}`}>
                    <span className="bula" aria-hidden="true">
                        <Icon />
                    </span>
                    {config.titlu}
                </h2>
                {tip === "zboruri" && onInverseaza && (
                    <motion.button
                        type="button"
                        className="buton-icon"
                        onClick={onInverseaza}
                        whileTap={{ rotate: 180, scale: 0.9 }}
                        aria-label="Inversează plecarea cu destinația"
                        title="Inversează plecarea cu destinația"
                    >
                        <IconInversare />
                    </motion.button>
                )}
            </div>

            <div className="formular__campuri">
                {config.campuri.map((camp, i) => {
                    const id = `${tip}-${camp.nume}`;
                    const eroare = erori[camp.nume];
                    return (
                        <motion.div
                            className="camp"
                            key={camp.nume}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 + i * 0.06 }}
                        >
                            <label htmlFor={id}>{camp.eticheta}</label>
                            <input
                                id={id}
                                name={camp.nume}
                                type={camp.tip}
                                value={valori[camp.nume] ?? ""}
                                onChange={(e) => handleCamp(camp.nume, e.target.value)}
                                placeholder={camp.placeholder}
                                min={camp.tip === "date" ? azi : camp.min}
                                max={camp.max}
                                list={camp.lista ? "lista-orase" : undefined}
                                inputMode={camp.tip === "number" ? "numeric" : undefined}
                                autoComplete="off"
                                aria-invalid={eroare ? "true" : undefined}
                                aria-describedby={eroare ? `${id}-eroare` : undefined}
                            />
                            <AnimatePresence>
                                {eroare && (
                                    <motion.p
                                        id={`${id}-eroare`}
                                        className="camp__eroare"
                                        role="alert"
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        {eroare}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <datalist id="lista-orase">
                {[ORIGINE, ...DESTINATII].map((d) => (
                    <option key={d.oras} value={d.oras} />
                ))}
            </datalist>

            <motion.button type="submit" className="buton-principal" disabled={seIncarca} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                {seIncarca ? (
                    <>
                        <span className="rotitor" aria-hidden="true">
                            <IconAvion />
                        </span>
                        Se caută…
                    </>
                ) : (
                    config.buton
                )}
            </motion.button>
        </motion.form>
    );
}
