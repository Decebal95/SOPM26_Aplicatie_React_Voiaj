import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import TabSwitcher from "../components/TabSwitcher.jsx";
import SearchForm from "../components/SearchForm.jsx";
import ResultList from "../components/ResultList.jsx";
import SurpriseBanner from "../components/SurpriseBanner.jsx";
import Confetti from "../components/Confetti.jsx";
import { IconZar } from "../components/Icons.jsx";
import { useTema } from "../context/TemaContext.jsx";
import { useCautare } from "../hooks/useCautare.js";
import { DESTINATII, ORIGINE, gasesteDestinatie } from "../data/destinatii.js";
import { dataAzi, dataLizibila } from "../utils/date.js";
import { valideaza } from "../utils/validare.js";

/** Titlul e împărțit în trei, ca verbul din mijloc să fie colorat. */
const TITLURI = {
    zboruri: ["Unde ", "zbori", " azi?"],
    cazari: ["Unde ", "dormi", " diseară?"],
    masini: ["Unde ", "conduci", " mâine?"]
};

const SUBTITLURI = {
    zboruri: "Bilete de avion spre oriunde, comparate într-o clipă. Alege destinația sau lasă zarul să decidă.",
    cazari: "Hoteluri la plajă, la munte sau în inima orașului. Salvează-le pe cele care-ți plac.",
    masini: "Mașini de închiriat pentru road-trip-ul perfect, de la Fiat 500 la SUV."
};

/** Linia „desenată de mână“ de sub titlu. */
function Mazgalitura() {
    return (
        <svg className="mazgalitura" viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
                d="M3 9 Q 21 2 39 8 T 75 8 T 111 8 T 147 8 T 183 8 T 219 8 T 255 8 T 297 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
        </svg>
    );
}

/** Câmpul care conține destinația, pentru fiecare tip de căutare. */
const CAMP_DESTINATIE = { zboruri: "catre", cazari: "oras", masini: "oras" };

const pauza = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function valoriInitiale() {
    const azi = dataAzi();
    return {
        zboruri: { din: ORIGINE.oras, catre: "", data: azi },
        cazari: { oras: "", nopti: "2", data: azi },
        masini: { oras: "", zile: "3", data: azi }
    };
}

export default function SearchPage() {
    const { tema: tab, setTema: setTab, setDestinatie } = useTema();
    const [valori, setValori] = useState(valoriInitiale);
    const [ruleta, setRuleta] = useState({ activa: false, afisat: "", aleasa: null });
    const [confetti, setConfetti] = useState(0);
    const miscareRedusa = useReducedMotion();
    const cautare = useCautare();
    const montat = useRef(true);

    useEffect(() => {
        montat.current = true;
        return () => {
            montat.current = false;
        };
    }, []);

    function schimbaTab(nou) {
        if (nou === tab) return;
        setTab(nou);
        cautare.reseteaza();
        setDestinatie(gasesteDestinatie(valori[nou][CAMP_DESTINATIE[nou]]));
    }

    function schimbaCamp(camp, valoare) {
        setValori((curente) => ({ ...curente, [tab]: { ...curente[tab], [camp]: valoare } }));
    }

    function inverseaza() {
        setValori((curente) => ({
            ...curente,
            zboruri: { ...curente.zboruri, din: curente.zboruri.catre, catre: curente.zboruri.din }
        }));
    }

    function porneste(tip, parametri) {
        setDestinatie(gasesteDestinatie(parametri[CAMP_DESTINATIE[tip]]));
        cautare.cauta(tip, parametri);
    }

    /** Pune orașul în toate formularele și caută imediat pe tab-ul curent. */
    function alegeOras(oras) {
        const noi = {
            zboruri: { ...valori.zboruri, catre: oras },
            cazari: { ...valori.cazari, oras },
            masini: { ...valori.masini, oras }
        };
        setValori(noi);
        const { erori, curate } = valideaza(tab, noi[tab]);
        if (Object.keys(erori).length === 0) porneste(tab, curate);
    }

    async function surprinde() {
        if (ruleta.activa) return;
        const posibile = DESTINATII.filter((d) => d.oras !== ruleta.aleasa?.oras);
        const aleasa = posibile[Math.floor(Math.random() * posibile.length)];

        // Literele se rotesc tot mai încet, apoi se opresc pe destinația aleasă.
        for (let i = 0; i < 12; i++) {
            const intermediar = DESTINATII[Math.floor(Math.random() * DESTINATII.length)];
            setRuleta({ activa: true, afisat: intermediar.oras, aleasa: null });
            await pauza(70 + i * i * 5);
            if (!montat.current) return;
        }
        setRuleta({ activa: false, afisat: aleasa.oras, aleasa });
        if (!miscareRedusa) setConfetti((n) => n + 1);
        alegeOras(aleasa.oras);
    }

    const seIncarca = cautare.status === "loading";

    return (
        <PageTransition className="pagina-cautare">
            {confetti > 0 && <Confetti key={confetti} />}
            <section className="erou">
                <p className="eyebrow">
                    <span className="puls" aria-hidden="true" />
                    Plecări · {dataLizibila(dataAzi())}
                </p>
                <div>
                    <h1>
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                                key={tab}
                                className="titlu-schimbator"
                                initial={{ opacity: 0, y: 30, rotate: -4, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, rotate: 3, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 320, damping: 18 }}
                            >
                                {TITLURI[tab][0]}
                                <em>{TITLURI[tab][1]}</em>
                                {TITLURI[tab][2]}
                            </motion.span>
                        </AnimatePresence>
                    </h1>
                    <Mazgalitura key={tab} />
                </div>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.p key={tab} className="erou__sub" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        {SUBTITLURI[tab]}
                    </motion.p>
                </AnimatePresence>
            </section>

            <div className="unelte">
                <TabSwitcher activ={tab} onSchimba={schimbaTab} />
                <motion.button
                    type="button"
                    className="buton-surpriza"
                    onClick={surprinde}
                    disabled={ruleta.activa}
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        className="buton-surpriza__zar"
                        animate={ruleta.activa ? { rotate: 360 } : { rotate: 0 }}
                        transition={ruleta.activa ? { duration: 0.5, repeat: Infinity, ease: "linear" } : { duration: 0.3 }}
                    >
                        <IconZar />
                    </motion.span>
                    Surprinde-mă
                </motion.button>
            </div>

            <AnimatePresence>
                {ruleta.afisat && (
                    <SurpriseBanner
                        afisat={ruleta.afisat}
                        aleasa={ruleta.aleasa}
                        ruleaza={ruleta.activa}
                        onInchide={() => setRuleta({ activa: false, afisat: "", aleasa: null })}
                    />
                )}
            </AnimatePresence>

            <div className="scena-formular">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={tab}
                        id={`panou-${tab}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${tab}`}
                        initial={{ opacity: 0, rotateY: -14, x: 40 }}
                        animate={{ opacity: 1, rotateY: 0, x: 0 }}
                        exit={{ opacity: 0, rotateY: 14, x: -40 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <SearchForm
                            tip={tab}
                            valori={valori[tab]}
                            onChange={schimbaCamp}
                            onSubmit={(curate) => porneste(tab, curate)}
                            onInverseaza={inverseaza}
                            seIncarca={seIncarca}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <ResultList
                tip={tab}
                status={cautare.status}
                rezultate={cautare.rezultate}
                eroare={cautare.eroare}
                sursa={cautare.sursa}
                interogare={cautare.interogare}
                onReincearca={() => cautare.interogare && cautare.cauta(cautare.interogare.tip, cautare.interogare)}
                onSugestie={alegeOras}
            />
        </PageTransition>
    );
}
