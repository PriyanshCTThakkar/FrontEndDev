import React, { useState } from "react";
import { AppContainer } from "./exercise_A";
import SpellScrollApp from "./exercise_B";

export default function App() {
  const [currentExercise, setCurrentExercise] = useState("A");

  return (
    <div>
      <div style={{
        padding: "20px",
        backgroundColor: "#1f2937",
        display: "flex",
        gap: "10px",
        justifyContent: "center"
      }}>
        <button
          onClick={() => setCurrentExercise("A")}
          style={{
            padding: "10px 20px",
            backgroundColor: currentExercise === "A" ? "#8b5cf6" : "#4b5563",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Exercise A
        </button>
        <button
          onClick={() => setCurrentExercise("B")}
          style={{
            padding: "10px 20px",
            backgroundColor: currentExercise === "B" ? "#8b5cf6" : "#4b5563",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Exercise B
        </button>
      </div>

      {currentExercise === "A" ? <AppContainer /> : <SpellScrollApp />}
    </div>
  );
}
