import { lazy, Suspense, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { TemaProvider, useTema } from "./context/TemaContext.jsx";
import { SalvateProvider } from "./context/SalvateContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import NavBar from "./components/NavBar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { suportaWebGL } from "./utils/webgl.js";
import AvionBanner from "./components/AvionBanner.jsx";
import "./App.css";

// Scena 3D (three.js) se încarcă separat, ca prima afișare a paginii să fie rapidă.
const Scene3D = lazy(() => import("./components/Scene3D.jsx"));

function Fundal() {
    const { tema, destinatie } = useTema();
    const [webgl] = useState(suportaWebGL);

    return (
        <div className="fundal" aria-hidden="true">
            <div className="cer cer--zboruri" />
            <div className="cer cer--cazari" />
            <div className="cer cer--masini" />
            {webgl && (
                <ErrorBoundary>
                    <Suspense fallback={null}>
                        <Scene3D tema={tema} destinatie={destinatie} />
                    </Suspense>
                </ErrorBoundary>
            )}
            <AvionBanner />
            <div className="fundal__voal" />
        </div>
    );
}

function RuteAnimate() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0 })}>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<SearchPage />} />
                <Route path="/salvate" element={<SavedPage />} />
                <Route path="/despre" element={<AboutPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    );
}

function Aplicatie() {
    const { tema } = useTema();
    return (
        <div className="app" data-tema={tema}>
            <Fundal />
            <NavBar />
            <main className="continut">
                <RuteAnimate />
            </main>
            <footer className="subsol">
                <span>Voiaj</span>
                <span>Prețurile marcate „Date demonstrative“ sunt orientative.</span>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <MotionConfig reducedMotion="user">
                <TemaProvider>
                    <SalvateProvider>
                        <ToastProvider>
                            <Aplicatie />
                        </ToastProvider>
                    </SalvateProvider>
                </TemaProvider>
            </MotionConfig>
        </BrowserRouter>
    );
}
