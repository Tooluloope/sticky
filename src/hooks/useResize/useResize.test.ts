import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, it, vi, expect } from "vitest";
import {
	beforeEachTests,
	afterEachTests,
	mockNote,
	mockNoteContainer,
	mockStore,
} from "../hooks";
import { useResize } from "./useResize";

describe("useResize hook", () => {
	beforeEachTests();
	afterEachTests();
	it("starts resizing correctly", () => {
		const { result } = renderHook(() =>
			useResize(mockNote, mockNoteContainer, mockStore)
		);

		act(() => {
			result.current.onResizeStart({
				stopPropagation: vi.fn(),
				clientX: 150,
				clientY: 150,
			} as unknown as React.PointerEvent);
		});

		expect(mockStore.bringToFront).toHaveBeenCalledWith("1");
		expect(mockStore.startResize).toHaveBeenCalledWith("1");
	});

	it("handles resize movement", () => {
		const { result } = renderHook(() =>
			useResize(mockNote, mockNoteContainer, mockStore)
		);

		act(() => {
			result.current.onResizeStart({
				stopPropagation: vi.fn(),
				clientX: 150,
				clientY: 150,
			} as unknown as React.PointerEvent);
		});

		act(() => {
			result.current.handleResize({
				clientX: 200,
				clientY: 200,
			} as PointerEvent);
		});

		expect(mockNoteContainer.style.width).toBe("350px");
		expect(mockNoteContainer.style.height).toBe("250px");
	});

	it("maintains minimum size during resize", () => {
		const { result } = renderHook(() =>
			useResize(mockNote, mockNoteContainer, mockStore)
		);

		act(() => {
			result.current.onResizeStart({
				stopPropagation: vi.fn(),
				clientX: 150,
				clientY: 150,
			} as unknown as React.PointerEvent);
		});

		act(() => {
			result.current.handleResize({
				clientX: -200,
				clientY: -200,
			} as PointerEvent);
		});

		expect(mockNoteContainer.style.width).toBe("200px");
		expect(mockNoteContainer.style.height).toBe("200px");
	});
});
