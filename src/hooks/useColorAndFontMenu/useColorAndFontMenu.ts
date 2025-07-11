import { useState, useRef, useEffect } from "react";
import type { NoteData } from "../../types";

export const useColorAndFontMenu = (
	note: NoteData,
	updateNote: (note: NoteData) => Promise<void>
) => {
	const [showPalette, setShowPalette] = useState(false);
	const [showFont, setShowFont] = useState(false);
	const [hue, setHue] = useState(56);
	const colorPaletteRef = useRef<HTMLDivElement>(null);
	const fontMenuRef = useRef<HTMLDivElement>(null);

	const handleHueChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newHue = Number(e.target.value);
		setHue(newHue);
		await updateNote({ ...note, color: `hsl(${newHue}, 85%, 85%)` });
	};

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

	return {
		showPalette,
		showFont,
		setShowPalette,
		setShowFont,
		hue,
		handleHueChange,
		colorPaletteRef,
		fontMenuRef,
	};
};
