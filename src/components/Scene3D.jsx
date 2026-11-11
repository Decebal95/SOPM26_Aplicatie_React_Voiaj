import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { DESTINATII, ORIGINE } from "../data/destinatii.js";

/*
 * Fundalul 3D, în stil „jucărie“:
 *  - o planetă cu continente colorate și rute-curcubeu care pleacă din București
 *  - avioane de jucărie pe orbită, cu elice și dâre de nori
 *  - nori pufoși care trec prin cadru
 *  - Cazări: soare la apus și baloane cu aer cald
 *  - Mașini: o șosea cu brazi și mașinuțe în ambele sensuri
 * Lumea se construiește o singură dată (imperativ, cu three.js) și se actualizează la fiecare cadru.
 */

const R = 1.55;
const SEG = 64;
const RAD = 6;
const LUNG_DARA = 22;
const CURCUBEU = ["#ff4f7b", "#ff8a3d", "#ffc93c", "#1fc490", "#2f7bff", "#7b5cff", "#ff6bd6", "#00c2d1", "#ff5e5e", "#9b6bff"];

const PALETE = {
    zboruri: { atm: "#ffffff", nori: "#ffffff", cer: "#cfefff", sol: "#fff1c4", soare: "#fff5df" },
    cazari: { atm: "#ffe0ea", nori: "#ffe8f0", cer: "#ffd6c9", sol: "#ffcf7a", soare: "#ffe3c4" },
    masini: { atm: "#efe8ff", nori: "#f7f1ff", cer: "#e7defd", sol: "#ffd6e6", soare: "#fff0e8" }
};

const ORBITE = [
    { r: 2.15, rot: [0.3, 0, 0.2], v: 0.45, c: "#ff4f7b", extra: false },
    { r: 2.5, rot: [-0.5, 0.3, 0.4], v: -0.35, c: "#ffc93c", extra: false },
    { r: 2.8, rot: [1.0, 0.2, -0.3], v: 0.3, c: "#7b5cff", extra: false },
    { r: 2.35, rot: [0.9, -0.6, 0.5], v: -0.5, c: "#1fc490", extra: false },
    { r: 3.1, rot: [0.2, 0.5, -0.6], v: 0.27, c: "#ff8a3d", extra: true },
    { r: 2.65, rot: [-1.1, 0.1, 0.2], v: 0.4, c: "#2f7bff", extra: true },
    { r: 3.35, rot: [0.6, -0.9, 0.1], v: -0.24, c: "#ff6bd6", extra: true },
    { r: 2.95, rot: [-0.2, 1.2, 0.8], v: 0.33, c: "#00c2d1", extra: true }
];

const amortizare = (viteza, delta) => 1 - Math.exp(-viteza * delta);
const aleator = (a, b) => a + Math.random() * (b - a);

function latLonLaVector(lat, lon, raza) {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lon + 180) * Math.PI) / 180;
    return new THREE.Vector3(-raza * Math.sin(phi) * Math.cos(theta), raza * Math.cos(phi), raza * Math.sin(phi) * Math.sin(theta));
}

/** Textură rotundă și moale, pentru dârele de nori. */
function texturaPuf() {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d");
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.45, "rgba(255,255,255,0.85)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
}

function construiesteLumea() {
    const radacina = new THREE.Group();
    const tmp = new THREE.Vector3();
    const tmp2 = new THREE.Vector3();
    const lambert = (culoare, extra = {}) => new THREE.MeshLambertMaterial({ color: culoare, ...extra });
    const textura = texturaPuf();

    const tinte = {};
    for (const [tema, paleta] of Object.entries(PALETE)) {
        tinte[tema] = Object.fromEntries(Object.entries(paleta).map(([k, v]) => [k, new THREE.Color(v)]));
    }

    // Lumini (intensitățile sunt înmulțite cu π, pentru modul fizic din three.js recent)
    const emisfera = new THREE.HemisphereLight("#cfefff", "#fff1c4", 0.95 * Math.PI);
    const soareLumina = new THREE.DirectionalLight("#fff5df", 0.85 * Math.PI);
    soareLumina.position.set(4, 6, 6);
    radacina.add(emisfera, soareLumina, new THREE.AmbientLight(0xffffff, 0.18 * Math.PI));

    // ---- Planeta: fețe plate colorate după un „zgomot“ simplu ----
    const grupGlob = new THREE.Group();
    const inclinare = new THREE.Group();
    inclinare.rotation.set(0.35, 0, 0.1);
    const rotator = new THREE.Group();
    grupGlob.add(inclinare);
    inclinare.add(rotator);
    radacina.add(grupGlob);

    let geometrieGlob = new THREE.IcosahedronGeometry(R, 4);
    if (geometrieGlob.index) geometrieGlob = geometrieGlob.toNonIndexed();
    const pozitii = geometrieGlob.attributes.position;
    const culori = new Float32Array(pozitii.count * 3);
    const ocean = ["#38aaff", "#2794f0", "#4cb8ff"].map((c) => new THREE.Color(c));
    const uscat = ["#5fd47f", "#43c06b", "#7fdd74"].map((c) => new THREE.Color(c));
    const nisip = new THREE.Color("#ffe39a");
    const gheata = new THREE.Color("#ffffff");
    const munte = new THREE.Color("#c79a6b");
    for (let f = 0; f < pozitii.count; f += 3) {
        tmp.set(0, 0, 0);
        for (let k = 0; k < 3; k++) tmp.add(tmp2.fromBufferAttribute(pozitii, f + k));
        tmp.normalize();
        const v =
            Math.sin(tmp.x * 3.1 + 0.7) * Math.cos(tmp.y * 2.3 - 0.4) +
            Math.sin(tmp.z * 3.7 + 1.9) * 0.7 +
            Math.sin((tmp.x + tmp.z) * 5.3) * 0.25;
        const fata = f / 3;
        let c;
        if (Math.abs(tmp.y) > 0.86) c = gheata;
        else if (v > 1.15) c = munte;
        else if (v > 0.6) c = uscat[fata % 3];
        else if (v > 0.45) c = nisip;
        else c = ocean[fata % 3];
        for (let k = 0; k < 3; k++) {
            culori[(f + k) * 3] = c.r;
            culori[(f + k) * 3 + 1] = c.g;
            culori[(f + k) * 3 + 2] = c.b;
        }
    }
    geometrieGlob.setAttribute("color", new THREE.BufferAttribute(culori, 3));
    geometrieGlob.computeVertexNormals();
    rotator.add(new THREE.Mesh(geometrieGlob, new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true, shininess: 12 })));

    const materialAtmosfera = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.28, side: THREE.BackSide, depthWrite: false });
    const atmosfera = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 40), materialAtmosfera);
    atmosfera.scale.setScalar(1.13);
    grupGlob.add(atmosfera);

    // ---- Rute curcubeu din București ----
    const origine = latLonLaVector(ORIGINE.lat, ORIGINE.lon, R);
    const pin = (pozitie, culoare, raza) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(raza, 12, 12), lambert(culoare, { emissive: culoare, emissiveIntensity: 0.25 }));
        m.position.copy(pozitie).multiplyScalar(1.02);
        rotator.add(m);
        return m;
    };
    pin(origine, "#ffffff", 0.055);

    const arce = DESTINATII.map((d, i) => {
        const capat = latLonLaVector(d.lat, d.lon, R);
        const distanta = origine.distanceTo(capat);
        const mijloc = origine.clone().add(capat).multiplyScalar(0.5).normalize().multiplyScalar(R + Math.max(0.18, distanta * 0.4));
        const curba = new THREE.QuadraticBezierCurve3(origine, mijloc, capat);
        const geometrie = new THREE.TubeGeometry(curba, SEG, 0.013, RAD, false);
        const material = new THREE.MeshBasicMaterial({ color: CURCUBEU[i % CURCUBEU.length], transparent: true, opacity: 0.95 });
        rotator.add(new THREE.Mesh(geometrie, material));
        const m = curba.getPoint(0.5);
        return {
            oras: d.oras,
            curba,
            geometrie,
            material,
            total: geometrie.index.count,
            punct: pin(capat, CURCUBEU[i % CURCUBEU.length], 0.04),
            faza: i / DESTINATII.length,
            unghi: -Math.atan2(m.x, m.z)
        };
    });

    // ---- Avion de jucărie ----
    const materialAlb = lambert("#ffffff");
    const materialGeam = lambert("#7fd3ff");
    const materialElice = lambert("#1d2450");
    function avionJucarie(culoare) {
        const g = new THREE.Group();
        const mc = lambert(culoare);
        const corp = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.32, 10), materialAlb);
        corp.rotation.x = Math.PI / 2;
        const nas = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), mc);
        nas.position.z = 0.16;
        const cabina = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), materialGeam);
        cabina.position.set(0, 0.035, 0.08);
        const aripi = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.016, 0.09), mc);
        aripi.position.z = 0.02;
        const coada = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.012, 0.05), mc);
        coada.position.z = -0.14;
        const deriva = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.06), mc);
        deriva.position.set(0, 0.05, -0.14);
        const elice = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.014, 0.01), materialElice);
        elice.position.z = 0.205;
        g.add(corp, nas, cabina, aripi, coada, deriva, elice);
        g.userData.elice = elice;
        return g;
    }

    // ---- Avioane pe orbită, cu dâre ----
    const grupExtra = new THREE.Group();
    grupGlob.add(grupExtra);
    const materialDara = new THREE.PointsMaterial({ color: "#ffffff", map: textura, size: 0.1, transparent: true, opacity: 0.85, depthWrite: false });
    const orbitale = ORBITE.map((o, i) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(...o.rot);
        (o.extra ? grupExtra : grupGlob).add(pivot);
        const avion = avionJucarie(o.c);
        avion.scale.setScalar(0.95);
        pivot.add(avion);
        const puncte = new Float32Array(LUNG_DARA * 3);
        const geometrie = new THREE.BufferGeometry();
        geometrie.setAttribute("position", new THREE.BufferAttribute(puncte, 3));
        const dara = new THREE.Points(geometrie, materialDara);
        dara.frustumCulled = false;
        radacina.add(dara);
        return { o, pivot, avion, puncte, geometrie, dara, faza: i * 0.8, pornit: false };
    });
    const avionRuta = avionJucarie("#ff4f7b");
    avionRuta.scale.setScalar(0.7);
    rotator.add(avionRuta);

    // ---- Nori pufoși ----
    const materialNori = lambert("#ffffff", { emissive: "#ffffff", emissiveIntensity: 0.35 });
    const geometrieNor = new THREE.SphereGeometry(1, 14, 12);
    const nori = Array.from({ length: 10 }, () => {
        const g = new THREE.Group();
        const n = 4 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) {
            const s = new THREE.Mesh(geometrieNor, materialNori);
            s.scale.setScalar(aleator(0.35, 0.7));
            s.position.set((i - n / 2) * 0.48, Math.random() * 0.25 + (i % 2 ? 0.15 : 0), Math.random() * 0.2);
            g.add(s);
        }
        g.position.set(aleator(-15, 15), aleator(-2.2, 4.6), aleator(-13, -4));
        g.scale.setScalar(aleator(0.8, 1.6));
        radacina.add(g);
        return { g, v: aleator(0.15, 0.4) };
    });

    // ---- Cazări: soare la apus și baloane cu aer cald ----
    const grupCazari = new THREE.Group();
    radacina.add(grupCazari);
    const soare = new THREE.Mesh(new THREE.SphereGeometry(3, 40, 40), new THREE.MeshBasicMaterial({ color: "#ffd36e" }));
    soare.position.set(3.8, -3.2, -14);
    const halou = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshBasicMaterial({ color: "#fff0b0", transparent: true, opacity: 0.35, depthWrite: false })
    );
    halou.position.copy(soare.position);
    grupCazari.add(soare, halou);

    const geometrieAnvelopa = new THREE.SphereGeometry(0.45, 20, 16);
    const geometrieCon = new THREE.ConeGeometry(0.24, 0.32, 20);
    const geometrieBanda = new THREE.TorusGeometry(0.452, 0.035, 8, 32);
    const geometrieCos = new THREE.BoxGeometry(0.14, 0.11, 0.14);
    const materialCos = lambert("#b07a4a");
    const baloane = ["#ff4f7b", "#ffc93c", "#1fc490", "#2f7bff", "#7b5cff", "#ff8a3d", "#ff6bd6"].map((c, i) => {
        const g = new THREE.Group();
        const balon = new THREE.Group();
        const mc = lambert(c);
        const anvelopa = new THREE.Mesh(geometrieAnvelopa, mc);
        anvelopa.scale.set(1, 1.15, 1);
        const con = new THREE.Mesh(geometrieCon, mc);
        con.rotation.x = Math.PI;
        con.position.y = -0.52;
        const banda = new THREE.Mesh(geometrieBanda, materialAlb);
        banda.rotation.x = Math.PI / 2;
        const cos = new THREE.Mesh(geometrieCos, materialCos);
        cos.position.y = -0.82;
        balon.add(anvelopa, con, banda, cos);
        g.add(balon);
        g.position.set((i - 3) * 2.4 + aleator(-0.6, 0.6), aleator(-3.5, 3.5), aleator(-10, -3.5));
        g.scale.setScalar(aleator(0.7, 1.2));
        grupCazari.add(g);
        return { g, balon, faza: Math.random() * 6, v: aleator(0.08, 0.18) };
    });

    // ---- Mașini: șosea cu brazi și mașinuțe ----
    const grupMasini = new THREE.Group();
    grupMasini.position.y = -2.6;
    radacina.add(grupMasini);
    const drum = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 90), lambert("#6c60b8"));
    drum.rotation.x = -Math.PI / 2;
    drum.position.z = -30;
    const iarba = new THREE.Mesh(new THREE.PlaneGeometry(22, 90), lambert("#8be07c"));
    iarba.rotation.x = -Math.PI / 2;
    iarba.position.set(0, -0.01, -30);
    grupMasini.add(drum, iarba);

    const geometrieLinie = new THREE.BoxGeometry(0.09, 0.02, 0.7);
    const materialLinie = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const linii = Array.from({ length: 24 }, (_, i) => {
        const m = new THREE.Mesh(geometrieLinie, materialLinie);
        m.position.set(0, 0.01, 6 - i * 2);
        grupMasini.add(m);
        return m;
    });

    const geometrieCoroana = new THREE.ConeGeometry(0.42, 1.1, 8);
    const geometrieTrunchi = new THREE.CylinderGeometry(0.07, 0.09, 0.35, 6);
    const materialTrunchi = lambert("#9b6a43");
    const materialeCoroana = ["#2fbf71", "#1fa862", "#57d17a"].map((c) => lambert(c));
    const copaci = Array.from({ length: 26 }, (_, i) => {
        const g = new THREE.Group();
        const trunchi = new THREE.Mesh(geometrieTrunchi, materialTrunchi);
        trunchi.position.y = 0.17;
        const coroana = new THREE.Mesh(geometrieCoroana, materialeCoroana[i % 3]);
        coroana.position.y = 0.85;
        g.add(trunchi, coroana);
        g.scale.setScalar(aleator(0.8, 1.4));
        g.position.set((i % 2 ? 1 : -1) * aleator(2.6, 7), 0, 6 - (i / 2) * 3.4);
        grupMasini.add(g);
        return g;
    });

    const geometrieCaroserie = new THREE.BoxGeometry(0.52, 0.2, 0.95);
    const geometrieCabina = new THREE.BoxGeometry(0.42, 0.17, 0.48);
    const geometrieRoata = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12);
    const materialRoata = lambert("#1d2450");
    const masini = ["#ff4f7b", "#ffc93c", "#2f7bff", "#1fc490", "#ff8a3d", "#ff6bd6", "#00c2d1", "#ffffff"].map((c, i) => {
        const g = new THREE.Group();
        const caroserie = new THREE.Mesh(geometrieCaroserie, lambert(c));
        caroserie.position.y = 0.18;
        const cabina = new THREE.Mesh(geometrieCabina, materialGeam);
        cabina.position.set(0, 0.36, -0.04);
        g.add(caroserie, cabina);
        for (const [x, z] of [[-0.27, 0.3], [0.27, 0.3], [-0.27, -0.3], [0.27, -0.3]]) {
            const roata = new THREE.Mesh(geometrieRoata, materialRoata);
            roata.rotation.z = Math.PI / 2;
            roata.position.set(x, 0.1, z);
            g.add(roata);
        }
        const sens = i % 2 ? 1 : -1;
        if (sens < 0) g.rotation.y = Math.PI;
        g.position.set(sens > 0 ? -0.85 : 0.85, 0, aleator(-40, 6));
        grupMasini.add(g);
        return { g, v: sens * aleator(4, 8) };
    });

    const grupuriTema = [
        [grupExtra, "zboruri"],
        [grupCazari, "cazari"],
        [grupMasini, "masini"]
    ];
    grupuriTema.forEach(([g, t]) => g.scale.setScalar(t === "zboruri" ? 1 : 0.0001));
    let numarCadru = 0;

    function actualizeaza({ camera, clock }, delta, { tema, oras, mouse }, viteza) {
        const tReal = clock.elapsedTime;
        const t = tReal * viteza;
        const k = amortizare(3, delta);
        const kc = amortizare(2.2, delta);
        const tc = tinte[tema] ?? tinte.zboruri;
        numarCadru++;

        materialAtmosfera.color.lerp(tc.atm, kc);
        materialNori.color.lerp(tc.nori, kc);
        materialNori.emissive.lerp(tc.nori, kc);
        emisfera.color.lerp(tc.cer, kc);
        emisfera.groundColor.lerp(tc.sol, kc);
        soareLumina.color.lerp(tc.soare, kc);

        // Pe ecran lat planeta stă în dreapta; pe telefon urcă deasupra titlului.
        const inaltime = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        const latime = inaltime * camera.aspect;
        const tinta = latime > 8.5 ? { x: latime * 0.21, y: 0, z: 0, s: 1 } : { x: 0, y: inaltime * 0.24, z: -1.6, s: 0.72 };
        grupGlob.position.x += (tinta.x - grupGlob.position.x) * k;
        grupGlob.position.y += (tinta.y - grupGlob.position.y) * k + Math.sin(tReal * 0.8) * 0.002 * viteza;
        grupGlob.position.z += (tinta.z - grupGlob.position.z) * k;
        grupGlob.scale.setScalar(grupGlob.scale.x + (tinta.s - grupGlob.scale.x) * k);

        const indexActiv = oras ? arce.findIndex((a) => a.oras === oras) : -1;
        if (indexActiv >= 0) {
            const diferenta = arce[indexActiv].unghi - rotator.rotation.y;
            rotator.rotation.y += Math.atan2(Math.sin(diferenta), Math.cos(diferenta)) * amortizare(2, delta);
        } else {
            rotator.rotation.y += delta * 0.14 * viteza;
        }

        // Rutele se desenează pe rând; ruta aleasă rămâne completă și restul se estompează.
        arce.forEach((a, i) => {
            const activ = i === indexActiv;
            const progres = activ || viteza === 0 ? 1 : Math.min(1, ((t * 0.2 + a.faza) % 1.5) / 0.75);
            a.geometrie.setDrawRange(0, Math.floor((progres * a.total) / (RAD * 6)) * RAD * 6);
            const opacitate = indexActiv < 0 ? 0.95 : activ ? 1 : 0.2;
            a.material.opacity += (opacitate - a.material.opacity) * kc;
            a.punct.scale.setScalar(activ ? 1.7 + Math.sin(tReal * 5) * 0.5 : 1);
        });

        const index = indexActiv >= 0 ? indexActiv : Math.floor(t * 0.2) % arce.length;
        const u = (t * (indexActiv >= 0 ? 0.22 : 0.2)) % 1;
        const curba = arce[index].curba;
        avionRuta.position.copy(curba.getPointAt(u));
        rotator.updateMatrixWorld();
        avionRuta.lookAt(rotator.localToWorld(tmp.copy(curba.getPointAt(Math.min(0.999, u + 0.01)))));
        avionRuta.userData.elice.rotation.z += delta * 35;

        grupuriTema.forEach(([g, tm]) => {
            const s = g.scale.x + ((tm === tema ? 1 : 0.0001) - g.scale.x) * amortizare(4, delta);
            g.scale.setScalar(s);
            g.visible = s > 0.01;
        });
        grupGlob.updateMatrixWorld();

        const mutaDara = numarCadru % 3 === 0 && viteza > 0;
        orbitale.forEach((p) => {
            const vizibil = p.pivot.parent.visible;
            p.dara.visible = vizibil;
            if (!vizibil) {
                p.pornit = false;
                return;
            }
            const unghi = t * p.o.v + p.faza;
            const sens = Math.sign(p.o.v) || 1;
            p.avion.position.set(Math.cos(unghi) * p.o.r, 0, Math.sin(unghi) * p.o.r);
            const urmator = unghi + sens * 0.06;
            p.pivot.updateMatrixWorld();
            p.avion.lookAt(p.pivot.localToWorld(tmp.set(Math.cos(urmator) * p.o.r, 0, Math.sin(urmator) * p.o.r)));
            p.avion.rotateZ(sens * 0.35);
            p.avion.userData.elice.rotation.z += delta * 35;
            p.avion.updateMatrixWorld();
            const coada = p.avion.localToWorld(tmp2.set(0, 0, -0.2));
            if (!p.pornit) {
                for (let i = 0; i < LUNG_DARA; i++) p.puncte.set([coada.x, coada.y, coada.z], i * 3);
                p.pornit = true;
            }
            if (mutaDara) p.puncte.copyWithin(3, 0, (LUNG_DARA - 1) * 3);
            p.puncte.set([coada.x, coada.y, coada.z], 0);
            p.geometrie.attributes.position.needsUpdate = true;
        });

        nori.forEach((n) => {
            n.g.position.x += n.v * delta * viteza;
            if (n.g.position.x > 17) n.g.position.x = -17;
        });

        if (grupCazari.visible) {
            halou.scale.setScalar(1.35 + Math.sin(t * 1.3) * 0.06);
            baloane.forEach((b) => {
                b.g.position.y += b.v * delta * viteza;
                b.g.position.x += Math.sin(t * 0.5 + b.faza) * 0.002 * viteza;
                b.g.rotation.y += delta * 0.3 * viteza;
                b.balon.position.y = Math.sin(t * 1.5 + b.faza) * 0.04;
                if (b.g.position.y > 5.5) b.g.position.y = -5.5;
            });
        }

        if (grupMasini.visible) {
            const pas = 5 * delta * viteza;
            linii.forEach((l) => {
                l.position.z += pas;
                if (l.position.z > 7) l.position.z -= 48;
            });
            copaci.forEach((c) => {
                c.position.z += pas;
                if (c.position.z > 7) c.position.z -= 44;
            });
            masini.forEach((m) => {
                m.g.position.z += (m.v + 5) * delta * viteza;
                m.g.position.y = Math.abs(Math.sin(t * 9 + m.v)) * 0.025;
                if (m.g.position.z > 7) m.g.position.z = -40;
                if (m.g.position.z < -40) m.g.position.z = 7;
            });
        }

        // Camera urmărește ușor mouse-ul, pentru adâncime.
        camera.position.x += (mouse.x * 0.6 * viteza - camera.position.x) * amortizare(2, delta);
        camera.position.y += (-mouse.y * 0.4 * viteza - camera.position.y) * amortizare(2, delta);
        camera.lookAt(0, 0, 0);
    }

    function elibereaza() {
        radacina.traverse((obiect) => {
            obiect.geometry?.dispose();
            const materiale = Array.isArray(obiect.material) ? obiect.material : [obiect.material];
            materiale.forEach((m) => m?.dispose());
        });
        textura.dispose();
    }

    return { radacina, actualizeaza, elibereaza };
}

function Lume({ tema, destinatie, viteza }) {
    const lume = useMemo(() => construiesteLumea(), []);
    const stare = useRef({ tema, oras: null, mouse: { x: 0, y: 0 } });

    useEffect(() => () => lume.elibereaza(), [lume]);

    useEffect(() => {
        stare.current.tema = tema;
        stare.current.oras = destinatie?.oras ?? null;
    }, [tema, destinatie]);

    // Canvasul stă în spatele conținutului, deci mouse-ul se urmărește pe toată fereastra.
    useEffect(() => {
        const misca = (e) => {
            stare.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            stare.current.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener("pointermove", misca, { passive: true });
        return () => window.removeEventListener("pointermove", misca);
    }, []);

    useFrame((state, delta) => lume.actualizeaza(state, Math.min(delta, 0.05), stare.current, viteza));

    return <primitive object={lume.radacina} />;
}

export default function Scene3D({ tema, destinatie }) {
    const miscareRedusa = useReducedMotion();
    return (
        <div className="scena3d">
            <Canvas flat camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
                <Lume tema={tema} destinatie={destinatie} viteza={miscareRedusa ? 0 : 1} />
            </Canvas>
        </div>
    );
}
