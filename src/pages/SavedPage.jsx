import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import ResultCard from "../components/ResultCard.jsx";
import NumarAnimat from "../components/NumarAnimat.jsx";
import { IconInima } from "../components/Icons.jsx";
import { useSalvate } from "../context/SalvateContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const GRUPURI = [
    { tip: "zboruri", titlu: "Zboruri" },
    { tip: "cazari", titlu: "Cazări" },
    { tip: "masini", titlu: "Mașini" }
];

export default function SavedPage() {
    const { salvate, comuta, goleste } = useSalvate();
    const { arata } = useToast();
    const [confirmaGolire, setConfirmaGolire] = useState(false);

    const grupuri = useMemo(
        () => GRUPURI.map((g) => ({ ...g, elemente: salvate.filter((s) => s.tip === g.tip) })).filter((g) => g.elemente.length > 0),
        [salvate]
    );

    // Bugetul e calculat din lista salvată, nu păstrat separat.
    const buget = salvate.filter((s) => s.moneda === "RON").reduce((total, s) => total + s.pret, 0);

    function scoate(oferta) {
        comuta(oferta);
        arata("Scos din Favorite");
    }

    function golesteTot() {
        goleste();
        setConfirmaGolire(false);
        arata("Lista de favorite a fost golită");
    }

    return (
        <PageTransition className="pagina-salvate">
            <section className="erou erou--mic">
                <p className="eyebrow">Favorite · salvate în acest browser</p>
                <h1>
                    Planul tău de <em>vacanță</em>
                </h1>
            </section>

            {salvate.length === 0 ? (
                <div className="panou gol">
                    <motion.span
                        className="gol__inima"
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                        aria-hidden="true"
                    >
                        <IconInima umplut />
                    </motion.span>
                    <h2>Încă nu ai salvat nimic</h2>
                    <p>Apasă inima de pe orice ofertă și o găsești aici, chiar și după ce închizi browserul.</p>
                    <Link to="/" className="buton-link buton-link--lat">
                        Începe o căutare
                    </Link>
                </div>
            ) : (
                <>
                    <div className="panou rezumat">
                        <div className="rezumat__cifra">
                            <span className="eticheta-mono">Buget estimat</span>
                            <span className="rezumat__suma">
                                <NumarAnimat valoare={buget} /> <small>RON</small>
                            </span>
                        </div>
                        <div className="rezumat__cifra">
                            <span className="eticheta-mono">Oferte</span>
                            <span className="rezumat__suma">{salvate.length}</span>
                        </div>
                        <div className="rezumat__actiune">
                            <AnimatePresence mode="wait" initial={false}>
                                {confirmaGolire ? (
                                    <motion.div key="confirma" className="confirmare" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                                        <span>Ștergi toate ofertele?</span>
                                        <button type="button" className="buton-pericol" onClick={golesteTot}>
                                            Da, șterge
                                        </button>
                                        <button type="button" className="buton-secundar" onClick={() => setConfirmaGolire(false)}>
                                            Nu
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.button
                                        key="goleste"
                                        type="button"
                                        className="buton-secundar"
                                        onClick={() => setConfirmaGolire(true)}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        Golește lista
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {grupuri.map((grup) => (
                        <section key={grup.tip} className="grup" aria-labelledby={`grup-${grup.tip}`}>
                            <h2 id={`grup-${grup.tip}`} className="grup__titlu">
                                {grup.titlu} <span className="insigna">{grup.elemente.length}</span>
                            </h2>
                            <ul className="lista-rezultate">
                                <AnimatePresence>
                                    {grup.elemente.map((oferta) => (
                                        <motion.li
                                            key={oferta.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
                                        >
                                            <ResultCard rezultat={oferta} salvat onComutaSalvat={() => scoate(oferta)} />
                                        </motion.li>
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </section>
                    ))}
                </>
            )}
        </PageTransition>
    );
}
