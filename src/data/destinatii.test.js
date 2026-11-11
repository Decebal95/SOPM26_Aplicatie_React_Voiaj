import { describe, expect, it } from "vitest";
import { codIata, distantaKm, gasesteDestinatie, ORIGINE } from "./destinatii.js";

describe("codIata", () => {
    it("recunoaște orașe cu și fără diacritice", () => {
        expect(codIata("București")).toBe("OTP");
        expect(codIata("brasov")).toBe("GHV");
        expect(codIata("  New York ")).toBe("JFK");
    });

    it("folosește primele trei litere pentru orașe necunoscute", () => {
        expect(codIata("Narnia")).toBe("NAR");
        expect(codIata("")).toBe("---");
    });
});

describe("gasesteDestinatie", () => {
    it("găsește destinația și după numele în engleză", () => {
        expect(gasesteDestinatie("London")?.oras).toBe("Londra");
        expect(gasesteDestinatie("Gotham")).toBeNull();
    });
});

describe("distantaKm", () => {
    it("calculează aproximativ distanța București – Londra", () => {
        const londra = gasesteDestinatie("Londra");
        expect(distantaKm(ORIGINE, londra)).toBeGreaterThan(2050);
        expect(distantaKm(ORIGINE, londra)).toBeLessThan(2150);
    });
});
