import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition.jsx";
import { IconAvion, IconGlob, IconInima, IconSoare } from "../components/Icons.jsx";
import { CULORI_VII } from "../data/culori.js";

const CARTI = [
    {
        Icon: IconAvion,
        titlu: "Caută",
        text: "Zboruri din România spre orice oraș, cazări pe nopți și mașini pe zile. Sortezi și filtrezi după preț."
    },
    {
        Icon: (props) => <IconInima umplut {...props} />,
        titlu: "Salvează",
        text: "Ofertele salvate rămân în browser (localStorage) și se adună într-un buget estimat pe pagina Favorite."
    },
    {
        Icon: IconGlob,
        titlu: "Descoperă",
        text: "Zarul alege o destinație la întâmplare, iar planeta se întoarce spre ruta ei."
    },
    {
        Icon: IconSoare,
        titlu: "Relaxează-te",
        text: "Fiecare tab are cerul lui: zi senină, apus tropical sau road-trip la asfințit."
    }
];

const DATE = [
    ["Zboruri", "Kiwi.com prin RapidAPI, dacă există cheie în .env.local; altfel date demonstrative"],
    ["Cazări", "Booking.com prin RapidAPI, cu aceeași regulă"],
    ["Mașini", "Date demonstrative"],
    ["Poze", "Fotografii Unsplash; dacă una nu se încarcă, apare o ilustrație desenată"],
    ["Curs valutar", "Frankfurter (cursul Băncii Centrale Europene), fără cheie"]
];

const TASTE = [
    ["← →", "schimbă tab-ul de căutare"],
    ["Enter", "trimite formularul"],
    ["Esc", "închide calculatorul valutar"]
];

export default function AboutPage() {
    return (
        <PageTransition className="pagina-despre">
            <section className="erou erou--mic">
                <p className="eyebrow">Despre</p>
                <h1>
                    Drum, pat și volan, <em>într-un loc.</em>
                </h1>
            </section>

            <motion.div className="carti-despre" initial="ascuns" animate="vizibil" variants={{ vizibil: { transition: { staggerChildren: 0.1 } } }}>
                {CARTI.map(({ Icon, titlu, text }, i) => (
                    <motion.article
                        key={titlu}
                        className="panou carte-despre"
                        style={{ "--c": CULORI_VII[i][0], "--c2": CULORI_VII[i][1] }}
                        variants={{
                            ascuns: { opacity: 0, y: 30, rotateX: -24, scale: 0.94 },
                            vizibil: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 16 } }
                        }}
                        whileHover={{ y: -6, rotate: -1.5 }}
                    >
                        <span className="carte-despre__icon">
                            <Icon />
                        </span>
                        <h2>{titlu}</h2>
                        <p>{text}</p>
                    </motion.article>
                ))}
            </motion.div>

            <section className="panou tabel-despre" aria-labelledby="sursa-datelor">
                <h2 id="sursa-datelor">De unde vin datele</h2>
                <dl>
                    {DATE.map(([termen, descriere]) => (
                        <div key={termen} className="tabel-despre__rand">
                            <dt>{termen}</dt>
                            <dd>{descriere}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="panou tabel-despre" aria-labelledby="scurtaturi">
                <h2 id="scurtaturi">Scurtături de tastatură</h2>
                <dl>
                    {TASTE.map(([tasta, descriere]) => (
                        <div key={tasta} className="tabel-despre__rand">
                            <dt>
                                <kbd>{tasta}</kbd>
                            </dt>
                            <dd>{descriere}</dd>
                        </div>
                    ))}
                </dl>
            </section>
        </PageTransition>
    );
}
