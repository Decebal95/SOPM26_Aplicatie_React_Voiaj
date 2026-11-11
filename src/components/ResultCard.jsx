import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import NumarAnimat from "./NumarAnimat.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import { IlustratieHotel, IlustratieMasina } from "./Ilustratii.jsx";
import { IconAvion, IconSageata } from "./Icons.jsx";

const TEXTE = {
    zboruri: { eticheta: "Preț / persoană", verb: "Vezi oferta" },
    cazari: { eticheta: "Total cazare", verb: "Rezervă" },
    masini: { eticheta: "Total închiriere", verb: "Închiriază" }
};

/** Afișează poza; dacă lipsește sau nu se încarcă, afișează elementul de rezervă. */
function Imagine({ src, alt, className, rezerva }) {
    const [esuat, setEsuat] = useState(!src);
    if (esuat) return rezerva;
    return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setEsuat(true)} />;
}

function Sticker({ text, inline = false }) {
    if (!text) return null;
    return (
        <motion.span
            className={`sticker${inline ? " sticker--inline" : ""}`}
            initial={{ rotate: -30, scale: 0 }}
            animate={{ rotate: -6, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 12 }}
        >
            {text}
        </motion.span>
    );
}

function ContinutZbor({ r, sticker }) {
    const e = r.extra;
    const insigna = (
        <span className="logo-comp" style={{ background: e.culoare ?? "var(--accent)" }} aria-hidden="true">
            {e.cod ?? "✈"}
        </span>
    );
    return (
        <div className="zbor">
            <div className="zbor__companie">
                <Imagine src={r.imagine} alt="" className="zbor__logo" rezerva={insigna} />
                <span>{e.companie}</span>
                <span className="cip">{e.nrZbor}</span>
                <Sticker text={sticker} inline />
            </div>
            <div className="zbor__traseu">
                <div className="zbor__capat">
                    <span className="cod">{e.deLa}</span>
                    <span className="ora">{e.plecare}</span>
                    <span className="oras-mic">{e.orasDin}</span>
                </div>
                <div className="zbor__linie">
                    <span>{e.durata}</span>
                    <span className="linie">
                        <IconAvion className="linie__avion" />
                    </span>
                    <span className={`escala${e.escale === "Direct" ? " escala--direct" : ""}`}>{e.escale}</span>
                </div>
                <div className="zbor__capat zbor__capat--dreapta">
                    <span className="cod">{e.panaLa}</span>
                    <span className="ora">{e.sosire}</span>
                    <span className="oras-mic">{e.orasCatre}</span>
                </div>
            </div>
        </div>
    );
}

function ContinutStandard({ r, sticker }) {
    const ilustratie =
        r.tip === "cazari" ? (
            <IlustratieHotel varianta={r.extra?.varianta ?? 0} />
        ) : (
            <IlustratieMasina forma={r.extra?.forma} culoare={r.extra?.culoare} />
        );
    return (
        <>
            <div className="card__media">
                <Imagine src={r.imagine} alt={r.titlu} className="card__poza" rezerva={ilustratie} />
                <Sticker text={sticker} />
            </div>
            <div className="card__corp">
                <h3>{r.titlu}</h3>
                {r.subtitlu && <p className="card__sub">{r.subtitlu}</p>}
                <ul className="cipuri">
                    {r.extra?.nota && <li className="cip nota">★ {r.extra.nota}</li>}
                    {r.detalii?.map((detaliu) => (
                        <li key={detaliu} className="cip">
                            {detaliu}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

/**
 * Cardul unei oferte. Se înclină 3D după mouse și are un luciu care urmărește cursorul.
 * Zborurile arată ca o carte de îmbarcare, cu cotor detașabil.
 */
export default function ResultCard({ rezultat, salvat, onComutaSalvat, sticker }) {
    const ref = useRef(null);
    const miscareRedusa = useReducedMotion();
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 220, damping: 18 });
    const rotY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 220, damping: 18 });
    const luciuX = useTransform(mx, (v) => `${v * 100}%`);
    const luciuY = useTransform(my, (v) => `${v * 100}%`);
    const luciu = useMotionTemplate`radial-gradient(360px circle at ${luciuX} ${luciuY}, rgb(255 255 255 / 0.45), transparent 50%)`;

    function laMiscare(e) {
        if (miscareRedusa || e.pointerType !== "mouse" || !ref.current) return;
        const box = ref.current.getBoundingClientRect();
        mx.set((e.clientX - box.left) / box.width);
        my.set((e.clientY - box.top) / box.height);
    }

    function laIesire() {
        mx.set(0.5);
        my.set(0.5);
    }

    const texte = TEXTE[rezultat.tip] ?? TEXTE.zboruri;
    const Continut = rezultat.tip === "zboruri" ? ContinutZbor : ContinutStandard;

    return (
        <motion.article
            ref={ref}
            className={`card card--${rezultat.tip}`}
            onPointerMove={laMiscare}
            onPointerLeave={laIesire}
            style={miscareRedusa ? undefined : { rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
            aria-label={rezultat.titlu}
        >
            <motion.div className="card__luciu" style={{ background: luciu }} aria-hidden="true" />
            <div className="card__principal">
                <Continut r={rezultat} sticker={sticker} />
            </div>
            <div className="card__cotor">
                <div className="pret">
                    <span className="pret__eticheta">{texte.eticheta}</span>
                    <span className="pret__rand">
                        <NumarAnimat valoare={rezultat.pret} className="pret__valoare" />
                        <span className="pret__moneda">{rezultat.moneda}</span>
                    </span>
                    {rezultat.pretUnitar && <span className="pret__unitar">{rezultat.pretUnitar}</span>}
                </div>
                <div className="card__actiuni">
                    <a href={rezultat.link} target="_blank" rel="noopener noreferrer" className="buton-link">
                        {texte.verb}
                        <IconSageata />
                        <span className="sr-only"> (se deschide într-o filă nouă)</span>
                    </a>
                    <FavoriteButton salvat={salvat} onClick={onComutaSalvat} eticheta={rezultat.titlu} />
                </div>
            </div>
        </motion.article>
    );
}
