import { useMemo } from "react";

const CULORI = ["#ff4f7b", "#ffc93c", "#2f7bff", "#1fc490", "#7b5cff", "#ff8a3d", "#ff6bd6"];

/** Ploaie scurtă de confetti (CSS); se montează din nou cu un `key` nou la fiecare sărbătoare. */
export default function Confetti({ bucati = 46 }) {
    const lista = useMemo(
        () =>
            Array.from({ length: bucati }, (_, i) => ({
                "--c": CULORI[i % CULORI.length],
                "--dx": `${(Math.random() - 0.5) * 520}px`,
                "--dy": `${Math.random() * 420 - 160}px`,
                "--r": `${Math.random() * 900 - 450}deg`,
                animationDelay: `${Math.random() * 120}ms`
            })),
        [bucati]
    );

    return (
        <div className="confetti" aria-hidden="true">
            {lista.map((stil, i) => (
                <span key={i} style={stil} />
            ))}
        </div>
    );
}
