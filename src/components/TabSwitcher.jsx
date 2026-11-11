import { useRef } from "react";
import { motion } from "framer-motion";
import { IconAvion, IconMasina, IconPat } from "./Icons.jsx";

export const TABURI = [
    { id: "zboruri", eticheta: "Zboruri", Icon: IconAvion },
    { id: "cazari", eticheta: "Cazări", Icon: IconPat },
    { id: "masini", eticheta: "Mașini", Icon: IconMasina }
];

/** Tab-uri accesibile: se pot schimba și cu săgețile stânga/dreapta. */
export default function TabSwitcher({ activ, onSchimba }) {
    const butoane = useRef({});

    function laTasta(e, index) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        const pas = e.key === "ArrowRight" ? 1 : -1;
        const urmator = TABURI[(index + pas + TABURI.length) % TABURI.length];
        onSchimba(urmator.id);
        butoane.current[urmator.id]?.focus();
    }

    return (
        <div className="taburi" role="tablist" aria-label="Ce cauți">
            {TABURI.map(({ id, eticheta, Icon }, index) => {
                const selectat = id === activ;
                return (
                    <button
                        key={id}
                        ref={(el) => (butoane.current[id] = el)}
                        id={`tab-${id}`}
                        type="button"
                        role="tab"
                        aria-selected={selectat}
                        aria-controls={`panou-${id}`}
                        tabIndex={selectat ? 0 : -1}
                        className={`tab${selectat ? " tab--activ" : ""}`}
                        onClick={() => onSchimba(id)}
                        onKeyDown={(e) => laTasta(e, index)}
                    >
                        {selectat && (
                            <motion.span
                                layoutId="tab-pastila"
                                className="tab__pastila"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className="tab__continut">
                            <Icon />
                            {eticheta}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
