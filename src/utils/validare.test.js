import { describe, expect, it } from "vitest";
import { valideaza } from "./validare.js";

const AZI = "2026-11-09";

describe("valideaza", () => {
    it("acceptă un zbor complet", () => {
        const { erori, curate } = valideaza("zboruri", { din: " București ", catre: "Londra", data: AZI }, AZI);
        expect(erori).toEqual({});
        expect(curate.din).toBe("București");
    });

    it("cere destinația și refuză aceeași plecare și sosire", () => {
        expect(valideaza("zboruri", { din: "București", catre: "   ", data: AZI }, AZI).erori.catre).toMatch(/destinația/i);
        expect(valideaza("zboruri", { din: "Brașov", catre: "brasov", data: AZI }, AZI).erori.catre).toMatch(/diferită/);
    });

    it("refuză o dată din trecut", () => {
        expect(valideaza("masini", { oras: "Roma", zile: "3", data: "2026-11-08" }, AZI).erori.data).toMatch(/trecut/);
    });

    it("transformă nopțile în număr și verifică limitele", () => {
        expect(valideaza("cazari", { oras: "Paris", nopti: "4", data: AZI }, AZI).curate.nopti).toBe(4);
        expect(valideaza("cazari", { oras: "Paris", nopti: "0", data: AZI }, AZI).erori.nopti).toBeDefined();
        expect(valideaza("cazari", { oras: "Paris", nopti: "2.5", data: AZI }, AZI).erori.nopti).toBeDefined();
    });
});
