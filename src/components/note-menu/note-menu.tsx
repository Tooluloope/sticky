import { useRef, useCallback, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { colors, fonts } from "../../constants";
import { useDrag } from "../../hooks/useDrag/useDrag";
import { useResize } from "../../hooks/useResize/useResize";
import { useNotesStore } from "../../store/note-store/note-store";
import type { NoteMenuProps } from "./note-menu.type";
import { useColorAndFontMenu } from "../../hooks/useColorAndFontMenu/useColorAndFontMenu";

export const NoteMenu = ({
	note,
	noteContainer,
	containerRef,
	trashZoneRef,
}: NoteMenuProps) => {
	const rafIdRef = useRef<number | null>(null);

	const {
		updateNote,
		bringToFront,
		deleteNote,
		startDragging,
		draggingId,
		endDragging,
		startResize,
		isResizing,
		endResize,
	} = useNotesStore(
		useShallow(state => ({
			updateNote: state.updateNote,
			bringToFront: state.bringToFront,
			deleteNote: state.deleteNote,
			startDragging: state.startDragging,
			endDragging: state.endDragging,
			startResize: state.startResize,
			isResizing: state.isResizing && state.resizingId === note.id,
			endResize: state.endResize,
			draggingId: state.draggingId,
		}))
	);

	const isDragging = draggingId === note.id;

	const dragCallbacks = {
		bringToFront,
		startDragging,
		endDragging,
		updateNote,
		deleteNote,
	};
	const { onDragStart, handleDrag, handleDragEnd } = useDrag(
		note,
		noteContainer,
		containerRef,
		trashZoneRef,
		dragCallbacks
	);

	const resizeCallbacks = {
		bringToFront,
		startResize,
		endResize,
		updateNote,
	};
	const { onResizeStart, handleResize, handleResizeEnd } = useResize(
		note,
		noteContainer,
		resizeCallbacks
	);

	const menu = useColorAndFontMenu(note, updateNote);

	const handleMouseMove = useCallback(
		(e: PointerEvent) => {
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = requestAnimationFrame(() => {
				if (isDragging) handleDrag(e);
				else if (isResizing) handleResize(e);
			});
		},
		[handleDrag, handleResize, isDragging, isResizing]
	);

	const handleMouseUp = useCallback(async () => {
		if (!isDragging && !isResizing) return;

		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
			rafIdRef.current = null;
		}

		if (isDragging) await handleDragEnd();
		if (isResizing) await handleResizeEnd();

		endDragging();
		endResize();
	}, [
		isDragging,
		isResizing,
		handleDragEnd,
		handleResizeEnd,
		endDragging,
		endResize,
	]);

	useEffect(() => {
		document.addEventListener("pointermove", handleMouseMove);
		document.addEventListener("pointerup", handleMouseUp);

		return () => {
			document.removeEventListener("pointermove", handleMouseMove);
			document.removeEventListener("pointerup", handleMouseUp);
			if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
		};
	}, [handleMouseMove, handleMouseUp]);

	return (
		<div
			onPointerDown={e => e.target === e.currentTarget && onDragStart(e)}
			style={{ cursor: isDragging ? "grabbing" : "grab" }}
			className="note-menu mt-auto flex items-center justify-between p-2 border-t border-[var(--note-header-border)] bg-[var(--note-menu-bg)] backdrop-blur-sm"
		>
			<div className="flex items-center gap-1">
				<button
					onPointerDown={onDragStart}
					className="drag-handle w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--note-menu-hover)] transition-colors cursor-move"
				>
					<span className="material-symbols-outlined text-[var(--icon-color)]">
						drag_indicator
					</span>
				</button>
				<div className="relative">
					<button
						onClick={() => {
							menu.setShowPalette(prev => !prev);
							menu.setShowFont(false);
						}}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--note-menu-hover)] transition-colors cursor-pointer"
					>
						<span className="material-symbols-outlined text-[var(--icon-color)]">
							palette
						</span>
					</button>
					{menu.showPalette && (
						<div
							ref={menu.colorPaletteRef}
							className="color-palette-container absolute bottom-full mb-2 bg-[var(--palette-bg)] p-3 rounded-lg shadow-lg transition-colors border border-[var(--border-color)]"
						>
							<div
								className="color-preview w-full h-10 rounded-md mb-3 border border-[var(--note-header-border)]"
								style={{ backgroundColor: note.color }}
							/>
							<div className="grid grid-cols-6 gap-2 mb-3">
								{colors.map(c => (
									<button
										key={c}
										className={`color-swatch w-7 h-7 rounded-full cursor-pointer border-2 hover:border-gray-400 ${
											c === note.color ? "active" : "border-transparent"
										}`}
										style={{ backgroundColor: c }}
										onClick={async () => {
											await updateNote({ ...note, color: c });
											menu.setShowPalette(false);
										}}
									/>
								))}
							</div>
							<label
								htmlFor="hue-slider"
								className="text-xs font-medium text-[var(--text-color)]/80"
							>
								Custom Color
							</label>
							<input
								id="hue-slider"
								type="range"
								min="0"
								max="360"
								value={menu.hue}
								onChange={menu.handleHueChange}
								className="color-slider"
							/>
						</div>
					)}
				</div>
				<div className="relative">
					<button
						onClick={() => {
							menu.setShowFont(prev => !prev);
							menu.setShowPalette(false);
						}}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--note-menu-hover)] transition-colors cursor-pointer"
					>
						<span className="material-symbols-outlined text-[var(--icon-color)]">
							title
						</span>
					</button>
					{menu.showFont && (
						<div
							ref={menu.fontMenuRef}
							className="absolute bottom-full mb-2 flex flex-col gap-1 bg-[var(--font-selector-bg)] p-2 rounded-lg shadow-md w-36 transition-colors"
						>
							{fonts.map(opt => (
								<button
									key={opt.font}
									className="p-1 text-left hover:bg-[var(--font-selector-hover)] text-[var(--text-color)] transition-colors cursor-pointer"
									style={{ fontFamily: opt.font }}
									onClick={async () => {
										await updateNote({ ...note, font: opt.font });
										menu.setShowFont(false);
									}}
								>
									{opt.label}
								</button>
							))}
						</div>
					)}
				</div>
				<button
					onClick={() => bringToFront(note.id)}
					className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--note-menu-hover)] transition-colors cursor-pointer"
				>
					<span className="material-symbols-outlined text-[var(--icon-color)]">
						flip_to_front
					</span>
				</button>
				<button
					onClick={async () => await deleteNote(note.id)}
					className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-200 transition-colors cursor-pointer"
				>
					<span className="material-symbols-outlined text-red-500">delete</span>
				</button>
			</div>
			<div
				onPointerDown={onResizeStart}
				className="resize-handle cursor-nwse-resize rounded-full p-1 hover:bg-[var(--note-menu-hover)] transition-colors"
			>
				<span className="material-symbols-outlined text-[var(--icon-color)]">
					open_in_full
				</span>
			</div>
		</div>
	);
};
