import { useContext } from "react";
import { ThemeContext } from "../../context/theme-context/theme-context";
import { useShallow } from "zustand/shallow";
import { useNotesStore } from "../../store/note-store/note-store";

export const Header = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("ThemeToggle must be used within ThemeContext");
	const { theme, setTheme } = context;
	const toggle = (): void => setTheme(theme === "light" ? "dark" : "light");

	const { createNote } = useNotesStore(
		useShallow(state => ({
			createNote: state.addNote,
		}))
	);

	return (
		<header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] flex-shrink-0">
			<div className="flex items-center gap-3">
				<span className="material-symbols-outlined text-2xl text-[var(--primary-color)]">
					description
				</span>
				<h1 className="text-xl font-bold text-[var(--text-color)]">
					Sticky Notes
				</h1>
			</div>

			<div className="flex items-center gap-4">
				<button
					onClick={createNote}
					className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-gray-800 font-semibold rounded-md hover:bg-yellow-400"
				>
					<span className="material-symbols-outlined">add</span> {""}
					New Note
				</button>
				<div className="flex items-center gap-2">
					<span className="material-symbols-outlined">light_mode</span>
					<label aria-label="Toggle dark mode" className="theme-switch">
						<input
							name="theme-toggle"
							type="checkbox"
							checked={theme === "dark"}
							onChange={toggle}
						/>
						<span className="slider round"></span>
					</label>
					<span className="material-symbols-outlined">dark_mode</span>
				</div>
			</div>
		</header>
	);
};
