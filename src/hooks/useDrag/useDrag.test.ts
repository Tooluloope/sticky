import { renderHook } from "@testing-library/react";
import { act } from "react";
import { describe, it, expect } from "vitest";
import {
	beforeEachTests,
	afterEachTests,
	mockNote,
	mockStore,
	mockNoteContainer,
	mockContainer,
	mockTrashZone,
} from "../hooks";
import { useDrag } from "./useDrag";

describe("useDrag hook", () => {
	beforeEachTests();
	afterEachTests();
	it("starts dragging correctly", () => {
		const { result } = renderHook(() =>
			useDrag(
				mockNote,
				mockNoteContainer,
				{ current: mockContainer },
				{ current: mockTrashZone },
				mockStore
			)
		);

		act(() => {
			result.current.onDragStart({
				clientX: 150,
				clientY: 150,
			} as React.PointerEvent);
		});

		expect(mockStore.bringToFront).toHaveBeenCalledWith("1");
		expect(mockStore.startDragging).toHaveBeenCalledWith("1");
		expect(mockNoteContainer.style.willChange).toBe("transform");
	});
});
