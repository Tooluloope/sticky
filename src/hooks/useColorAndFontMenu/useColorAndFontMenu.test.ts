import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useColorAndFontMenu } from "./useColorAndFontMenu";
import { beforeEachTests, afterEachTests, mockNote, mockStore } from "../hooks";

describe("useColorAndFontMenu hook", () => {
	beforeEach(() => {
		beforeEachTests();
		vi.useFakeTimers();
	});

	afterEach(() => {
		afterEachTests();
		vi.useRealTimers();
	});

	it("toggles palette menu via toggleMenu('palette')", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		act(() => {
			result.current.toggleMenu("palette");
		});
		expect(result.current.showPalette).toBe(true);
		expect(result.current.showFont).toBe(false);
		expect(result.current.showFontSize).toBe(false);

		act(() => {
			result.current.toggleMenu("palette");
		});
		expect(result.current.showPalette).toBe(false);
	});

	it("toggles font menu via toggleMenu('font')", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		act(() => {
			result.current.toggleMenu("font");
		});
		expect(result.current.showFont).toBe(true);
		expect(result.current.showPalette).toBe(false);
		expect(result.current.showFontSize).toBe(false);

		act(() => {
			result.current.toggleMenu("font");
		});
		expect(result.current.showFont).toBe(false);
	});

	it("toggles size menu via toggleMenu('size')", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		act(() => {
			result.current.toggleMenu("size");
		});
		expect(result.current.showFontSize).toBe(true);
		expect(result.current.showPalette).toBe(false);
		expect(result.current.showFont).toBe(false);

		act(() => {
			result.current.toggleMenu("size");
		});
		expect(result.current.showFontSize).toBe(false);
	});

	it("updates hue and calls updateNote on handleHueChange", async () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		await act(async () => {
			result.current.handleHueChange({
				target: { value: "200" },
			} as React.ChangeEvent<HTMLInputElement>);
		});

		expect(result.current.hue).toBe(200);
		expect(mockStore.updateNote).toHaveBeenCalledWith({
			...mockNote,
			color: "hsl(200,85%,85%)",
		});
	});

	it("debounces fontSize updates on handleFontSizeChange", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		mockStore.updateNote.mockClear();

		act(() => {
			result.current.handleFontSizeChange({
				target: { value: "24" },
			} as React.ChangeEvent<HTMLInputElement>);
		});
		expect(result.current.fontSizeLocal).toBe(24);
		expect(mockStore.updateNote).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(60);
		});
		expect(mockStore.updateNote).toHaveBeenCalledWith({
			...mockNote,
			fontSize: 24,
		});
	});

	it("closes an open menu when clicking outside", () => {
		const { result } = renderHook(() =>
			useColorAndFontMenu(mockNote, mockStore.updateNote)
		);

		act(() => {
			result.current.toggleMenu("palette");
		});
		expect(result.current.showPalette).toBe(true);

		const paletteEl = document.createElement("div");
		const outsideEl = document.createElement("div");
		document.body.append(paletteEl, outsideEl);
		result.current.colorPaletteRef.current = paletteEl;

		act(() => {
			outsideEl.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
		});
		expect(result.current.showPalette).toBe(false);

		paletteEl.remove();
		outsideEl.remove();
	});
});
