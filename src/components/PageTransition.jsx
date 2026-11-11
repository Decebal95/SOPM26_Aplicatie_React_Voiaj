import { motion } from "framer-motion";

/** Tranziția dintre pagini: pagina nouă intră de jos, din ceață. */
export default function PageTransition({ children, className = "" }) {
    return (
        <motion.div
            className={`pagina ${className}`}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
            {children}
        </motion.div>
    );
}
