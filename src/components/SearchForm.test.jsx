import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SearchForm from "./SearchForm.jsx";
import { dataAzi } from "../utils/date.js";

function FormularTest({ onSubmit, initial }) {
    const [valori, setValori] = useState(initial);
    return (
        <SearchForm
            tip="zboruri"
            valori={valori}
            onChange={(camp, valoare) => setValori((v) => ({ ...v, [camp]: valoare }))}
            onSubmit={onSubmit}
        />
    );
}

describe("SearchForm", () => {
    it("afișează câmpurile cu etichete", () => {
        render(<FormularTest onSubmit={vi.fn()} initial={{ din: "București", catre: "", data: dataAzi() }} />);
        expect(screen.getByLabelText("De unde pleci")).toHaveValue("București");
        expect(screen.getByLabelText("Unde ajungi")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Caută zboruri" })).toBeInTheDocument();
    });

    it("nu trimite formularul fără destinație și afișează eroarea", () => {
        const onSubmit = vi.fn();
        render(<FormularTest onSubmit={onSubmit} initial={{ din: "București", catre: "", data: dataAzi() }} />);
        fireEvent.click(screen.getByRole("button", { name: "Caută zboruri" }));
        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByRole("alert")).toHaveTextContent("Completează destinația.");
        expect(screen.getByLabelText("Unde ajungi")).toHaveAttribute("aria-invalid", "true");
    });

    it("trimite valorile curățate când formularul e valid", () => {
        const onSubmit = vi.fn();
        render(<FormularTest onSubmit={onSubmit} initial={{ din: "București", catre: "", data: dataAzi() }} />);
        fireEvent.change(screen.getByLabelText("Unde ajungi"), { target: { value: "  Londra " } });
        fireEvent.click(screen.getByRole("button", { name: "Caută zboruri" }));
        expect(onSubmit).toHaveBeenCalledWith({ din: "București", catre: "Londra", data: dataAzi() });
    });
});
