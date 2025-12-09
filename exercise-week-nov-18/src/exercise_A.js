import React, { createContext, useContext, useState, useCallback } from "react";

const ThemeReadContext = createContext(null);
const ThemeDispatchContext = createContext(null);

function useThemeRead() {
  const value = useContext(ThemeReadContext);
  if (value === null) {
    throw new Error("useThemeRead must be used within ThemeProvider");
  }
  return value;
}

function useThemeDispatch() {
  const toggle = useContext(ThemeDispatchContext);
  if (toggle === null) {
    throw new Error("useThemeDispatch must be used within ThemeProvider");
  }
  return toggle;
}

function ThemeProvider({ children }) {
  const [currentSpell, setCurrentSpell] = useState("lumos");

  const toggleSpell = useCallback(() => {
    setCurrentSpell((spell) => (spell === "lumos" ? "nox" : "lumos"));
  }, []);

  return (
    <ThemeReadContext.Provider value={currentSpell}>
      <ThemeDispatchContext.Provider value={toggleSpell}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeReadContext.Provider>
  );
}

function SpellSwitchButton() {
  const spell = useThemeRead();
  const onToggle = useThemeDispatch();

  return (
    <button
      onClick={onToggle}
      style={{
        padding: "12px 24px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        backgroundColor: spell === "lumos" ? "#dbeafe" : "#1e293b",
        color: spell === "lumos" ? "#1e293b" : "#e0e7ff",
        fontWeight: "600",
        fontSize: 16,
        userSelect: "none",
        transition: "background-color 0.25s ease, color 0.25s ease"
      }}
      aria-label="Toggle spell mode"
      title={`Cast the ${spell === "lumos" ? "nox" : "lumos"} spell`}
    >
      {spell === "lumos" ? "NOX" : "LUMOS"}
    </button>
  );
}

export default function SpellManager() {
  const spell = useThemeRead();

  return (
    <section
      style={{
        height: "100vh",
        margin: 0,
        padding: 32,
        backgroundColor: spell === "lumos" ? "#f9fafb" : "#0f172a",
        color: spell === "lumos" ? "#334155" : "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        transition: "background-color 0.3s ease, color 0.3s ease"
      }}
    >
      <SpellSwitchButton />
      <p style={{ marginTop: 24, fontSize: 18, maxWidth: 480, textAlign: "center" }}>
        Click the button above to cast the spell of night and day!
      </p>
    </section>
  );
}

export function AppContainer() {
  return (
    <ThemeProvider>
      <SpellManager />
    </ThemeProvider>
  );
}
