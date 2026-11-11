import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage.js";

describe("useLocalStorage", () => {
    it("salvează valoarea în localStorage ca JSON", () => {
        const { result } = renderHook(() => useLocalStorage("test:lista", []));
        act(() => result.current[1](["Roma"]));
        expect(result.current[0]).toEqual(["Roma"]);
        expect(JSON.parse(localStorage.getItem("test:lista"))).toEqual(["Roma"]);
    });

    it("citește valoarea salvată anterior", () => {
        localStorage.setItem("test:tab", JSON.stringify("masini"));
        const { result } = renderHook(() => useLocalStorage("test:tab", "zboruri"));
        expect(result.current[0]).toBe("masini");
    });

    it("folosește valoarea inițială dacă datele salvate sunt stricate", () => {
        localStorage.setItem("test:stricat", "{nu e json");
        const { result } = renderHook(() => useLocalStorage("test:stricat", 42));
        expect(result.current[0]).toBe(42);
    });
});
