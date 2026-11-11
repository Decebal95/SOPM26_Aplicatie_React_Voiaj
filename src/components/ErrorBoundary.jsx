import { Component } from "react";

/** Dacă scena 3D eșuează (placă video veche, WebGL oprit), aplicația continuă fără ea. */
export default class ErrorBoundary extends Component {
    state = { eroare: null };

    static getDerivedStateFromError(eroare) {
        return { eroare };
    }

    componentDidCatch(eroare) {
        console.warn("O parte a interfeței a fost dezactivată:", eroare);
    }

    render() {
        return this.state.eroare ? (this.props.fallback ?? null) : this.props.children;
    }
}
