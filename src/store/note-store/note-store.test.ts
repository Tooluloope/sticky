import { describe, it, expect, beforeEach } from "vitest";
import { useNotesStore } from "./note-store";

describe("useNotesStore", () => {
	beforeEach(() => {
		localStorage.removeItem("sticky-notes-storage");

		useNotesStore.setState({
			notes: [],
			highestZ: 10,
			draggingId: null,
			isResizing: false,
		});
	});

	it("adds a new note with incremented z-index", async () => {
		expect(useNotesStore.getState().notes).toHaveLength(0);

		await useNotesStore.getState().addNote();

		const notes = useNotesStore.getState().notes;
		expect(notes).toHaveLength(1);
		expect(notes[0].zIndex).toBe(11);
		expect(notes[0].id).toBeDefined();
	});

	it("updates an existing note", async () => {
		await useNotesStore.getState().addNote();
		const note = useNotesStore.getState().notes[0];

		await useNotesStore.getState().updateNote({ ...note, title: "Updated!" });
		expect(useNotesStore.getState().notes[0].title).toBe("Updated!");
	});

	it("deletes a note by id", async () => {
		await useNotesStore.getState().addNote();
		const note = useNotesStore.getState().notes[0];

		await useNotesStore.getState().deleteNote(note.id);
		expect(useNotesStore.getState().notes).toHaveLength(0);
	});

	it("brings a note to front by bumping z-index", async () => {
		await useNotesStore.getState().addNote();
		await useNotesStore.getState().addNote();
		const [first, second] = useNotesStore.getState().notes;

		useNotesStore.getState().bringToFront(first.id);
		const updatedFirst = useNotesStore
			.getState()
			.notes.find(n => n.id === first.id)!;
		expect(updatedFirst.zIndex).toBeGreaterThan(second.zIndex);
	});

	it("toggles dragging state", () => {
		expect(useNotesStore.getState().draggingId).toBeNull();
		useNotesStore.getState().startDragging("foo");
		expect(useNotesStore.getState().draggingId).toBe("foo");
		useNotesStore.getState().endDragging();
		expect(useNotesStore.getState().draggingId).toBeNull();
	});

	it("toggles resizing state", async () => {
		await useNotesStore.getState().addNote();
		const note = useNotesStore.getState().notes[0];

		expect(useNotesStore.getState().isResizing).toBe(false);
		useNotesStore.getState().startResize(note.id);
		expect(useNotesStore.getState().isResizing).toBe(true);

		useNotesStore.getState().endResize();
		expect(useNotesStore.getState().isResizing).toBe(false);
	});
});
