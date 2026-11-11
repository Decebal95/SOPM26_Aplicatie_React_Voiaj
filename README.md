# Voiaj

Aplicație React (Vite) pentru căutarea de zboruri, cazări și mașini de închiriat, cu fundal 3D (three.js / React Three Fiber) și animații Framer Motion.

Tema e luminoasă și jucăușă: fiecare tab are cerul lui (zi senină, apus tropical, road-trip la asfințit), o planetă 3D cu avioane de jucărie pe orbită, baloane cu aer cald la cazări și o șosea cu mașinuțe la mașini. Ofertele au poze Unsplash; dacă o poză nu se încarcă, apare o ilustrație desenată (`components/Ilustratii.jsx`).

## Pornire

```bash
npm install
npm run dev
```

Deschide adresa afișată în terminal, de obicei http://localhost:5173.

Alte comenzi:

```bash
npm run build      # versiunea de producție în dist/
npm run preview    # verifică local versiunea din dist/
npm run test       # Vitest în mod observare
npm run test:run   # rulează testele o singură dată
```

## Date live (opțional)

Fără nicio configurare, aplicația folosește date demonstrative (marcate în interfață).
Pentru zboruri și cazări reale, copiază `.env.example` în `.env.local` și completează cheia RapidAPI:

```
VITE_RAPIDAPI_KEY=cheia-ta
```

Repornește `npm run dev` după ce modifici fișierele `.env`. `.env.local` este în `.gitignore`.
Variabilele `VITE_` ajung în codul trimis browserului, deci pentru producție cererile ar trebui trecute printr-un server propriu.

Cursul valutar vine de la Frankfurter (date BCE) și nu are nevoie de cheie.

## Structura

```
src/
├── main.jsx                 pornește aplicația
├── App.jsx                  rute, providere, fundalul 3D
├── App.css, index.css       stiluri
├── components/
│   ├── Scene3D.jsx          globul, orbitele, soarele, șoseaua neon (three.js)
│   ├── NavBar.jsx           navigare + calculator valutar
│   ├── TabSwitcher.jsx      tab-urile Zboruri / Cazări / Mașini
│   ├── SearchForm.jsx       formular controlat, cu etichete și validare
│   ├── ResultList.jsx       stări: sugestii, încărcare, eroare, gol, listă
│   ├── ResultCard.jsx       card cu înclinare 3D; zborurile sunt cărți de îmbarcare
│   ├── SurpriseBanner.jsx   tabla de plecări pentru „Surprinde-mă“
│   ├── CurrencyModal.jsx    calculator valutar
│   └── ...
├── context/                 Tema (tab-ul activ), Favorite, mesaje toast
├── hooks/                   useLocalStorage, useCautare (fetch + AbortController), useCursValutar
├── pages/                   Caută, Favorite, Despre, 404
├── services/                api.js (RapidAPI) și demo.js (date demonstrative)
├── data/                    destinații, coduri IATA
├── utils/                   validare, date, text
└── test/setup.js
```

## Ce acoperă din laboratoare

| Cerință | Unde |
| --- | --- |
| Proiect Vite, `npm run dev` / `build` / `preview` | `package.json`, `vite.config.js` |
| Componente cu responsabilități clare, props | `src/components/` |
| `useState`, actualizări imutabile (`map`, `filter`, spread) | `SearchPage.jsx`, `SalvateContext.jsx` |
| Formular controlat, `label` + `htmlFor`, validare, `preventDefault` | `SearchForm.jsx`, `utils/validare.js` |
| Liste cu `key` stabil (`id`) | `ResultList.jsx`, `SavedPage.jsx` |
| Stări de încărcare, eroare și listă goală | `ResultList.jsx` |
| Filtrare și sortare (valori derivate, nu stocate) | `ResultList.jsx` |
| `localStorage` printr-un hook propriu | `hooks/useLocalStorage.js` |
| `fetch` cu `AbortController` | `hooks/useCautare.js`, `hooks/useCursValutar.js` |
| React Router (mai multe pagini, 404) | `App.jsx` |
| Context pentru date folosite peste tot | `context/` |
| Configurare prin `.env.local`, fără chei în cod | `services/api.js`, `.env.example` |
| Accesibilitate: elemente semantice, focus vizibil, tastatură, `alt` | toate componentele |
| Teste automate (Vitest + React Testing Library) | fișierele `*.test.js(x)` |

## Publicare

`npm run build` generează `dist/`. Aplicația folosește rute React, deci serviciul de găzduire trebuie să trimită rutele necunoscute către `index.html` (altfel `/salvate` dă 404 la reîncărcare).
