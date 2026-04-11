"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 border border-border rounded-md"
    >
      {theme === "dark" ? " Light" : " Dark"}
    </button>
  );
}
