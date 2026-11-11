import { describe, expect, it } from "vitest";
import { genereazaRezultate } from "./demo.js";

describe("genereazaRezultate", () => {
    it("generează între 3 și 7 zboruri sortate crescător după preț", () => {
        const zboruri = genereazaRezultate("zboruri", { din: "București", catre: "Paris", data: "2026-12-01" });
        expect(zboruri.length).toBeGreaterThanOrEqual(3);
        expect(zboruri.length).toBeLessThanOrEqual(7);
        zboruri.slice(1).forEach((zbor, i) => expect(zbor.pret).toBeGreaterThanOrEqual(zboruri[i].pret));
        expect(zboruri[0].extra.deLa).toBe("OTP");
        expect(zboruri[0].extra.panaLa).toBe("CDG");
    });

    it("calculează totalul cazării din prețul pe noapte", () => {
        const cazari = genereazaRezultate("cazari", { oras: "Roma", nopti: 3, data: "2026-12-01" });
        cazari.forEach((c) => {
            const pretNoapte = Number(c.pretUnitar.split(" ")[0]);
            expect(c.pret).toBe(pretNoapte * 3);
        });
    });

    it("dă fiecărei oferte un id unic și un link", () => {
        const masini = genereazaRezultate("masini", { oras: "Cluj", zile: 2, data: "2026-12-01" });
        const iduri = new Set(masini.map((m) => m.id));
        expect(iduri.size).toBe(masini.length);
        masini.forEach((m) => expect(m.link).toMatch(/^https:\/\//));
    });

    it("întoarce o listă goală pentru un tip necunoscut", () => {
        expect(genereazaRezultate("trenuri", {})).toEqual([]);
    });
});
