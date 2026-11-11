import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useSalvate } from "../context/SalvateContext.jsx";
import CurrencyModal from "./CurrencyModal.jsx";
import { IconAvion, IconValuta } from "./Icons.jsx";

const LINKURI = [
    { to: "/", eticheta: "Caută" },
    { to: "/salvate", eticheta: "Favorite" },
    { to: "/despre", eticheta: "Despre" }
];

export default function NavBar() {
    const [calculatorDeschis, setCalculatorDeschis] = useState(false);
    const { salvate } = useSalvate();
    const inchideCalculator = useCallback(() => setCalculatorDeschis(false), []);

    return (
        <>
            <header className="nav">
                <div className="nav__interior">
                    <NavLink to="/" className="logo" aria-label="Voiaj, pagina principală">
                        <motion.span
                            className="logo__avion"
                            aria-hidden="true"
                            initial={{ x: -30, y: 30, scale: 0.3, opacity: 0, rotate: 45 }}
                            animate={{ x: 0, y: 0, scale: 1, opacity: 1, rotate: 45 }}
                            whileHover={{ rotate: 405, transition: { duration: 0.8 } }}
                            transition={{ type: "spring", stiffness: 260, damping: 14 }}
                        >
                            <IconAvion />
                        </motion.span>
                        <span className="logo__litere" aria-hidden="true">
                            {"Voiaj".split("").map((litera, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: 18, scale: 0.4, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.25 + i * 0.08, type: "spring", stiffness: 380, damping: 12 }}
                                >
                                    {litera}
                                </motion.span>
                            ))}
                        </span>
                    </NavLink>

                    <nav className="nav__linkuri" aria-label="Navigare principală">
                        {LINKURI.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end
                                className={({ isActive }) => `nav__link${isActive ? " nav__link--activ" : ""}`}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-pastila"
                                                className="nav__pastila"
                                                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                                            />
                                        )}
                                        <span className="nav__text">{link.eticheta}</span>
                                        {link.to === "/salvate" && salvate.length > 0 && (
                                            <motion.span
                                                key={salvate.length}
                                                className="insigna"
                                                initial={{ scale: 0.3 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                                                aria-label={`${salvate.length} salvate`}
                                            >
                                                {salvate.length}
                                            </motion.span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    <motion.button
                        type="button"
                        className="buton-secundar"
                        onClick={() => setCalculatorDeschis(true)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        aria-haspopup="dialog"
                        aria-label="Curs valutar"
                    >
                        <IconValuta />
                        <span className="ascuns-mobil" aria-hidden="true">
                            Curs valutar
                        </span>
                    </motion.button>
                </div>
            </header>
            <CurrencyModal deschis={calculatorDeschis} onInchide={inchideCalculator} />
        </>
    );
}
