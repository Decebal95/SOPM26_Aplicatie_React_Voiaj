import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ResultCard from "./ResultCard.jsx";
import { IconAvion } from "./Icons.jsx";
import { useSalvate } from "../context/SalvateContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { DESTINATII, codIata } from "../data/destinatii.js";
import { CULORI_VII } from "../data/culori.js";
import { dataLizibila } from "../utils/date.js";
import { formateazaNumar } from "../utils/text.js";

const MESAJE_INCARCARE = {
    zboruri: "Căutăm cele mai bune zboruri…",
    cazari: "Batem la ușa hotelurilor…",
    masini: "Pregătim cheile mașinilor…"
};

const SUGESTII = ["Londra", "Barcelona", "Paris", "Lisabona", "Tokyo", "Maldive"]
    .map((oras) => DESTINATII.find((d) => d.oras === oras))
    .filter(Boolean);

const elementLista = {
    ascuns: { opacity: 0, y: 40, rotateX: -26, scale: 0.94 },
    vizibil: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } }
};

function Sugestii({ tip, onSugestie }) {
    return (
        <section className="panou sugestii" aria-labelledby="titlu-sugestii">
            <h2 id="titlu-sugestii" className="eticheta-mono">
                {tip === "zboruri" ? "Plecări populare din OTP" : "Orașe căutate des"}
            </h2>
            <motion.div className="sugestii__lista" initial="ascuns" animate="vizibil" variants={{ vizibil: { transition: { staggerChildren: 0.07 } } }}>
                {SUGESTII.map((d, i) => (
                    <motion.button
                        key={d.oras}
                        type="button"
                        className="sugestie"
                        style={{ "--c": CULORI_VII[i][0], "--c2": CULORI_VII[i][1] }}
                        variants={{ ascuns: { opacity: 0, y: 20, scale: 0.8 }, vizibil: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 14 } } }}
                        whileHover={{ y: -5, rotate: -2 }}
                        whileTap={{ y: 3, scale: 0.98 }}
                        onClick={() => onSugestie(d.oras)}
                    >
                        <span className="sugestie__steag" aria-hidden="true">
                            {d.steag}
                        </span>
                        <span className="sugestie__cod">{codIata(d.oras)}</span>
                        <span className="sugestie__oras">{d.oras}</span>
                        <span className="sugestie__tara">{d.tara}</span>
                    </motion.button>
                ))}
            </motion.div>
        </section>
    );
}

function Incarcare({ tip }) {
    return (
        <div className="incarcare" role="status">
            <div className="incarcare__zbor" aria-hidden="true">
                <svg className="incarcare__traseu" viewBox="0 0 300 60" preserveAspectRatio="none">
                    <path d="M0 40 Q75 14 150 32 T300 24" />
                </svg>
                <motion.span
                    className="incarcare__avion"
                    initial={{ left: "0%" }}
                    animate={{ left: "100%", y: [0, -10, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <IconAvion />
                </motion.span>
            </div>
            <p className="incarcare__text">{MESAJE_INCARCARE[tip]}</p>
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="schelet"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
}

function titluRezultate(interogare) {
    if (!interogare) return "Rezultate";
    if (interogare.tip === "zboruri") return `${codIata(interogare.din)} → ${codIata(interogare.catre)}`;
    if (interogare.tip === "cazari") return `Cazări în ${interogare.oras}`;
    return `Mașini în ${interogare.oras}`;
}

export default function ResultList({ tip, status, rezultate, eroare, sursa, interogare, onReincearca, onSugestie }) {
    const [sortare, setSortare] = useState("pret-crescator");
    const [limita, setLimita] = useState(100);
    const { esteSalvat, comuta } = useSalvate();
    const { arata } = useToast();

    // Limita de preț e păstrată ca procent, ca să rămână valabilă la o căutare nouă.
    const { minim, maxim } = useMemo(() => {
        const preturi = rezultate.map((r) => r.pret);
        return { minim: preturi.length ? Math.min(...preturi) : 0, maxim: preturi.length ? Math.max(...preturi) : 0 };
    }, [rezultate]);
    const pretMaxim = Math.round(minim + ((maxim - minim) * limita) / 100);

    const vizibile = useMemo(() => {
        const filtrate = rezultate.filter((r) => limita === 100 || r.pret <= pretMaxim);
        const copie = [...filtrate];
        if (sortare === "pret-crescator") copie.sort((a, b) => a.pret - b.pret);
        if (sortare === "pret-descrescator") copie.sort((a, b) => b.pret - a.pret);
        if (sortare === "nota") copie.sort((a, b) => Number(b.extra?.nota ?? 0) - Number(a.extra?.nota ?? 0));
        return copie;
    }, [rezultate, sortare, limita, pretMaxim]);

    // Autocolantele se calculează din rezultate (valori derivate, nu stocate).
    const { idIeftin, idNotaMaxima } = useMemo(() => {
        if (rezultate.length === 0) return { idIeftin: null, idNotaMaxima: null };
        const ieftin = rezultate.reduce((a, b) => (b.pret < a.pret ? b : a));
        const cuNota = rezultate.filter((r) => r.extra?.nota && r.extra.nota !== "—");
        const top = cuNota.length ? cuNota.reduce((a, b) => (Number(b.extra.nota) > Number(a.extra.nota) ? b : a)) : null;
        return { idIeftin: ieftin.id, idNotaMaxima: top?.id ?? null };
    }, [rezultate]);

    function comutaSalvat(rezultat) {
        const adaugat = comuta(rezultat);
        arata(adaugat ? "Salvat în Favorite" : "Scos din Favorite", adaugat ? "succes" : "info");
    }

    if (status === "idle") return <Sugestii tip={tip} onSugestie={onSugestie} />;
    if (status === "loading") return <Incarcare tip={tip} />;

    if (status === "error") {
        return (
            <div className="mesaj mesaj--eroare" role="alert">
                <strong>Căutarea nu a mers.</strong>
                <p>{eroare}</p>
                <button type="button" className="buton-secundar" onClick={onReincearca}>
                    Încearcă din nou
                </button>
            </div>
        );
    }

    if (rezultate.length === 0) {
        return (
            <div className="mesaj">
                <strong>Nicio ofertă pentru această căutare.</strong>
                <p>Încearcă altă dată sau alt oraș.</p>
            </div>
        );
    }

    return (
        <section className="rezultate" aria-labelledby="titlu-rezultate">
            <div className="rezultate__cap">
                <div>
                    <h2 id="titlu-rezultate">{titluRezultate(interogare)}</h2>
                    <p className="rezultate__meta">
                        {interogare?.data && <span>{dataLizibila(interogare.data)}</span>}
                        <span>
                            {vizibile.length} din {rezultate.length} oferte
                        </span>
                        <span className={`sursa sursa--${sursa}`}>{sursa === "live" ? "Live" : "Date demonstrative"}</span>
                    </p>
                </div>
                <div className="rezultate__control">
                    <div className="control">
                        <label htmlFor="sortare">Sortează</label>
                        <select id="sortare" value={sortare} onChange={(e) => setSortare(e.target.value)}>
                            <option value="pret-crescator">Preț crescător</option>
                            <option value="pret-descrescator">Preț descrescător</option>
                            {tip === "cazari" && <option value="nota">Nota cea mai mare</option>}
                        </select>
                    </div>
                    <div className="control">
                        <label htmlFor="limita-pret">Preț maxim</label>
                        <input
                            id="limita-pret"
                            type="range"
                            min="0"
                            max="100"
                            value={limita}
                            onChange={(e) => setLimita(Number(e.target.value))}
                            aria-valuetext={`${formateazaNumar(pretMaxim)} RON`}
                        />
                        <output htmlFor="limita-pret">{formateazaNumar(pretMaxim)} RON</output>
                    </div>
                </div>
            </div>

            <motion.ul
                key={interogare?.id}
                className="lista-rezultate"
                initial="ascuns"
                animate="vizibil"
                variants={{ vizibil: { transition: { staggerChildren: 0.09 } } }}
            >
                <AnimatePresence>
                    {vizibile.map((r) => (
                        <motion.li key={r.id} layout variants={elementLista} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}>
                            <ResultCard
                                rezultat={r}
                                salvat={esteSalvat(r.id)}
                                onComutaSalvat={() => comutaSalvat(r)}
                                sticker={r.id === idIeftin ? "Cel mai ieftin!" : tip === "cazari" && r.id === idNotaMaxima ? "Nota maximă" : null}
                            />
                        </motion.li>
                    ))}
                </AnimatePresence>
            </motion.ul>

            {vizibile.length === 0 && (
                <p className="mesaj">Nicio ofertă sub {formateazaNumar(pretMaxim)} RON. Mută limita de preț spre dreapta.</p>
            )}
        </section>
    );
}
