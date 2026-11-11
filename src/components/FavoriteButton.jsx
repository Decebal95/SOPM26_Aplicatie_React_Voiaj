import { useState } from "react";
import { motion } from "framer-motion";
import { IconInima } from "./Icons.jsx";

const CULORI = ["#ff3f6c", "#ffc93c", "#2f7bff", "#1fc490", "#7b5cff"];
const PARTICULE = Array.from({ length: 10 }, (_, i) => ({ unghi: (i / 10) * Math.PI * 2, culoare: CULORI[i % CULORI.length] }));

export default function FavoriteButton({ salvat, onClick, eticheta }) {
    const [explozie, setExplozie] = useState(0);

    return (
        <motion.button
            type="button"
            className={`favorit${salvat ? " favorit--activ" : ""}`}
            aria-pressed={salvat}
            aria-label={salvat ? `Scoate ${eticheta} din Favorite` : `Salvează ${eticheta} în Favorite`}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.82 }}
            onClick={() => {
                if (!salvat) setExplozie((n) => n + 1);
                onClick();
            }}
        >
            <motion.span
                key={salvat ? "da" : "nu"}
                className="favorit__icon"
                initial={{ scale: 0.3 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 520, damping: 12 }}
            >
                <IconInima umplut={salvat} />
            </motion.span>
            {explozie > 0 && (
                <span key={explozie} className="explozie" aria-hidden="true">
                    {PARTICULE.map(({ unghi, culoare }) => (
                        <motion.span
                            key={unghi}
                            style={{ background: culoare }}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{ x: Math.cos(unghi) * 30, y: Math.sin(unghi) * 30, opacity: 0, scale: 0.3 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                    ))}
                </span>
            )}
        </motion.button>
    );
}
