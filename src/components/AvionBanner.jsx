/** Avionul cu banner care traversează cerul (animat din CSS). */
export default function AvionBanner() {
    return (
        <div className="avion-banner" aria-hidden="true">
            <svg viewBox="0 0 330 70">
                <path d="M118 36 Q105 30 92 36 T66 36" stroke="#1d2450" strokeWidth="1.5" fill="none" opacity=".5" />
                <path d="M8 14 H160 Q170 14 168 24 L164 34 Q162 42 152 42 H8 Q14 28 8 14 Z" fill="#ffc93c" />
                <path d="M8 14 Q14 28 8 42 L2 40 Q7 28 2 16 Z" fill="#dc9f00" />
                <text x="84" y="34" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="17" fill="#1d2450">
                    Vacanță, nu stres!
                </text>
                <line x1="168" y1="28" x2="208" y2="36" stroke="#1d2450" strokeWidth="1.5" opacity=".6" />
                <g transform="translate(206 14)">
                    <path d="M6 20 Q4 12 14 10 L86 8 Q112 8 120 22 Q112 34 86 34 L14 32 Q4 30 6 20 Z" fill="#ffffff" />
                    <path d="M2 4 L18 10 L20 22 L6 22 Z" fill="#ff4f7b" />
                    <path d="M44 22 L76 22 L58 44 L48 44 Z" fill="#2f7bff" />
                    <path d="M40 18 L70 18 L58 2 L50 2 Z" fill="#2f7bff" opacity=".8" />
                    {[34, 44, 54, 64, 74].map((x) => (
                        <circle key={x} cx={x} cy="17" r="2.6" fill="#7fd3ff" />
                    ))}
                    <path d="M104 14 Q112 15 116 20 L104 20 Z" fill="#1d2450" />
                    <ellipse className="avion-banner__elice" cx="121" cy="22" rx="2" ry="10" fill="#1d2450" opacity=".35" />
                </g>
            </svg>
        </div>
    );
}
