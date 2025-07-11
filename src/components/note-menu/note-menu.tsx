import { useCallback, useEffect, useRef, useState } from "react";
import type { NoteMenuProps } from "./note-menu.type";
import { colors, fonts } from "../../constants";
import { useShallow } from "zustand/shallow";
import { useNotesStore } from "../../store/note-store/note-store";

export const NoteMenu = ({
	note,
	noteContainer,
	containerRef,
	trashZoneRef,
}: NoteMenuProps) => {
	const [showPalette, setShowPalette] = useState(false);
	const [showFont, setShowFont] = useState(false);
	const [hue, setHue] = useState(56);
	const startMousePosRef = useRef({ x: 0, y: 0 });
	const startNotePosRef = useRef({ left: 0, top: 0 });
	const startDimRef = useRef({ width: 0, height: 0 });
	const rafIdRef = useRef<number | null>(null);
	const container = containerRef.current;
	const trashZone = trashZoneRef.current;
	const colorPaletteRef = useRef<HTMLDivElement>(null);
	const fontMenuRef = useRef<HTMLDivElement>(null);

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
			isResizing: state.isResizing,
			endResize: state.endResize,
			draggingId: state.draggingId,
		}))
	);

	const isDragging = draggingId === note.id;

	const onDragStart = (e: React.PointerEvent) => {
		bringToFront(note.id);
		startDragging(note.id);
		startMousePosRef.current = { x: e.clientX, y: e.clientY };
		startNotePosRef.current = { left: note.left, top: note.top };
		if (noteContainer) {
			noteContainer.style.willChange = "transform";
			noteContainer.style.transform = "translate(0, 0)";
		}
	};

	const onResizeStart = (e: React.PointerEvent) => {
		e.stopPropagation();
		bringToFront(note.id);
		startResize(note.id);
		startDimRef.current = { width: note.width, height: note.height };
		startMousePosRef.current = { x: e.clientX, y: e.clientY };
	};

	const handleHueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newHue = Number(e.target.value);
		setHue(newHue);
		await updateNote({ ...note, color: `hsl(${newHue}, 85%, 85%)` });
	};

	const handleDrag = useCallback(
		(e: PointerEvent) => {
			if (!isDragging || !container || !noteContainer) return;
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
		[container, isDragging, note.left, note.top, noteContainer]
	);

	const handleResize = useCallback(
		(e: PointerEvent) => {
			if (!isResizing || !noteContainer) return;
			const deltaX = e.clientX - startMousePosRef.current.x;
			const deltaY = e.clientY - startMousePosRef.current.y;
			const newWidth = Math.max(200, startDimRef.current.width + deltaX);
			const newHeight = Math.max(200, startDimRef.current.height + deltaY);
			noteContainer.style.width = `${newWidth}px`;
			noteContainer.style.height = `${newHeight}px`;
		},
		[isResizing, noteContainer]
	);

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
		if (isDragging && noteContainer && container && trashZone) {
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
				deleteNote(note.id);
				endDragging();
				return;
			}
			await updateNote({ ...note, left: finalLeft, top: finalTop });
			noteContainer.style.transform = "";
			noteContainer.style.willChange = "";
		}
		if (isResizing && noteContainer) {
			const finalWidth = parseFloat(noteContainer.style.width) || note.width;
			const finalHeight = parseFloat(noteContainer.style.height) || note.height;
			await updateNote({ ...note, width: finalWidth, height: finalHeight });
			noteContainer.style.width = "";
			noteContainer.style.height = "";
		}
		endDragging();
		endResize();
	}, [
		container,
		deleteNote,
		endDragging,
		endResize,
		isDragging,
		isResizing,
		note,
		noteContainer,
		trashZone,
		updateNote,
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

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			if (
				showPalette &&
				colorPaletteRef.current &&
				!colorPaletteRef.current.contains(e.target as Node)
			)
				setShowPalette(false);

			if (
				showFont &&
				fontMenuRef.current &&
				!fontMenuRef.current.contains(e.target as Node)
			)
				setShowFont(false);
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [showPalette, showFont]);

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
							setShowPalette(prev => !prev);
							setShowFont(false);
						}}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--note-menu-hover)] transition-colors cursor-pointer"
					>
						<span className="material-symbols-outlined text-[var(--icon-color)]">
							palette
						</span>
					</button>
					{showPalette && (
						<div
							ref={colorPaletteRef}
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
											setShowPalette(false);
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
								value={hue}
								onChange={handleHueChange}
								className="color-slider"
							/>
						</div>
					)}
				</div>
				<div className="relative">
					<button
						onClick={() => {
							setShowFont(prev => !prev);
							setShowPalette(false);
						}}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--note-menu-hover)] transition-colors cursor-pointer"
					>
						<span className="material-symbols-outlined text-[var(--icon-color)]">
							title
						</span>
					</button>
					{showFont && (
						<div
							ref={fontMenuRef}
							className="absolute bottom-full mb-2 flex flex-col gap-1 bg-[var(--font-selector-bg)] p-2 rounded-lg shadow-md w-36 transition-colors"
						>
							{fonts.map(opt => (
								<button
									key={opt.font}
									className="p-1 text-left hover:bg-[var(--font-selector-hover)] text-[var(--text-color)] transition-colors cursor-pointer"
									style={{ fontFamily: opt.font }}
									onClick={async () => {
										await updateNote({ ...note, font: opt.font });
										setShowFont(false);
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
