import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition.jsx";

export default function NotFoundPage() {
    return (
        <PageTransition className="pagina-404">
            <section className="erou erou--mic">
                <p className="eyebrow">Eroare 404 · rută inexistentă</p>
                <h1>
                    Zborul acesta <em>nu există.</em>
                </h1>
                <p className="erou__sub">Pagina căutată a fost mutată sau adresa e greșită.</p>
            </section>
            <Link to="/" className="buton-link buton-link--lat">
                Înapoi la căutare
            </Link>
        </PageTransition>
    );
}
