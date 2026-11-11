import { useId } from "react";

/*
 * Ilustrații desenate în SVG, folosite când poza unei oferte nu se încarcă.
 * Hotel: 4 scene (plajă, oraș, munte, vilă). Mașină: 4 forme de caroserie, în orice culoare.
 */

function useIdSigur() {
    return `il-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function Cer({ id, sus, jos }) {
    return (
        <>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={sus} />
                    <stop offset="1" stopColor={jos} />
                </linearGradient>
            </defs>
            <rect width="160" height="120" fill={`url(#${id})`} />
        </>
    );
}

function Nor({ x, y, s = 1 }) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
            <ellipse cx="0" cy="0" rx="12" ry="5" />
            <ellipse cx="8" cy="-3" rx="8" ry="5.5" />
            <ellipse cx="-6" cy="-2" rx="6" ry="4" />
        </g>
    );
}

function Brad({ x, y, s = 1 }) {
    return (
        <g transform={`translate(${x} ${y}) scale(${s})`}>
            <rect x="-1.5" y="0" width="3" height="5" fill="#8a5a3a" />
            <path d="M0 -22 L10 -6 L5 -6 L12 2 L-12 2 L-5 -6 L-10 -6 Z" fill="#26a35f" />
            <path d="M0 -22 L10 -6 L5 -6 L12 2 L0 2 Z" fill="#1d8c51" />
        </g>
    );
}

const svgProps = { viewBox: "0 0 160 120", preserveAspectRatio: "xMidYMid slice", "aria-hidden": "true" };

function HotelPlaja({ id }) {
    const ferestre = [];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) ferestre.push(<rect key={`${i}-${j}`} x={37 + i * 16} y={40 + j * 12} width="10" height="7" rx="1.5" fill="#8fd8ff" />);
    return (
        <svg {...svgProps}>
            <Cer id={id} sus="#5fc4ff" jos="#e8f9ff" />
            <circle cx="132" cy="22" r="18" fill="#ffd23f" opacity=".25" />
            <circle cx="132" cy="22" r="12" fill="#ffd23f" />
            <Nor x={28} y={18} />
            <Nor x={92} y={12} s={0.7} />
            <rect y="80" width="160" height="14" fill="#2fb4f0" />
            <path d="M0 86 q10 -4 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fff" strokeWidth="1.5" fill="none" opacity=".85" />
            <rect y="92" width="160" height="28" fill="#ffe2a6" />
            <rect x="30" y="34" width="70" height="58" rx="4" fill="#fff" />
            <rect x="26" y="29" width="78" height="7" rx="3.5" fill="#ff6b6b" />
            {ferestre}
            {[0, 1, 2, 3].map((j) => (
                <line key={j} x1="33" y1={49 + j * 12} x2="97" y2={49 + j * 12} stroke="#ff9fb0" strokeWidth="1.4" />
            ))}
            <rect x="58" y="80" width="14" height="12" rx="2" fill="#ffb347" />
            <path d="M126 106 Q120 82 116 54" stroke="#b07a4a" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <g transform="translate(116 54)" fill="#22b36b">
                <ellipse cx="-12" cy="2" rx="13" ry="4" transform="rotate(25)" />
                <ellipse cx="12" cy="2" rx="13" ry="4" transform="rotate(-25)" />
                <ellipse cx="-10" cy="-4" rx="12" ry="3.5" transform="rotate(-20)" fill="#2fcf7c" />
                <ellipse cx="10" cy="-4" rx="12" ry="3.5" transform="rotate(20)" fill="#2fcf7c" />
                <circle cx="0" cy="2" r="3" fill="#8a5a3a" />
            </g>
            <path d="M6 102 Q18 90 30 102 Z" fill="#ff4f7b" />
            <path d="M14 102 Q18 90 22 102 Z" fill="#fff" />
            <line x1="18" y1="102" x2="18" y2="114" stroke="#8a5a3a" strokeWidth="1.6" />
        </svg>
    );
}

function HotelOras({ id }) {
    const ferestre = [];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 10; j++)
            ferestre.push(<rect key={`${i}-${j}`} x={61 + i * 8.5} y={21 + j * 9.3} width="5" height="5" rx="1" fill={(i * 7 + j * 3) % 4 ? "#ffe17a" : "#6f7cff"} />);
    return (
        <svg {...svgProps}>
            <Cer id={id} sus="#6d5cff" jos="#ffb38a" />
            <circle cx="26" cy="12" r="1.2" fill="#fff" />
            <circle cx="44" cy="24" r="1" fill="#fff" />
            <circle cx="140" cy="10" r="1.3" fill="#fff" />
            <circle cx="30" cy="92" r="17" fill="#ffd36e" opacity=".9" />
            <rect x="0" y="62" width="26" height="58" fill="#8f7dff" />
            <rect x="134" y="70" width="26" height="50" fill="#8f7dff" />
            <rect x="20" y="70" width="30" height="50" rx="2" fill="#4fc2ff" />
            {[0, 1, 2, 3].map((j) => (
                <rect key={j} x="25" y={76 + j * 10} width="20" height="4" rx="1" fill="#d7f2ff" />
            ))}
            <rect x="56" y="14" width="40" height="106" rx="3" fill="#3d4bd6" />
            <rect x="58" y="16" width="5" height="100" fill="#fff" opacity=".15" />
            <line x1="76" y1="14" x2="76" y2="4" stroke="#3d4bd6" strokeWidth="2" />
            <circle cx="76" cy="4" r="2" fill="#ff4f7b" />
            {ferestre}
            <rect x="100" y="44" width="28" height="76" rx="2" fill="#ff7fa8" />
            {[0, 1, 2, 3, 4, 5].map((j) => (
                <g key={j}>
                    <rect x="105" y={50 + j * 11} width="7" height="6" rx="1" fill="#ffe3ef" />
                    <rect x="116" y={50 + j * 11} width="7" height="6" rx="1" fill="#ffe3ef" />
                </g>
            ))}
            <rect x="0" y="112" width="160" height="8" fill="#4436a8" />
        </svg>
    );
}

function HotelMunte({ id }) {
    return (
        <svg {...svgProps}>
            <Cer id={id} sus="#7fd6ff" jos="#eefaff" />
            <circle cx="132" cy="20" r="10" fill="#ffd23f" />
            <Nor x={34} y={22} s={0.9} />
            <polygon points="-10,86 30,30 70,86" fill="#8b98e6" />
            <polygon points="30,30 21,43 28,40 34,46 39,41" fill="#fff" />
            <polygon points="40,86 92,18 144,86" fill="#7380d8" />
            <polygon points="92,18 80,34 89,30 95,37 103,32" fill="#fff" />
            <polygon points="112,86 146,40 180,86" fill="#9aa6ee" />
            <polygon points="146,40 138,51 145,48 151,53" fill="#fff" />
            <path d="M0 92 Q40 76 80 86 T160 82 V120 H0 Z" fill="#6fd37f" />
            <path d="M0 104 Q50 94 100 102 T160 100 V120 H0 Z" fill="#53c26c" />
            <rect x="62" y="72" width="44" height="30" fill="#d4925a" />
            <polygon points="56,74 84,50 112,74" fill="#ff6b4a" />
            <polygon points="62,74 84,56 106,74" fill="#ff8a6a" />
            <rect x="94" y="54" width="6" height="12" fill="#8a4f2b" />
            <circle cx="98" cy="48" r="3" fill="#fff" opacity=".85" />
            <circle cx="102" cy="42" r="4" fill="#fff" opacity=".7" />
            <circle cx="108" cy="35" r="5" fill="#fff" opacity=".5" />
            <rect x="68" y="80" width="10" height="9" rx="1" fill="#ffe17a" />
            <rect x="90" y="80" width="10" height="9" rx="1" fill="#ffe17a" />
            <rect x="80" y="86" width="8" height="16" rx="1" fill="#8a4f2b" />
            <Brad x={30} y={98} />
            <Brad x={44} y={102} s={0.8} />
            <Brad x={128} y={98} s={1.1} />
            <Brad x={144} y={104} s={0.8} />
            <Brad x={16} y={106} s={0.7} />
        </svg>
    );
}

function HotelVila({ id }) {
    return (
        <svg {...svgProps}>
            <Cer id={id} sus="#ffcadd" jos="#fff3e6" />
            <circle cx="136" cy="18" r="11" fill="#ffb86b" />
            <Nor x={40} y={16} s={0.8} />
            <rect x="18" y="30" width="124" height="60" rx="4" fill="#ff9ab5" />
            <rect x="14" y="26" width="132" height="7" rx="3.5" fill="#ff6f99" />
            {[0, 1, 2, 3].map((i) => (
                <path key={`u${i}`} d={`M${30 + i * 28} 90 V64 a10 10 0 0 1 20 0 V90 Z`} fill="#fff4f7" />
            ))}
            {[0, 1, 2, 3].map((i) => (
                <rect key={`f${i}`} x={33 + i * 28} y="40" width="14" height="12" rx="2" fill="#7fd8ff" />
            ))}
            <circle cx="22" cy="26" r="7" fill="#2fbf71" />
            <circle cx="30" cy="22" r="6" fill="#43cf80" />
            <circle cx="140" cy="24" r="7" fill="#2fbf71" />
            <circle cx="148" cy="28" r="5" fill="#ff4f7b" />
            <rect x="0" y="88" width="160" height="6" fill="#ffe9c7" />
            <rect x="0" y="94" width="160" height="26" fill="#3fd0ea" />
            <path d="M6 102 q6 -3 12 0 t12 0 M50 108 q6 -3 12 0 t12 0 M100 101 q6 -3 12 0 t12 0" stroke="#fff" strokeWidth="1.6" fill="none" />
            <circle cx="70" cy="106" r="6" fill="none" stroke="#ff6b6b" strokeWidth="3.5" />
            <line x1="136" y1="70" x2="136" y2="92" stroke="#8a5a3a" strokeWidth="1.6" />
            <path d="M118 72 Q136 54 154 72 Z" fill="#ffc93c" />
            <path d="M130 72 Q136 54 142 72 Z" fill="#fff" />
        </svg>
    );
}

const HOTELURI = [HotelPlaja, HotelOras, HotelMunte, HotelVila];

export function IlustratieHotel({ varianta = 0 }) {
    const id = useIdSigur();
    const Scena = HOTELURI[Math.abs(varianta) % HOTELURI.length];
    return <Scena id={id} />;
}

const FORME = {
    sedan: { corp: "M18 86 L18 74 Q20 66 34 64 L52 62 L64 50 Q68 47 76 47 L104 47 Q112 47 118 54 L128 63 L140 66 Q148 68 148 76 L148 86 Z", g1: "M62 61 L71 50.5 Q73 49 77 49 L90 49 L90 61 Z", g2: "M94 49 L103 49 Q109 49 113 54 L119 61 L94 61 Z", roti: [44, 122], r: 11, fata: 146, spate: 18 },
    hatch: { corp: "M22 86 L22 72 Q24 64 36 62 L50 60 L62 46 Q66 43 74 43 L110 43 Q120 43 126 54 L134 64 Q142 67 142 76 L142 86 Z", g1: "M57 59 L65 46.5 Q67 45 72 45 L90 45 L90 59 Z", g2: "M94 45 L108 45 Q116 45 120 52 L124 59 L94 59 Z", roti: [46, 118], r: 11, fata: 140, spate: 22 },
    suv: { corp: "M16 86 L16 68 Q18 60 30 58 L44 57 L52 42 Q55 38 62 38 L118 38 Q126 38 130 46 L138 58 Q148 60 148 70 L148 86 Z", g1: "M50 56 L56 42.5 Q58 40 63 40 L88 40 L88 56 Z", g2: "M92 40 L117 40 Q123 40 126 46 L131 56 L92 56 Z", roti: [42, 124], r: 12.5, fata: 146, spate: 16 },
    mini: { corp: "M34 86 L34 72 Q36 64 46 62 L56 60 L66 46 Q70 42 78 42 L100 42 Q110 42 116 52 L122 62 Q132 66 132 76 L132 86 Z", g1: "M62 58 L70 46 Q72 44 76 44 L86 44 L86 58 Z", g2: "M90 44 L99 44 Q106 44 110 50 L115 58 L90 58 Z", roti: [54, 112], r: 10.5, fata: 130, spate: 34 }
};

export function IlustratieMasina({ forma = "sedan", culoare = "#2f7bff" }) {
    const id = useIdSigur();
    const f = FORME[forma] ?? FORME.sedan;
    return (
        <svg {...svgProps}>
            <Cer id={id} sus="#8ed9ff" jos="#fff3dc" />
            <circle cx="130" cy="20" r="10" fill="#ffd23f" />
            <Nor x={36} y={18} s={0.9} />
            <Nor x={96} y={28} s={0.6} />
            <path d="M0 80 Q30 62 64 74 T130 68 T160 70 V96 H0 Z" fill="#9be58a" />
            <path d="M0 88 Q40 76 90 84 T160 80 V96 H0 Z" fill="#7ad673" />
            <Brad x={14} y={86} s={0.6} />
            <Brad x={150} y={82} s={0.7} />
            <rect y="94" width="160" height="26" fill="#5c5f82" />
            {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={4 + i * 34} y="106" width="18" height="3" rx="1.5" fill="#fff" />
            ))}
            <ellipse cx="83" cy="104" rx="64" ry="4" fill="#000" opacity=".22" />
            <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".9">
                <line x1="2" y1="72" x2="14" y2="72" />
                <line x1="6" y1="80" x2="16" y2="80" />
                <line x1="0" y1="88" x2="10" y2="88" />
            </g>
            <g className="masina-g" transform="translate(-2 8)">
                <path d={f.corp} fill={culoare} />
                <path d={f.g1} fill="#d6f1ff" />
                <path d={f.g2} fill="#d6f1ff" />
                <rect x={f.fata - 6} y="70" width="6" height="4" rx="2" fill="#ffe17a" />
                <rect x={f.spate} y="70" width="5" height="4" rx="2" fill="#ff3d3d" />
                <rect x={f.spate} y="78" width={f.fata - f.spate} height="3" fill="#000" opacity=".12" />
                {f.roti.map((x) => (
                    <g key={x}>
                        <circle cx={x} cy="86" r={f.r} fill="#2b2d42" />
                        <g className="roata">
                            <circle cx={x} cy="86" r={f.r * 0.48} fill="#d9dce8" />
                            <rect x={x - 1} y={86 - f.r * 0.45} width="2" height={f.r * 0.9} fill="#9aa0b8" />
                        </g>
                    </g>
                ))}
            </g>
        </svg>
    );
}
