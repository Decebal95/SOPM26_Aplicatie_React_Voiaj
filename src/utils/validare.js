import { dataAzi } from "./date.js";
import { normalizeaza } from "./text.js";

/**
 * Validează valorile formularului pentru tipul de căutare.
 * Întoarce erorile (câte un mesaj pentru fiecare câmp greșit) și valorile curățate.
 */
export function valideaza(tip, valori, azi = dataAzi()) {
    const erori = {};
    const curate = {};

    const text = (nume, mesajGol) => {
        const valoare = String(valori[nume] ?? "").trim();
        if (!valoare) erori[nume] = mesajGol;
        else if (valoare.length < 2) erori[nume] = "Scrie cel puțin două litere.";
        curate[nume] = valoare;
    };

    const numar = (nume, min, max, mesaj) => {
        const valoare = Number(valori[nume]);
        if (!Number.isInteger(valoare) || valoare < min || valoare > max) erori[nume] = mesaj;
        curate[nume] = valoare;
    };

    const data = (nume) => {
        const valoare = valori[nume];
        if (!valoare) erori[nume] = "Alege o dată.";
        else if (valoare < azi) erori[nume] = "Data nu poate fi în trecut.";
        curate[nume] = valoare;
    };

    if (tip === "zboruri") {
        text("din", "Completează orașul de plecare.");
        text("catre", "Completează destinația.");
        if (!erori.din && !erori.catre && normalizeaza(curate.din) === normalizeaza(curate.catre)) {
            erori.catre = "Destinația trebuie să fie diferită de plecare.";
        }
        data("data");
    } else if (tip === "cazari") {
        text("oras", "Completează orașul.");
        numar("nopti", 1, 30, "Alege între 1 și 30 de nopți.");
        data("data");
    } else if (tip === "masini") {
        text("oras", "Completează orașul de preluare.");
        numar("zile", 1, 60, "Alege între 1 și 60 de zile.");
        data("data");
    }

    return { erori, curate };
}
