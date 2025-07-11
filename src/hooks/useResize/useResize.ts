import { useRef, useCallback } from "react";
import type { NoteData } from "../../types";

export const useResize = (
	note: NoteData,
	noteContainer: HTMLElement | null,
	callbacks: {
		bringToFront: (id: string) => void;
		startResize: (id: string) => void;
		endResize: () => void;
		updateNote: (note: NoteData) => Promise<void>;
	}
) => {
	const startMousePosRef = useRef({ x: 0, y: 0 });
	const startDimRef = useRef({ width: 0, height: 0 });

	const onResizeStart = (e: React.PointerEvent) => {
		e.stopPropagation();
		callbacks.bringToFront(note.id);
		callbacks.startResize(note.id);
		startDimRef.current = { width: note.width, height: note.height };
		startMousePosRef.current = { x: e.clientX, y: e.clientY };
	};

	const handleResize = useCallback(
		(e: PointerEvent) => {
			if (!noteContainer) return;

			const deltaX = e.clientX - startMousePosRef.current.x;
			const deltaY = e.clientY - startMousePosRef.current.y;
			const newWidth = Math.max(200, startDimRef.current.width + deltaX);
			const newHeight = Math.max(200, startDimRef.current.height + deltaY);

			noteContainer.style.width = `${newWidth}px`;
			noteContainer.style.height = `${newHeight}px`;
		},
		[noteContainer]
	);

	const handleResizeEnd = useCallback(async () => {
		if (!noteContainer) return;

		const { width: rectW, height: rectH } =
			noteContainer.getBoundingClientRect();

		await callbacks.updateNote({
			...note,
			width: rectW,
			height: rectH,
		});
	}, [noteContainer, callbacks, note]);

	return { onResizeStart, handleResize, handleResizeEnd };
};
