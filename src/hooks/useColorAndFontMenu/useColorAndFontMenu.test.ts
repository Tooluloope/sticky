import { act } from "react";
import { describe, it, expect } from "vitest";
import { useColorAndFontMenu } from "./useColorAndFontMenu";
import { renderHook } from "@testing-library/react";
import { afterEachTests, beforeEachTests, mockNote, mockStore } from "../hooks";

describe("useColorAndFontMenu hook", () => {
	beforeEachTests();
	afterEachTests();
	it("manages color palette visibility", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		act(() => {
			result.current.setShowPalette(true);
		});
		expect(result.current.showPalette).toBe(true);

		act(() => {
			result.current.setShowPalette(false);
		});
		expect(result.current.showPalette).toBe(false);
	});

	it("handles hue change", async () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		await act(async () => {
			result.current.handleHueChange({
				target: { value: "120" },
			} as React.ChangeEvent<HTMLInputElement>);
		});

		expect(result.current.hue).toBe(120);
		expect(mockStore.updateNote).toHaveBeenCalledWith({
			...mockNote,
			color: "hsl(120, 85%, 85%)",
		});
	});

	it("closes menu when clicking outside", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		const palette = document.createElement("div");
		const button = document.createElement("button");
		document.body.appendChild(palette);
		document.body.appendChild(button);

		result.current.colorPaletteRef.current = palette;

		act(() => {
			result.current.setShowPalette(true);
		});

		act(() => {
			const event = new MouseEvent("mousedown", { bubbles: true });
			button.dispatchEvent(event);
		});

		expect(result.current.showPalette).toBe(false);
	});

	it("toggles font menu", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		act(() => {
			result.current.setShowFont(true);
		});
		expect(result.current.showFont).toBe(true);

		act(() => {
			result.current.setShowFont(false);
		});
		expect(result.current.showFont).toBe(false);
	});
});
