"use client";
import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  setTheme: (theme: "dark" | "light") => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
