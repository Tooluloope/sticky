import { createContext } from "react";
import type { SetState } from "../../types";

type Theme = {
	theme: "light" | "dark";
	setTheme: SetState<"light" | "dark">;
};

export const ThemeContext = createContext<Theme | undefined>(undefined);
