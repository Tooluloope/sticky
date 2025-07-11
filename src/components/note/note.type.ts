import type { NoteData } from "../../types";

export type NoteProps = {
	note: NoteData;
	containerRef: React.RefObject<HTMLElement | null>;
	trashZoneRef: React.RefObject<HTMLDivElement | null>;
};
