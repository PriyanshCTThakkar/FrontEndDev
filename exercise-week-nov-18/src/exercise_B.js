import {
  createContext,
  useContext,
  useReducer,
  useState
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useSearchParams,
  Link
} from "react-router-dom";

// Spell Vault with useReducer

const ADD_SPELL = "ADD_SPELL";
const CONFIRM_SPELL = "CONFIRM_SPELL";
const REMOVE_SPELL = "REMOVE_SPELL";

const initialVault = {
  "spell-lumos-1": {
    id: "spell-lumos-1",
    title: "Lumos",
    gesture: "Light flick upward",
    incantation: "LOO-mos",
    risk: "low",
    description: "Lights the tip of your wand.",
    status: "confirmed",
    createdAt: Date.now() - 50000
  }
};

function spellReducer(state, action) {
  switch (action.type) {
    case ADD_SPELL:
      return {
        ...state,
        [action.payload.id]: { ...action.payload, status: "saving" }
      };
    case CONFIRM_SPELL:
      if (!state[action.payload]) return state;
      return {
        ...state,
        [action.payload]: { ...state[action.payload], status: "saved" }
      };
    case REMOVE_SPELL:
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
}

const SpellVaultContext = createContext();
const SpellDispatchContext = createContext();

function SpellProvider({ children }) {
  const [vault, dispatch] = useReducer(spellReducer, initialVault);

  return (
    <SpellVaultContext.Provider value={vault}>
      <SpellDispatchContext.Provider value={dispatch}>
        {children}
      </SpellDispatchContext.Provider>
    </SpellVaultContext.Provider>
  );
}

function useSpellVault() {
  const context = useContext(SpellVaultContext);
  if (!context) throw new Error("useSpellVault must be used within SpellProvider");
  return context;
}

function useSpellDispatch() {
  const context = useContext(SpellDispatchContext);
  if (!context) throw new Error("useSpellDispatch must be used within SpellProvider");
  return context;
}

// Draft Context

const DraftContext = createContext();
const DraftUpdateContext = createContext();

function DraftProvider({ children }) {
  const [draft, setDraft] = useState(null);

  return (
    <DraftContext.Provider value={draft}>
      <DraftUpdateContext.Provider value={setDraft}>
        {children}
      </DraftUpdateContext.Provider>
    </DraftContext.Provider>
  );
}

function useDraft() {
  const context = useContext(DraftContext);
  if (context === undefined) throw new Error("useDraft must be used within DraftProvider");
  return context;
}

function useSetDraft() {
  const context = useContext(DraftUpdateContext);
  if (context === undefined) throw new Error("useSetDraft must be used within DraftProvider");
  return context;
}

// URL-based mode switching

function useWandMode() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("wandMode") || "preview";

  function setMode(newMode) {
    setSearchParams({ wandMode: newMode });
  }

  return [mode, setMode];
}

// Fake backend save

function fakeSave() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.8) resolve("Saved");
      else reject(new Error("Magic failed! Try again."));
    }, 1500);
  });
}

// Main Components

function SpellLibrary() {
  const vault = useSpellVault();
  const setDraft = useSetDraft();
  const navigate = useNavigate();

  const spells = Object.values(vault).sort((a, b) => b.createdAt - a.createdAt);

  function createNewSpell() {
    const newId = `spell-${Date.now()}`;
    setDraft({
      id: newId,
      title: "",
      gesture: "",
      incantation: "",
      risk: "low",
      description: "",
      status: "draft",
      createdAt: Date.now()
    });
    navigate("/workshop?wandMode=edit");
  }

  function editSpell(spell) {
    setDraft(spell);
    navigate("/workshop?wandMode=edit");
  }

  function previewSpell(spell) {
    setDraft(spell);
    navigate("/workshop?wandMode=preview");
  }

  return (
    <div style={styles.container}>
      <h1>📚 Hogwarts Spell Vault</h1>
      <button onClick={createNewSpell} style={styles.buttonPrimary}>
        Create New Spell
      </button>
      {spells.length === 0 && <p>No spells found. Create one above!</p>}
      <div style={styles.spellList}>
        {spells.map(spell => (
          <div key={spell.id} style={styles.spellCard}>
            <h3>{spell.title || "(Untitled Spell)"}</h3>
            <p><em>Risk: {spell.risk}</em></p>
            <p>{spell.description.substring(0, 60)}{spell.description.length > 60 ? "..." : ""}</p>
            <div>
              <button onClick={() => previewSpell(spell)} style={styles.buttonSecondary}>Preview</button>
              <button onClick={() => editSpell(spell)} style={styles.buttonPrimary}>Edit</button>
              {spell.status === "saving" && <span style={{ marginLeft: 8, color: "orange" }}>Saving...</span>}
              {spell.status === "saved" && <span style={{ marginLeft: 8, color: "green" }}>Saved</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpellWorkshop() {
  const draft = useDraft();
  const setDraft = useSetDraft();
  const dispatch = useSpellDispatch();
  const [mode, setMode] = useWandMode();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!draft) {
    return (
      <div style={styles.container}>
        <p>No spell loaded.</p>
        <Link to="/library" style={styles.link}>Back to Vault</Link>
      </div>
    );
  }

  function updateField(field, value) {
    setDraft({ ...draft, [field]: value });
  }

  async function saveSpell() {
    setSaving(true);
    setError("");

    // Optimistic update
    dispatch({ type: ADD_SPELL, payload: draft });

    try {
      await fakeSave();
      dispatch({ type: CONFIRM_SPELL, payload: draft.id });
      setSaving(false);
      setMode("preview");
    } catch (e) {
      dispatch({ type: REMOVE_SPELL, payload: draft.id });
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1>🪄 Spell Workshop</h1>

      <button
        onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
        style={mode === "edit" ? styles.buttonPrimary : styles.buttonSecondary}
      >
        Switch to {mode === "edit" ? "Preview" : "Edit"} Mode
      </button>

      {mode === "edit" ? (
        <>
          <div style={styles.formGroup}>
            <label>Spell Title</label>
            <input
              value={draft.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Expelliarmus"
              style={styles.input}
              disabled={saving}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Wand Gesture</label>
            <textarea
              value={draft.gesture}
              onChange={(e) => updateField("gesture", e.target.value)}
              placeholder="Sharp flick with wrist"
              style={styles.textarea}
              disabled={saving}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Spoken Incantation</label>
            <input
              value={draft.incantation}
              onChange={(e) => updateField("incantation", e.target.value)}
              placeholder="ex-PELL-ee-ARE-muss"
              style={styles.input}
              disabled={saving}
            />
          </div>

          <div style={styles.formGroup}>
            <label>Risk Level</label>
            <select
              value={draft.risk}
              onChange={(e) => updateField("risk", e.target.value)}
              disabled={saving}
              style={styles.select}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="forbidden">Forbidden</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={draft.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe what the spell does..."
              style={styles.textarea}
              disabled={saving}
            />
          </div>

          <button onClick={saveSpell} disabled={saving} style={styles.buttonPrimary}>
            {saving ? "Saving..." : "Save Spell"}
          </button>

          {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </>
      ) : (
        <div style={styles.preview}>
          <h2>{draft.title || "(Untitled Spell)"}</h2>
          <p><strong>Wand Gesture:</strong> {draft.gesture || "Not specified"}</p>
          <p><strong>Incantation:</strong> {draft.incantation || "Not specified"}</p>
          <p><strong>Risk Level:</strong> {draft.risk}</p>
          <p><strong>Description:</strong> {draft.description || "No description"}</p>
          <Link to="/library" style={styles.link}>Back to Vault</Link>
        </div>
      )}
    </div>
  );
}

export default function SpellScrollApp() {
  return (
    <BrowserRouter>
      <SpellProvider>
        <DraftProvider>
          <Routes>
            <Route path="/" element={<SpellLibrary />} />
            <Route path="/library" element={<SpellLibrary />} />
            <Route path="/workshop" element={<SpellWorkshop />} />
          </Routes>
        </DraftProvider>
      </SpellProvider>
    </BrowserRouter>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "30px auto",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff8dc",
    borderRadius: 8,
    boxShadow: "0 0 10px #ccc"
  },
  buttonPrimary: {
    backgroundColor: "#8b5cf6",
    color: "white",
    border: "none",
    padding: "10px 16px",
    margin: "10px 5px 20px 0",
    borderRadius: 6,
    cursor: "pointer"
  },
  buttonSecondary: {
    backgroundColor: "#f59e0b",
    color: "black",
    border: "none",
    padding: "10px 16px",
    margin: "10px 5px 20px 0",
    borderRadius: 6,
    cursor: "pointer"
  },
  spellList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 20
  },
  spellCard: {
    padding: 15,
    backgroundColor: "white",
    borderRadius: 6,
    boxShadow: "0 1px 4px #aaa"
  },
  formGroup: {
    marginBottom: 15
  },
  input: {
    width: "100%",
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  textarea: {
    width: "100%",
    minHeight: 70,
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box",
    resize: "vertical"
  },
  select: {
    width: "100%",
    padding: 8,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
    boxSizing: "border-box"
  },
  preview: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 6,
    boxShadow: "0 1px 5px #bbb"
  },
  link: {
    marginTop: 20,
    display: "inline-block",
    color: "#8b5cf6",
    textDecoration: "none",
    fontWeight: "bold"
  }
};
