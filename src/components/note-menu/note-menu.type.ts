import type { NoteData } from "../../types";

export type NoteMenuProps = {
	note: NoteData;
	noteContainer: HTMLDivElement | null;
	containerRef: React.RefObject<HTMLElement | null>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
};
