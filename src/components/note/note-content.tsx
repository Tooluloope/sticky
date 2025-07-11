import { useState } from "react";
import type { NoteProps } from "./note.type";
import { useShallow } from "zustand/shallow";
import { useNotesStore } from "../../store/note-store/note-store";

type NoteContentProps = Pick<NoteProps, "note">;

export const NoteContent = ({ note }: NoteContentProps) => {
	const [content, setContent] = useState(note.content);
	const updateNote = useNotesStore(useShallow(state => state.updateNote));

	const handleBlur = async () => {
		await updateNote({ ...note, content });
	};

	return (
		<textarea
			name="note-content"
			className="note-content flex-grow w-full p-4 text-lg text-gray-800 resize-none outline-0"
			value={content}
			onChange={e => setContent(e.target.value)}
			onBlur={handleBlur}
			rows={Math.max(3, Math.floor(note.height / 24))}
			style={{ fontFamily: note.font }}
		/>
	);
};
