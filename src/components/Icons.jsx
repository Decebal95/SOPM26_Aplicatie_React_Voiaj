/* Iconițe SVG simple, desenate cu currentColor ca să preia culoarea textului. */

function Iconita({ children, umplut = false, ...props }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill={umplut ? "currentColor" : "none"}
            stroke={umplut ? "none" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            {children}
        </svg>
    );
}

export const IconAvion = (props) => (
    <Iconita umplut {...props}>
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </Iconita>
);

export const IconPat = (props) => (
    <Iconita {...props}>
        <path d="M3 19V6M3 13h18v6M21 13a3 3 0 0 0-3-3h-7v3" />
        <circle cx="7" cy="10" r="2" />
    </Iconita>
);

export const IconMasina = (props) => (
    <Iconita {...props}>
        <path d="M5 17H3v-4l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v4h-2M9 17h6M3 13h18" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
    </Iconita>
);

export const IconInima = ({ umplut, ...props }) => (
    <Iconita umplut={umplut} {...props}>
        <path
            d="M12 20.5s-7.5-4.6-9.2-9.1C1.6 8 3.6 4.5 7.1 4.5c2 0 3.6 1.1 4.9 2.8 1.3-1.7 2.9-2.8 4.9-2.8 3.5 0 5.5 3.5 4.3 6.9-1.7 4.5-9.2 9.1-9.2 9.1z"
            stroke="currentColor"
            strokeWidth={umplut ? 0 : 2}
        />
    </Iconita>
);

export const IconSageata = (props) => (
    <Iconita {...props}>
        <path d="M7 17 17 7M8 7h9v9" />
    </Iconita>
);

export const IconInversare = (props) => (
    <Iconita {...props}>
        <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
    </Iconita>
);

export const IconZar = (props) => (
    <Iconita {...props}>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
    </Iconita>
);

export const IconValuta = (props) => (
    <Iconita {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9.5a3 3 0 0 0-3-1.5c-1.7 0-3 .9-3 2s1 1.7 3 2 3 .9 3 2-1.3 2-3 2a3 3 0 0 1-3-1.5M12 6v2M12 16v2" />
    </Iconita>
);

export const IconX = (props) => (
    <Iconita {...props}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Iconita>
);

export const IconSoare = (props) => (
    <Iconita {...props}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Iconita>
);

export const IconGlob = (props) => (
    <Iconita {...props}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </Iconita>
);
