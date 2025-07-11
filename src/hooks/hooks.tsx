import { afterEach, beforeEach, vi } from "vitest";

// Mock store functions
export const mockStore = {
	bringToFront: vi.fn(),
	startDragging: vi.fn(),
	endDragging: vi.fn(),
	updateNote: vi.fn(),
	deleteNote: vi.fn(),
	startResize: vi.fn(),
	endResize: vi.fn(),
};

// Mock DOM elements
export const mockNote = {
	id: "1",
	left: 100,
	top: 100,
	width: 300,
	height: 200,
	color: "hsl(56, 85%, 85%)",
	title: "Test Note",
	content: "This is a test note content.",
	font: "'Spline Sans', sans-serif",
	zIndex: 10,
};

export const mockContainer = document.createElement("div");
export const mockNoteContainer = document.createElement("div");
export const mockTrashZone = document.createElement("div");

export const beforeEachTests = () =>
	beforeEach(() => {
		document.body.appendChild(mockContainer);
		document.body.appendChild(mockNoteContainer);
		document.body.appendChild(mockTrashZone);

		mockNoteContainer.style.position = "absolute";
		mockNoteContainer.style.left = "100px";
		mockNoteContainer.style.top = "100px";
		mockNoteContainer.style.width = "300px";
		mockNoteContainer.style.height = "200px";
	});

export const afterEachTests = () =>
	afterEach(() => {
		vi.clearAllMocks();
		document.body.innerHTML = "";
	});
