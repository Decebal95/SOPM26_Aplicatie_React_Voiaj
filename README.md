# SOPM26_Aplicatie_React_Voi# ✈️ SkyScanner Clone (React)

O aplicație web dezvoltată în **React** pentru căutarea și compararea ofertelor de zboruri, inspirată de funcționalitatea platformei SkyScanner.

Ce problemă rezolvă aplicația?

Elimină necesitatea de a căuta manual bilete de avion pe zeci de site-uri. Oferă utilizatorului o interfață unică pentru a găsi și compara rapid cele mai ieftine și rapide zboruri.

Cine o va folosi și ce acțiuni poate face?

Este destinată **călătorilor și turiștilor**. 

Acțiuni principale: căutarea zborurilor (după rută și dată), filtrarea rezultatelor (după preț/escale), vizualizarea detaliilor și salvarea zborurilor favorite.

Ce informații se afișează și ce se poate modifica?

Informații afișate (read-only): Lista zborurilor, companiile aeriene, prețurile, orele de zbor și escalele.

Informații modificabile (interactive): Datele de căutare (rută, număr pasageri), filtrele aplicate, preferințele contului (monedă, limbă).

4. Datele rămân în browser sau pe server?

Datele necesită salvarea și procesarea pe un server.

Zborurile trebuie preluate în timp real printr-un API extern, iar conturile utilizatorilor și zborurile salvate trebuie stocate într-o bază de date pentru a persista între dispozitive.
Browserul (LocalStorage) este folosit doar temporar, pentru a reține filtrele în sesiunea curentă.

5. Ce pagini/secțiuni sunt necesare?
Home: Motorul principal de căutare.
Search Results: Lista zborurilor + bara de filtre.
Flight Details: Informații specifice despre un zbor ales.
Auth (Login/Register): Pentru crearea contului.
Dashboard/Profil: Zborurile salvate și istoricul.
