import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { NoteData } from "../../types";
import debounce from "lodash.debounce";

export type MenuKey = "palette" | "font" | "size" | null;

export const useColorAndFontMenu = (
	note: NoteData,
	updateNote: (note: NoteData) => Promise<void>
) => {
	const [openMenu, setOpenMenu] = useState<MenuKey>(null);
	const [hue, setHue] = useState<number>(56);
	const [fontSizeLocal, setFontSizeLocal] = useState<number>(note.fontSize);

	const colorPaletteRef = useRef<HTMLDivElement>(null);
	const fontMenuRef = useRef<HTMLDivElement>(null);
	const fontSizeRef = useRef<HTMLDivElement>(null);

	const debouncedUpdateFontSize = useMemo(
		() =>
			debounce((fs: number) => {
				updateNote({ ...note, fontSize: fs });
			}, 50),
		[note, updateNote]
	);

	const toggleMenu = useCallback((menu: MenuKey) => {
		setOpenMenu(curr => (curr === menu ? null : menu));
	}, []);

	const handleHueChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newHue = +e.target.value;
			setHue(newHue);
			updateNote({ ...note, color: `hsl(${newHue},85%,85%)` });
		},
		[note, updateNote]
	);

	const handleFontSizeChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const fs = +e.target.value;
			setFontSizeLocal(fs);
			debouncedUpdateFontSize(fs);
		},
		[debouncedUpdateFontSize]
	);

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			if (
				openMenu === "palette" &&
				colorPaletteRef.current &&
				!colorPaletteRef.current.contains(e.target as Node)
			) {
				setOpenMenu(null);
			}
			if (
				openMenu === "font" &&
				fontMenuRef.current &&
				!fontMenuRef.current.contains(e.target as Node)
			) {
				setOpenMenu(null);
			}
			if (
				openMenu === "size" &&
				fontSizeRef.current &&
				!fontSizeRef.current.contains(e.target as Node)
			) {
				setOpenMenu(null);
			}
		};
		document.addEventListener("mousedown", onClickOutside);
		return () => document.removeEventListener("mousedown", onClickOutside);
	}, [openMenu]);

	const showFont = openMenu === "font";
	const showPalette = openMenu === "palette";
	const showFontSize = openMenu === "size";

	return {
		toggleMenu,
		showPalette,
		showFont,
		showFontSize,
		hue,
		handleHueChange,
		colorPaletteRef,
		fontMenuRef,
		fontSizeRef,
		fontSizeLocal,
		handleFontSizeChange,
	};
};
