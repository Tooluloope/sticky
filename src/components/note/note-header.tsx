import { useState, useRef, useEffect } from "react";
import type { NoteData } from "../../types";
import { useShallow } from "zustand/shallow";
import { useNotesStore } from "../../store/note-store/note-store";

type NoteHeaderProps = {
	note: NoteData;
};

export const NoteHeader: React.FC<NoteHeaderProps> = ({ note }) => {
	const [editing, setEditing] = useState(false);
	const [title, setTitle] = useState(note.title);
	const inputRef = useRef<HTMLInputElement>(null);

	const { updateNote } = useNotesStore(
		useShallow(state => ({
			updateNote: state.updateNote,
		}))
	);

	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [editing]);

	const save = async () => {
		const newTitle = title.trim() || "Untitled";
		await updateNote({ ...note, title: newTitle });
		setEditing(false);
	};

	return (
		<div className="note-header p-2 border-b border-[var(--note-header-border)]">
			{editing ? (
				<input
					ref={inputRef}
					type="text"
					className="note-title text-xl font-bold text-gray-800 w-full bg-transparent outline-none"
					value={title}
					onChange={e => setTitle(e.target.value)}
					onBlur={save}
					onKeyDown={async e => {
						if (e.key === "Enter") {
							e.preventDefault();
							await save();
						}
					}}
				/>
			) : (
				<button
					className="note-title text-xl font-bold text-gray-800"
					onClick={() => setEditing(true)}
					onKeyDown={e => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setEditing(true);
						}
					}}
					aria-label="Edit note title"
				>
					{note.title}
				</button>
			)}
		</div>
	);
};
