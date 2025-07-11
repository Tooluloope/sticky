import { useRef } from "react";
import { NoteMenu } from "../note-menu/note-menu";
import type { NoteProps } from "./note.type";
import { NoteHeader } from "./note-header";
import { NoteContent } from "./note-content";
import { useNotesStore } from "../../store/note-store/note-store";
import { useShallow } from "zustand/shallow";

export const Note = ({ note, containerRef, trashZoneRef }: NoteProps) => {
	const noteRef = useRef<HTMLDivElement>(null);

	const { bringToFront } = useNotesStore(
		useShallow(state => ({
			updateNote: state.updateNote,
			bringToFront: state.bringToFront,
		}))
	);

	return (
		<div
			ref={noteRef}
			style={{
				top: note.top,
				left: note.left,
				width: note.width,
				height: note.height,
				backgroundColor: note.color,
				fontFamily: note.font,
				zIndex: note.zIndex,
			}}
			onPointerDown={() => bringToFront(note.id)}
			className="note-container rounded-lg absolute  min-w-[280px] min-h-[250px] flex flex-col group"
		>
			<NoteHeader note={note} />

			<NoteContent note={note} />
			<NoteMenu
				trashZoneRef={trashZoneRef}
				containerRef={containerRef}
				note={note}
				noteContainer={noteRef.current}
			/>
		</div>
	);
};
