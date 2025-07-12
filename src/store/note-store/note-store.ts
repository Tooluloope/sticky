import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { NoteData } from "../../types";

//using await new Promise((r) => setTimeout(r, 50));
// to simulate a delay for async operations like adding, updating, and deleting notes

const fakeDelay = (ms = 50) => new Promise(resolve => setTimeout(resolve, ms));

type NotesState = {
	notes: NoteData[];
	draggingId: string | null;
	resizingId: string | null;
	isResizing: boolean;
	startResize: (id: string) => void;
	endResize: () => void;
	highestZ: number;
	addNote: () => Promise<void>;
	updateNote: (note: NoteData) => Promise<void>;
	deleteNote: (id: string) => Promise<void>;
	bringToFront: (id: string) => void;
	startDragging: (id: string) => void;
	endDragging: () => void;
};

export const useNotesStore = create<NotesState>()(
	persist(
		(set, get) => ({
			notes: [],
			highestZ: 10,
			draggingId: null,
			resizingId: null,
			isResizing: false,
			startResize: id => {
				const note = get().notes.find(n => n.id === id);
				if (note) {
					set({
						isResizing: true,
						resizingId: id,
					});
				}
			},
			endResize: () => set({ isResizing: false, resizingId: null }),

			addNote: async () => {
				await fakeDelay();
				const { notes, highestZ } = get();
				const newId = uuidv4();
				const newZ = highestZ + 1;
				const note: NoteData = {
					id: newId,
					title: `Note ${notes.length + 1}`,
					content: "",
					top: 32 + (notes.length % 10) * 8,
					left: 32 + (notes.length % 10) * 8,
					width: 384,
					height: 320,
					color: "#fefcbf",
					font: "'Spline Sans', sans-serif",
					zIndex: newZ,
				};
				set({
					notes: [...notes, note],
					highestZ: newZ,
				});
			},

			updateNote: async updated => {
				await fakeDelay();
				set(state => ({
					notes: state.notes.map(n => (n.id === updated.id ? updated : n)),
				}));
			},

			deleteNote: async id => {
				await fakeDelay();
				set(state => ({
					notes: state.notes.filter(n => n.id !== id),
				}));
			},
			startDragging: id => set({ draggingId: id }),
			endDragging: () => set({ draggingId: null }),
			bringToFront: id => {
				const { notes, highestZ } = get();
				const newZ = highestZ + 1;
				set({ highestZ: newZ });
				const note = notes.find(n => n.id === id);
				if (note) {
					set(state => ({
						notes: state.notes.map(n =>
							n.id === id ? { ...n, zIndex: newZ } : n
						),
					}));
				}
			},
		}),
		{
			name: "sticky-notes-storage",
			storage: createJSONStorage(() => localStorage),
		}
	)
);
