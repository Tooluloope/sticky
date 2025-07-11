import { useEffect, useMemo, useRef } from "react";
import { Header } from "./components/header/header";
import { Main } from "./components/main/main";
import { useLocalStorage } from "./hooks/useLocalStorage/useLocalStorage";
import { Note } from "./components/note/note";
import { ThemeContext } from "./context/theme-context/theme-context";
import { TrashZone } from "./components/trash-zone/trash-zone";
import { useNotesStore } from "./store/note-store/note-store";
import { useShallow } from "zustand/shallow";

const App = () => {
	const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
	const mainRef = useRef<HTMLElement>(null);
	const trashZoneRef = useRef<HTMLDivElement>(null);

	const themeContextValue = useMemo(
		() => ({ theme, setTheme }),
		[setTheme, theme]
	);

	const { notes, isDragging, isResizing } = useNotesStore(
		useShallow(state => ({
			notes: state.notes,
			isDragging: state.draggingId !== null,
			isResizing: state.isResizing,
		}))
	);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	useEffect(() => {
		document.body.style.userSelect = isDragging || isResizing ? "none" : "";
	}, [isDragging, isResizing]);

	return (
		<ThemeContext.Provider value={themeContextValue}>
			<div className="flex flex-col h-screen bg-[var(--background-color)]">
				<Header />
				<Main ref={mainRef}>
					<TrashZone ref={trashZoneRef} isActive={isDragging} />
					{notes.map(note => (
						<Note
							containerRef={mainRef}
							trashZoneRef={trashZoneRef}
							key={note.id}
							note={note}
						/>
					))}
				</Main>
			</div>
		</ThemeContext.Provider>
	);
};

export default App;
