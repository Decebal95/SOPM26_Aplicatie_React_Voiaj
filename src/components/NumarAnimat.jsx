import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { formateazaNumar } from "../utils/text.js";

/** Numărul „urcă“ până la valoarea finală. Cititoarele de ecran primesc direct valoarea finală. */
export default function NumarAnimat({ valoare, zecimale = 0, className }) {
    const miscareRedusa = useReducedMotion();
    const [afisat, setAfisat] = useState(miscareRedusa ? valoare : 0);
    const anterior = useRef(miscareRedusa ? valoare : 0);

    useEffect(() => {
        if (miscareRedusa) {
            anterior.current = valoare;
            setAfisat(valoare);
            return undefined;
        }
        const control = animate(anterior.current, valoare, {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
                anterior.current = v;
                setAfisat(v);
            }
        });
        return () => control.stop();
    }, [valoare, miscareRedusa]);

    return (
        <span className={className}>
            <span aria-hidden="true">{formateazaNumar(afisat, zecimale)}</span>
            <span className="sr-only">{formateazaNumar(valoare, zecimale)}</span>
        </span>
    );
}
