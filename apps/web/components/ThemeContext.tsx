"use client";
import { createContext, useContext } from "react";

export interface ThemeContextType {
	theme: string;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: "dark",
	toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);
