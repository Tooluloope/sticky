export type NoteData = {
	id: string;
	title: string;
	content: string;
	top: number;
	left: number;
	width: number;
	height: number;
	color: string;
	font: string;
	zIndex: number;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
