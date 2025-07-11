import { useRef, useCallback } from "react";
import type { NoteData } from "../../types";

export const useDrag = (
	note: NoteData,
	noteContainer: HTMLElement | null,
	containerRef: React.RefObject<HTMLElement | null>,
	trashZoneRef: React.RefObject<HTMLElement | null>,
	callbacks: {
		bringToFront: (id: string) => void;
		startDragging: (id: string) => void;
		endDragging: () => void;
		updateNote: (note: NoteData) => Promise<void>;
		deleteNote: (id: string) => void;
	}
) => {
	const startMousePosRef = useRef({ x: 0, y: 0 });
	const startNotePosRef = useRef({ left: 0, top: 0 });
	const container = containerRef.current;
	const trashZone = trashZoneRef.current;

	const onDragStart = (e: React.PointerEvent) => {
		callbacks.bringToFront(note.id);
		callbacks.startDragging(note.id);
		startMousePosRef.current = { x: e.clientX, y: e.clientY };
		startNotePosRef.current = { left: note.left, top: note.top };

		if (noteContainer) {
			noteContainer.style.willChange = "transform";
			noteContainer.style.transform = "translate(0, 0)";
		}
	};

	const handleDrag = useCallback(
		(e: PointerEvent) => {
			if (!container || !noteContainer) return;

			const deltaX = e.clientX - startMousePosRef.current.x;
			const deltaY = e.clientY - startMousePosRef.current.y;
			let newLeft = startNotePosRef.current.left + deltaX;
			let newTop = startNotePosRef.current.top + deltaY;

			const cR = container.getBoundingClientRect();
			const nR = noteContainer.getBoundingClientRect();

			newLeft = Math.max(0, Math.min(newLeft, cR.width - nR.width));
			newTop = Math.max(0, Math.min(newTop, cR.height - nR.height));

			noteContainer.style.transform = `translate(${newLeft - note.left}px, ${
				newTop - note.top
			}px)`;
		},
		[container, note.left, note.top, noteContainer]
	);

	const handleDragEnd = useCallback(async () => {
		if (!noteContainer || !container || !trashZone) return;

		const computed = window.getComputedStyle(noteContainer);
		const transform = computed.transform;
		let finalLeft = note.left;
		let finalTop = note.top;

		if (transform && transform !== "none") {
			const matrix = new DOMMatrix(transform);
			finalLeft = note.left + matrix.m41;
			finalTop = note.top + matrix.m42;
		}

		const containerRect = container.getBoundingClientRect();
		const noteRect = {
			left: containerRect.left + finalLeft,
			top: containerRect.top + finalTop,
			right: containerRect.left + finalLeft + noteContainer.offsetWidth,
			bottom: containerRect.top + finalTop + noteContainer.offsetHeight,
		};

		const trashRect = trashZone.getBoundingClientRect();
		if (
			noteRect.left < trashRect.right &&
			noteRect.right > trashRect.left &&
			noteRect.top < trashRect.bottom &&
			noteRect.bottom > trashRect.top
		) {
			callbacks.deleteNote(note.id);
			return;
		}

		await callbacks.updateNote({ ...note, left: finalLeft, top: finalTop });
		noteContainer.style.transform = "";
		noteContainer.style.willChange = "";
	}, [noteContainer, container, trashZone, note, callbacks]);

	return { onDragStart, handleDrag, handleDragEnd };
};
