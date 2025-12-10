# ⚡ Quidditch League Management System

**Micro-SaaS League Management Platform for the Ministry of Magic**

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-7.1-FF4154?style=for-the-badge&logo=react-router&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## Project Description

The **Quidditch League Management System** is a **Full-Stack Micro-SaaS League Management Platform** designed for the Ministry of Magic's sports administration division. Built with React, TypeScript, TanStack Router, Firebase, and Vite, this production-ready dashboard demonstrates **Domain-Driven Design (DDD)** principles through thematic naming conventions that create an immersive development experience while maintaining enterprise-grade architectural patterns.

This project was built using **TanStack Router v7 starter code** and enhanced with enterprise-grade patterns, **Firebase Authentication**, and **Firestore Database** to create a fully functional, production-ready league management system.

Unlike typical CRUD applications, this project showcases:

- **Firebase Backend Integration**: Real authentication and cloud database persistence
- **Domain-Driven Design (DDD)**: Thematic naming that maps directly to standard technical patterns
- **Feature-Based Architecture**: Self-contained modules instead of component/page separation
- **Type-Safe Routing**: TanStack Router v7 with file-based route configuration
- **Enterprise Patterns**: Singleton services, protected routes, state machines, and separation of concerns
- **Type-Safe Development**: TypeScript strict mode with comprehensive type definitions
- **Production-Ready Code**: Scalable patterns suitable for real-world SaaS applications
- **Real Authentication**: Firebase Auth with email/password signup and login
- **Cloud Database**: Firestore for persistent data storage across devices

**The Core Philosophy**: Every file name tells a story while implementing battle-tested software patterns. This demonstrates that good architecture can be both functional _and_ creative.

---

## Architecture & Terminology Map

### **Codebase Glossary: Thematic Names → Technical Concepts**

This section is **critical** for understanding the codebase. The thematic naming follows Domain-Driven Design principles—each name has a direct technical mapping:

| Thematic Name           | Technical Concept                    | File/Location                                                 | Purpose                                                                                                |
| ----------------------- | ------------------------------------ | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **OwlPostService**      | Firebase Service Layer (Singleton)   | `src/services/OwlPostService.ts`                              | Centralized data access layer with Firestore persistence. All CRUD operations use Firebase SDK.        |
| **MinistryAuthContext** | Firebase Auth State Provider         | `src/features/MinistryAuth/context/MinistryAuthContext.tsx`   | Global auth context using Firebase Authentication with `useReducer`. Real signup/login/logout.         |
| **NavigationSpell**     | Navigation Bar Component             | `src/components/Layout/NavigationSpell.tsx`                   | Persistent navigation header with authentication-aware UI. Shows/hides links based on auth state.      |
| **RecruitmentForm**     | Create/POST Form Component           | `src/features/QuidditchLeague/components/RecruitmentForm.tsx` | Controlled form component for creating new team records in Firestore. Validates input before submit.   |
| **DraftPlayerForm**     | Create/POST Form Component           | `src/features/QuidditchLeague/components/DraftPlayerForm.tsx` | Controlled form component for creating new player records in Firestore. Handles position selection.    |
| **MatchResultForm**     | Create/POST Form Component           | `src/features/QuidditchLeague/components/MatchResultForm.tsx` | Modal form for recording match results. Uses Firestore batch writes for atomic updates.                |
| **LeagueScroll**        | Data List Component (Presentational) | `src/features/QuidditchLeague/components/LeagueScroll.tsx`    | Pure presentational component that renders team list. Receives data via props.                         |
| **PlayerScroll**        | Data List Component (Presentational) | `src/features/QuidditchLeague/components/PlayerScroll.tsx`    | Pure presentational component that renders player roster. Grouped by team.                             |
| **useTeamList**         | Custom Hook (Business Logic)         | `src/features/QuidditchLeague/hooks/useTeamList.ts`           | Encapsulates team CRUD operations with Firestore. Returns state, data, and action functions.           |
| **usePlayerRoster**     | Custom Hook (Business Logic)         | `src/features/QuidditchLeague/hooks/usePlayerRoster.ts`       | Encapsulates player CRUD operations with Firestore. Filters by team and manages state.                 |
| **useMatchStats**       | Custom Hook (Business Logic)         | `src/features/QuidditchLeague/hooks/useMatchStats.ts`         | Manages match recording with Firestore batch writes. Calculates league standings from match data.      |
| **DarkMagicError**      | Custom Error Class                   | `src/services/OwlPostService.ts`                              | Domain-specific error type thrown when Firestore operations fail. Extends native Error.                |
| **DashboardPage**       | Feature Component (Smart)            | `src/features/QuidditchLeague/components/DashboardPage.tsx`   | Central hub with quick action cards. Routes to Teams, Players, Stats pages.                            |
| **PlayersPage**         | Feature Component (Smart)            | `src/features/QuidditchLeague/components/PlayersPage.tsx`     | Container that uses `usePlayerRoster` hook and passes data to `PlayerScroll` presentational component. |
| **StatsPage**           | Feature Component (Smart)            | `src/features/QuidditchLeague/components/StatsPage.tsx`       | Container that uses `useMatchStats` hook. Displays league table and recent matches from Firestore.     |
| **Wizard**              | User Type Definition                 | `src/types/wizardry.ts`                                       | TypeScript interface representing authenticated Firebase user. Contains name, house, role, galleons.   |
| **Team**                | Entity Type Definition               | `src/types/wizardry.ts`                                       | TypeScript interface for team records in Firestore. Includes wins/losses/draws for standings.          |
| **Player**              | Entity Type Definition               | `src/types/wizardry.ts`                                       | TypeScript interface for player records in Firestore. Linked to team via `teamId` foreign key.         |
| **Match**               | Entity Type Definition               | `src/types/wizardry.ts`                                       | TypeScript interface for match records in Firestore. Stores homeTeam, awayTeam, scores, date, stadium. |

### **Why This Naming Strategy?**

This thematic naming demonstrates **strict adherence to Domain-Driven Design**:

1. **Ubiquitous Language**: The codebase uses domain terminology consistently
2. **Bounded Context**: Each feature module is self-contained with clear boundaries
3. **Expressive Intent**: File names communicate their purpose within the domain model
4. **Technical Clarity**: Despite creative names, the underlying patterns are industry-standard

A developer familiar with React patterns will immediately recognize:

- `OwlPostService` = Firebase Service Layer
- `useTeamList` = Data Fetching Hook
- `LeagueScroll` = Presentational Component
- `MinistryAuthContext` = Firebase Auth State Provider

---

## Technical Highlights

### **1. Firebase Backend Integration**

**Pattern**: Production-ready backend with Firebase Authentication and Firestore Database.

The application uses Firebase as its backend-as-a-service (BaaS), providing:

- **Authentication**: Email/password signup and login with Firebase Auth
- **Database**: Cloud Firestore for real-time data persistence
- **Security**: Firestore security rules and Firebase Authentication
- **Scalability**: Automatic scaling with Firebase's infrastructure

**Firebase Configuration**:

```typescript
// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: "quidditch-manager-41f53.firebaseapp.com",
  projectId: "quidditch-manager-41f53",
  storageBucket: "quidditch-manager-41f53.firebasestorage.app",
  messagingSenderId: "377867398790",
  appId: "1:377867398790:web:443f4332ee8d183c7feb07",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const COLLECTIONS = {
  TEAMS: "teams",
  PLAYERS: "players",
  MATCHES: "matches",
  WIZARDS: "wizards",
} as const;
```

**Firestore Collections**:

- `wizards` - User profiles linked to Firebase Auth UIDs
- `teams` - Quidditch teams with standings (wins/losses/draws)
- `players` - Players linked to teams via teamId
- `matches` - Match results with scores and timestamps

---

### **2. TanStack Router v7 with File-Based Routing**

**Pattern**: Type-safe file-based routing with route factories instead of JSX configuration.

TanStack Router provides type-safe routing with automatic route tree generation and code splitting. Unlike React Router, routes are defined as files that export route configuration functions.

**Route Structure**:

```
src/pages/
├── index.tsx                 # Root route with layout
├── landing.tsx               # Public landing page
├── login.tsx                 # Login page (Firebase Auth)
├── signup.tsx                # Signup page (Firebase Auth) ✨ NEW
├── dashboard/
│   └── index.tsx            # Protected dashboard route
├── teams/
│   └── index.tsx            # Protected teams route
├── players/
│   └── index.tsx            # Protected players route
└── stats/
    └── index.tsx            # Protected stats route
```

**Route Factory Pattern**:

```tsx
// src/pages/dashboard/index.tsx
import {
  createRoute,
  useNavigate,
  type AnyRoute,
} from "@tanstack/react-router";
import { useMinistryAuth } from "../../features/MinistryAuth";
import { DashboardPage } from "../../features/QuidditchLeague/components/DashboardPage";
import { useEffect } from "react";

/**
 * Route Factory: Command Center Dashboard
 * @param parent - Explicitly typed as AnyRoute for type safety
 */
export default (parent: AnyRoute) =>
  createRoute({
    path: "/quidditch-command",
    getParentRoute: () => parent,
    component: CommandRouteWrapper,
  });

/**
 * Protected Route Wrapper with Auth Guard
 */
function CommandRouteWrapper() {
  const {
    state: { isAuthenticated },
  } = useMinistryAuth();
  const navigate = useNavigate();

  // Auth guard using useEffect pattern
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/ministry-portal" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Defense-in-depth authentication check
  }

  return <DashboardPage />;
}
```

**Root Route Configuration**:

```tsx
// src/pages/index.tsx
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NavigationSpell } from "../components/Layout/NavigationSpell";
import { MinistryAuthProvider } from "../features/MinistryAuth/context/MinistryAuthContext";

const wizardingRootRoute = createRootRoute({
  component: WizardingWorldRootLayout,
});

function WizardingWorldRootLayout() {
  return (
    <MinistryAuthProvider>
      <div className="app">
        <NavigationSpell />
        <main className="wizarding-main-content">
          <Outlet /> {/* Nested routes render here */}
        </main>
      </div>
    </MinistryAuthProvider>
  );
}

// Route tree registration
const wizardingWorldTree = wizardingRootRoute.addChildren([
  landingRoute,
  ministryPortalRoute,
  ministryEnlistmentRoute, // Signup route ✨ NEW
  leagueRegistryRoute,
  commandCenterRoute,
  scoutingNetworkRoute,
  matchArchiveRoute,
]);

export const routeTree = wizardingWorldTree;
```

**Benefits**:

- **Type Safety**: Full TypeScript inference for route params and search params
- **Code Splitting**: Automatic route-based code splitting
- **File-Based**: Routes auto-discovered from file structure
- **Performance**: Built-in route preloading and prefetching
- **Type-Safe Navigation**: `navigate({ to: '/path' })` with full autocomplete

---

### **3. Firebase Authentication with useReducer**

**Pattern**: Real authentication using Firebase Auth with reducer-based state management.

The authentication system uses Firebase Auth for secure user authentication, combined with `useReducer` for predictable state transitions.

**Firebase Auth Actions**:

```typescript
type MinistryAuthAction =
  | {
      type: "AUTH_STATE_CHANGED";
      payload: { wizard: Wizard | null; firebaseUser: FirebaseUser | null };
    }
  | { type: "AUTH_LOADING"; payload: boolean }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "LOGOUT_SPELL" }
  | { type: "CLEAR_ERROR" };

function ministryAuthReducer(
  state: MinistryAuthState,
  action: MinistryAuthAction
): MinistryAuthState {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return {
        ...state,
        wizard: action.payload.wizard,
        firebaseUser: action.payload.firebaseUser,
        isAuthenticated: action.payload.wizard !== null,
        isLoading: false,
        error: null,
      };

    case "LOGOUT_SPELL":
      return {
        wizard: null,
        firebaseUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case "AUTH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
```

**Firebase Auth Listener**:

```typescript
export function MinistryAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ministryAuthReducer, initialState);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch wizard profile from Firestore
        const wizardRef = doc(db, COLLECTIONS.WIZARDS, firebaseUser.uid);
        const wizardSnap = await getDoc(wizardRef);

        if (wizardSnap.exists()) {
          const wizardData = wizardSnap.data() as Wizard;
          dispatch({
            type: 'AUTH_STATE_CHANGED',
            payload: {
              wizard: { id: wizardSnap.id, ...wizardData },
              firebaseUser,
            },
          });
        }
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: { wizard: null, firebaseUser: null },
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Signup function
  const signup = useCallback(async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create wizard profile in Firestore
    const wizardProfile = {
      name,
      email,
      house: determineHouseFromEmail(email),
      wandCore: randomWandCore(),
      patronus: randomPatronus(),
      role: 'Manager',
      galleons: 10000,
    };

    await setDoc(doc(db, COLLECTIONS.WIZARDS, firebaseUser.uid), {
      ...wizardProfile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // onAuthStateChanged will handle state update
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    dispatch({ type: 'LOGOUT_SPELL' });
  }, []);

  return (
    <MinistryAuthContext.Provider value={{ state, signup, login, logout }}>
      {children}
    </MinistryAuthContext.Provider>
  );
}
```

**Benefits**:

- **Real Authentication**: Secure Firebase Auth with email/password
- **Automatic Session Management**: Firebase handles token refresh
- **Firestore Integration**: User profiles stored in Firestore
- **Predictable State**: All transitions explicit via actions
- **Type Safety**: Full TypeScript support for auth operations

---

### **4. Feature-Based Architecture**

**Structure**: `src/features/` (NOT `src/components` vs `src/pages`)

Each feature is a self-contained module with:

```
src/features/QuidditchLeague/
├── components/       # Presentational UI components
├── hooks/            # Business logic & data fetching
├── context/          # Feature-specific state (optional)
└── index.ts          # Barrel exports for clean imports
```

**Benefits**:

- **Scalability**: Add new features without touching existing code
- **Team Collaboration**: Multiple developers can work on separate features
- **Code Reusability**: Features can be extracted to separate packages
- **Clear Boundaries**: Each feature owns its domain logic

---

### **5. Container/Presentational Pattern**

**Separation of Concerns**: Smart components handle logic, dumb components handle UI.

```tsx
// CONTAINER (Smart Component) - PlayersPage.tsx
export function PlayersPage() {
  // Business logic via custom hook
  const { players, isLoading, error, draftPlayer, releasePlayer } =
    usePlayerRoster();

  // State management
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Handlers
  const handleDraftPlayer = async (playerData: Omit<Player, "id">) => {
    await draftPlayer(playerData);
    setShowDraftForm(false);
  };

  // Delegates rendering to presentational component
  return (
    <div>
      <button onClick={() => setShowDraftForm(true)}>Draft New Player</button>

      <PlayerScroll
        players={players}
        isLoading={isLoading}
        error={error}
        onReleasePlayer={handleReleasePlayer}
      />
    </div>
  );
}

// PRESENTATIONAL (Dumb Component) - PlayerScroll.tsx
interface PlayerScrollProps {
  players: Player[];
  isLoading: boolean;
  error: string | null;
  onReleasePlayer: (playerId: string) => void;
}

export function PlayerScroll({
  players,
  isLoading,
  error,
  onReleasePlayer,
}: PlayerScrollProps) {
  // Pure rendering logic - no side effects
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div>
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onRelease={() => onReleasePlayer(player.id)}
        />
      ))}
    </div>
  );
}
```

**Benefits**:

- Presentational components are **highly testable** (just test props → output)
- Business logic is **reusable** across multiple components
- UI can be **redesigned** without touching logic
- Easier to **onboard** new developers

---

### **6. Singleton Service Pattern (OwlPostService with Firebase)**

**Pattern**: Single instance manages all Firestore operations.

**The application is architected with a Service Layer (OwlPostService) that provides a clean abstraction over Firebase Firestore.** All CRUD operations use Firebase SDK with proper error handling and type safety.

```tsx
export class OwlPostService {
  private static instance: OwlPostService;
  private readonly OWL_FLIGHT_DELAY = 400; // Simulated latency for UX

  private constructor() {
    // Firebase is initialized in firebase.ts
  }

  public static getInstance(): OwlPostService {
    if (!OwlPostService.instance) {
      OwlPostService.instance = new OwlPostService();
    }
    return OwlPostService.instance;
  }

  // Simulate network latency
  private async _simulateFlightDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.OWL_FLIGHT_DELAY));
  }

  // Retrieve all teams from Firestore
  public async getAllTeams(): Promise<Team[]> {
    await this._simulateFlightDelay();

    const teamsCol = collection(db, COLLECTIONS.TEAMS);
    const snapshot = await getDocs(teamsCol);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Team
    );
  }

  // Create new team in Firestore
  public async recruitTeam(teamData: Omit<Team, "id">): Promise<Team> {
    await this._simulateFlightDelay();

    const teamsCol = collection(db, COLLECTIONS.TEAMS);
    const docRef = await addDoc(teamsCol, {
      ...teamData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, ...teamData };
  }

  // Record match with batch writes for atomicity
  public async recordMatch(
    homeTeamId: string,
    awayTeamId: string,
    homeScore: number,
    awayScore: number
  ): Promise<Match> {
    await this._simulateFlightDelay();

    const batch = writeBatch(db);

    // Create match record
    const matchesCol = collection(db, COLLECTIONS.MATCHES);
    const matchData = {
      homeTeamId,
      awayTeamId,
      homeScore,
      awayScore,
      date: serverTimestamp(),
      status: "Completed",
    };
    const matchRef = await addDoc(matchesCol, matchData);

    // Update team standings
    const homeTeamRef = doc(db, COLLECTIONS.TEAMS, homeTeamId);
    const awayTeamRef = doc(db, COLLECTIONS.TEAMS, awayTeamId);

    if (homeScore > awayScore) {
      batch.update(homeTeamRef, { wins: increment(1) });
      batch.update(awayTeamRef, { losses: increment(1) });
    } else if (awayScore > homeScore) {
      batch.update(awayTeamRef, { wins: increment(1) });
      batch.update(homeTeamRef, { losses: increment(1) });
    } else {
      batch.update(homeTeamRef, { draws: increment(1) });
      batch.update(awayTeamRef, { draws: increment(1) });
    }

    // Commit all updates atomically
    await batch.commit();

    return { id: matchRef.id, ...matchData, date: new Date() } as Match;
  }
}

// Export singleton instance
export const owlPostService = OwlPostService.getInstance();
```

**Benefits**:

- **Single Data Source**: Consistent state across entire app
- **Centralized Logic**: All Firestore operations in one place
- **Transaction Support**: Batch writes for atomic updates
- **Easy Testing**: Replace with mock service for tests
- **Type Safety**: Full TypeScript support for all operations
- **Cloud Persistence**: Data persists across devices and sessions

---

### **7. Protected Routes with useEffect Pattern**

**Pattern**: Auth guard using useEffect + navigate instead of route-level guards.

With TanStack Router, protected routes are implemented using a useEffect pattern in each route component:

```tsx
// Protected Route Pattern
function CommandRouteWrapper() {
  const {
    state: { isAuthenticated },
  } = useMinistryAuth();
  const navigate = useNavigate();

  // Auth guard using useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/ministry-portal" });
    }
  }, [isAuthenticated, navigate]);

  // Defense-in-depth: render null if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <DashboardPage />;
}
```

**Benefits**:

- **Type-Safe Navigation**: Full TypeScript support for routes
- **Seamless UX**: Clean redirects without flash of unauthorized content
- **Centralized Auth Logic**: useMinistryAuth hook provides auth state
- **Defense-in-Depth**: Both useEffect redirect + conditional render
- **Firebase Integration**: Works with Firebase Auth state changes

---

### **8. Match Recording & League Standings**

**Pattern**: Transactional updates using Firestore batch writes.

```tsx
// Service Layer - Atomic updates with batch writes
public async recordMatch(
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number
): Promise<Match> {
  const batch = writeBatch(db);

  // 1. Create match record
  const matchRef = doc(collection(db, COLLECTIONS.MATCHES));
  batch.set(matchRef, {
    homeTeamId,
    awayTeamId,
    homeScore,
    awayScore,
    date: serverTimestamp(),
    status: 'Completed',
  });

  // 2. Update team standings
  const homeTeamRef = doc(db, COLLECTIONS.TEAMS, homeTeamId);
  const awayTeamRef = doc(db, COLLECTIONS.TEAMS, awayTeamId);

  if (homeScore > awayScore) {
    batch.update(homeTeamRef, { wins: increment(1), updatedAt: serverTimestamp() });
    batch.update(awayTeamRef, { losses: increment(1), updatedAt: serverTimestamp() });
  } else if (awayScore > homeScore) {
    batch.update(awayTeamRef, { wins: increment(1), updatedAt: serverTimestamp() });
    batch.update(homeTeamRef, { losses: increment(1), updatedAt: serverTimestamp() });
  } else {
    batch.update(homeTeamRef, { draws: increment(1), updatedAt: serverTimestamp() });
    batch.update(awayTeamRef, { draws: increment(1), updatedAt: serverTimestamp() });
  }

  // 3. Update player stats for all players on both teams
  const playersQuery = query(
    collection(db, COLLECTIONS.PLAYERS),
    where('teamId', 'in', [homeTeamId, awayTeamId])
  );
  const playersSnapshot = await getDocs(playersQuery);

  playersSnapshot.docs.forEach((playerDoc) => {
    batch.update(playerDoc.ref, {
      'stats.gamesPlayed': increment(1),
      updatedAt: serverTimestamp(),
    });
  });

  // Commit all updates atomically
  await batch.commit();

  return { id: matchRef.id, homeTeamId, awayTeamId, homeScore, awayScore };
}

// Hook Layer - Calculate league standings
export function calculateLeagueStandings(teams: Team[]): LeagueStanding[] {
  return teams
    .map(team => {
      const played = team.wins + team.losses + team.draws;
      const points = team.wins * 3 + team.draws;  // 3 pts win, 1 pt draw
      const winPercentage = played > 0 ? (team.wins / played) * 100 : 0;
      return { ...team, points, played, winPercentage };
    })
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;  // Primary: Points
      if (b.wins !== a.wins) return b.wins - a.wins;          // Secondary: Wins
      return b.winPercentage - a.winPercentage;                // Tertiary: Win %
    });
}
```

**Benefits**:

- **Atomic Updates**: All changes succeed or fail together
- **Data Consistency**: No partial updates in database
- **Transaction Support**: Firestore batch writes
- **Type Safety**: LeagueStanding extends Team with calculated fields
- **Pure Functions**: `calculateLeagueStandings` is easily testable

---

## 📁 Project Structure

```
project-2/
├── src/
│   ├── features/                          # Feature-based modules
│   │   ├── MinistryAuth/                 # Authentication feature
│   │   │   ├── context/
│   │   │   │   └── MinistryAuthContext.tsx  # Firebase Auth state provider
│   │   │   └── index.ts
│   │   │
│   │   └── QuidditchLeague/              # Teams & Players feature
│   │       ├── components/
│   │       │   ├── LeagueScroll.tsx     # Team list (Presentational)
│   │       │   ├── RecruitmentForm.tsx  # Team creation form
│   │       │   ├── PlayerScroll.tsx     # Player list (Presentational)
│   │       │   ├── DraftPlayerForm.tsx  # Player creation form
│   │       │   ├── MatchResultForm.tsx  # Match recording form
│   │       │   ├── DashboardPage.tsx    # Dashboard
│   │       │   ├── PlayersPage.tsx      # Player management container
│   │       │   └── StatsPage.tsx        # Match stats & league table
│   │       ├── hooks/
│   │       │   ├── useTeamList.ts       # Team CRUD logic (Firestore)
│   │       │   ├── usePlayerRoster.ts   # Player CRUD logic (Firestore)
│   │       │   └── useMatchStats.ts     # Match stats & standings (Firestore)
│   │       └── index.ts
│   │
│   ├── pages/                             # Route files (TanStack Router)
│   │   ├── index.tsx                     # Root route with layout
│   │   ├── landing.tsx                   # Public homepage
│   │   ├── login.tsx                     # Firebase Auth login
│   │   ├── signup.tsx                    # Firebase Auth signup ✨ NEW
│   │   ├── dashboard/
│   │   │   └── index.tsx                # Protected dashboard route
│   │   ├── teams/
│   │   │   └── index.tsx                # Protected teams route
│   │   ├── players/
│   │   │   └── index.tsx                # Protected players route
│   │   └── stats/
│   │       └── index.tsx                # Protected stats route
│   │
│   ├── services/
│   │   └── OwlPostService.ts             # Singleton Firebase service layer
│   │
│   ├── lib/
│   │   └── firebase.ts                   # Firebase initialization ✨ NEW
│   │
│   ├── types/
│   │   └── wizardry.ts                   # Global TypeScript definitions
│   │
│   ├── components/
│   │   └── Layout/
│   │       └── NavigationSpell.tsx       # Navigation bar component
│   │
│   ├── styles/
│   │   └── theme.css                     # CSS custom properties
│   │
│   ├── utils/
│   │   └── seedData.ts                   # Database seeding utility
│   │
│   ├── router.tsx                         # TanStack Router configuration
│   └── main.tsx                           # React entry point
│
├── public/
├── index.html
├── package.json
├── tsconfig.json                          # TypeScript strict mode config
├── vite.config.ts                         # Vite build configuration
├── FIREBASE_SETUP_GUIDE.md               # Firebase configuration guide ✨ NEW
└── PROJECT.md                             # This file
```

---

## Installation & Setup

### **Prerequisites**

- Node.js 18+ and npm 9+
- Firebase account (free tier works)

### **Firebase Setup**

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Click "Add project" or select existing project
   - Project ID: `quidditch-manager-41f53` (or your custom ID)

2. **Enable Authentication:**
   - Go to Authentication → Get started
   - Enable "Email/Password" sign-in method

3. **Enable Firestore:**
   - Go to Firestore Database → Create database
   - Start in "test mode" (for development)
   - Choose a location (e.g., us-central)

4. **Get Firebase Config:**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" → Web app
   - Copy the firebaseConfig object
   - Update `src/lib/firebase.ts` with your config

**Detailed setup instructions:** See `FIREBASE_SETUP_GUIDE.md`

### **Installation Steps**

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd project-2
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

5. **Create an account:**
   - Click "Enlist Now" or navigate to signup page
   - Fill in your name, email, and password (min 6 characters)
   - Submit the form
   - You'll be redirected to login page
   - Login with your credentials

6. **Your account will be created with:**
   - Name: Your provided name
   - House: Auto-assigned based on email domain
   - Wand Core: Randomly generated (Phoenix Feather, Dragon Heartstring, etc.)
   - Patronus: Randomly generated (Stag, Otter, Phoenix, etc.)
   - Starting Galleons: 10,000

### **Available Scripts**

```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## ✅ Requirements Coverage

This table shows how key system requirements are implemented:

| Requirement            | Implementation                          | Location                                     | Technical Pattern                      |
| ---------------------- | --------------------------------------- | -------------------------------------------- | -------------------------------------- |
| **Routing**            | TanStack Router v7 file-based routing   | `src/pages/`                                 | Route factory functions + route tree   |
| **Type-Safe Routes**   | Full TypeScript inference for routes    | All route files in `src/pages/`              | TanStack Router type safety            |
| **Authentication**     | Firebase Auth with useReducer           | `src/features/MinistryAuth/context/`         | Firebase Auth + Context API            |
| **Signup**             | Firebase createUserWithEmailAndPassword | `src/pages/signup.tsx`                       | Firebase Auth + Firestore              |
| **Login**              | Firebase signInWithEmailAndPassword     | `src/pages/login.tsx`                        | Firebase Auth + Firestore              |
| **Protected Routes**   | useEffect + navigate pattern            | All protected route components               | useEffect auth guard                   |
| **Session Management** | Firebase Auth automatic session         | Firebase SDK                                 | Firebase Auth tokens                   |
| **CRUD Operations**    | OwlPostService with Firebase            | `src/services/OwlPostService.ts`             | Singleton pattern + Firestore SDK      |
| **Create Team**        | RecruitmentForm + useTeamList           | `src/features/QuidditchLeague/`              | Controlled component + Firestore       |
| **Create Player**      | DraftPlayerForm + usePlayerRoster       | `src/features/QuidditchLeague/`              | Controlled component + Firestore       |
| **Record Match**       | MatchResultForm + useMatchStats         | `src/features/QuidditchLeague/`              | Modal form + Firestore batch writes    |
| **League Standings**   | calculateLeagueStandings utility        | `src/features/QuidditchLeague/hooks/`        | Pure function with multi-criteria sort |
| **Data Persistence**   | Cloud Firestore                         | Firebase Firestore                           | Cloud database                         |
| **State Management**   | Custom hooks for each feature           | `src/features/QuidditchLeague/hooks/`        | Custom hooks pattern                   |
| **UI Components**      | Presentational components               | `src/features/QuidditchLeague/components/`   | Container/Presentational pattern       |
| **Type Safety**        | TypeScript strict mode                  | `src/types/wizardry.ts`                      | Interfaces + discriminated unions      |
| **Error Handling**     | DarkMagicError custom class             | `OwlPostService.ts`                          | Custom error types                     |
| **Loading States**     | Async state management in hooks         | `useTeamList.ts`, `usePlayerRoster.ts`, etc. | useState for loading/error             |
| **Form Validation**    | Client-side validation in forms         | `RecruitmentForm.tsx`, `signup.tsx`, etc.    | Controlled inputs + validation         |
| **Navigation**         | NavigationSpell with auth-aware UI      | `src/components/Layout/`                     | Conditional rendering                  |
| **Responsive Design**  | CSS Grid + Flexbox + Media Queries      | All `.css` files                             | Mobile-first approach                  |
| **Theming**            | CSS custom properties                   | `src/styles/theme.css`                       | CSS variables                          |

---

## 🎯 Key Architectural Decisions

| Decision                     | Rationale                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Firebase Backend**         | Production-ready authentication and database. Real-time sync, automatic scaling, and zero server management. |
| **TanStack Router v7**       | Type-safe routing with file-based configuration. Better DX than React Router with full TypeScript inference. |
| **Feature-Based Structure**  | Scales better than component/page separation. Features are self-contained and independently deployable.      |
| **Container/Presentational** | Clear separation between business logic and UI. Easier testing and reusability.                              |
| **useReducer for Auth**      | Complex state transitions require predictable actions. Prevents impossible states.                           |
| **Custom Hooks**             | Encapsulates business logic. Promotes reusability and testability.                                           |
| **Singleton Service**        | Single source of truth for data. Centralized Firebase operations and error handling.                         |
| **TypeScript Strict Mode**   | Catches errors at compile time. Improves code quality and maintainability.                                   |
| **CSS Custom Properties**    | Themeable design system. Easy to maintain consistent styling.                                                |
| **Firestore Batch Writes**   | Atomic transactions for match recording. Ensures data consistency.                                           |
| **Thematic Naming (DDD)**    | Demonstrates domain-driven design principles. Makes codebase memorable and unique.                           |
| **Route Factory Pattern**    | TanStack Router best practice. Each route file exports a factory function for type-safe route configuration. |

---

## Testing the Application

### **Manual Testing Workflow**

1. **Authentication Flow:**
   - Visit landing page → Click "Enlist Now"
   - Fill signup form with name, email, password
   - Verify "Registration Successful" message on login page
   - Login with credentials → Verify redirect to dashboard
   - Check that navigation shows your name and house

2. **Team Management:**
   - Navigate to Teams page (🏆 Quidditch League Registry)
   - Click "✨ Recruit New Squad"
   - Fill form with House alignment, founded year, stadium
   - Verify new team appears in Firebase Console (Firestore Database → teams)
   - Verify new team appears in league scroll
   - Test deletion with "Vanish Team" button

3. **Player Scouting:**
   - Navigate to Players page (⚡ Player Scouting)
   - Click "Draft New Player"
   - Select position from dropdown (Seeker, Chaser, Beater, Keeper)
   - Fill jersey number, nationality, contract details
   - Verify player appears in Firebase Console (Firestore Database → players)
   - Verify player card displays with correct position badge

4. **Match Recording & Statistics:**
   - Navigate to Stats page (📊 Match Statistics Archive)
   - Click "📝 Record Official Match" button
   - Select Home Team and Away Team from dropdowns
   - Enter scores (e.g., Home: 180, Away: 150)
   - Click "Record Result"
   - Verify match appears in Firebase Console (Firestore Database → matches)
   - Verify match appears in "Latest Match Results" with team names
   - Verify league table updates with correct wins/losses/points
   - Confirm sorting: Points (desc) → Wins (desc) → Win % (desc)

5. **Session Persistence:**
   - Login and navigate to protected route
   - Refresh page → Verify session persists (Firebase Auth)
   - Logout → Verify redirect to landing page
   - Try accessing protected route → Verify redirect to login

6. **Cross-Device Testing:**
   - Login on one device
   - Add team or player
   - Check Firebase Console → Verify data appears
   - Login on another device → Verify data syncs

---

## 🔮 Future Enhancements

- [x] **Firebase Authentication**: Real signup/login with email/password ✅
- [x] **Firestore Database**: Cloud persistence with real-time sync ✅
- [x] **Match Recording System**: Record official match results ✅
- [x] **League Standings Calculator**: Dynamic win/loss/draw tracking with points ✅
- [x] **Atomic Transactions**: Firestore batch writes for match recording ✅
- [ ] **Match Scheduling System**: Schedule future matches with calendar view
- [ ] **Live Match Simulation**: Real-time score updates with play-by-play commentary
- [ ] **Player Transfer Market**: Galleon-based player trading system
- [ ] **Advanced Statistics**: Player performance metrics (goals, assists, saves)
- [ ] **Real-Time Updates**: Firestore real-time listeners for live updates
- [ ] **Unit Tests**: Vitest + React Testing Library for components and hooks
- [ ] **E2E Tests**: Playwright for full user flow testing
- [ ] **Firestore Security Rules**: Production-ready security rules
- [ ] **Docker Deployment**: Containerized deployment configuration

---

## Technologies Used

- **React 18.3** - UI library with concurrent features
- **TypeScript 5.6** - Type-safe JavaScript with strict mode
- **Vite 6.0** - Fast build tool and dev server
- **TanStack Router 7.1** - Type-safe file-based routing with route factories
- **Firebase 10.x** - Backend-as-a-Service (Authentication + Firestore)
  - **Firebase Auth** - Email/password authentication
  - **Cloud Firestore** - NoSQL cloud database
- **CSS3** - Custom properties, Grid, Flexbox, responsive design

---

## Starter Code Attribution

This project was built using the **TanStack Router v7 starter template** as a foundation. The starter provided:

- Initial Vite + React + TypeScript setup
- Basic TanStack Router configuration
- File-based routing structure

All features, business logic, styling, and architectural patterns were implemented on top of this starter:

- Domain-driven design with thematic naming
- Feature-based architecture
- Firebase Authentication integration
- Firestore Database integration
- Signup and login flows
- Authentication system with useReducer
- Singleton service layer (OwlPostService)
- Container/presentational pattern
- Custom hooks for business logic
- Protected routes with auth guards
- Match recording with batch writes
- Complete UI/UX implementation

---

## Author

**Project by Priyansh Thakkar**

Demonstrating enterprise-grade React patterns with Firebase backend through domain-driven design for a Full-Stack Micro-SaaS League Management Platform.

This project showcases:

- Advanced architectural patterns (DDD, feature-based structure, type-safe routing)
- Production-ready code organization
- Firebase backend integration (Auth + Firestore)
- Real authentication with signup and login
- Cloud database persistence with Firestore
- TypeScript best practices with strict mode
- Scalable state management solutions
- Atomic transactions with Firestore batch writes
- TanStack Router v7 implementation

---

## AI DISCLOSURE

- Used AI to create documentation and comments

## Firebase Configuration

For detailed Firebase setup instructions, see **`FIREBASE_SETUP_GUIDE.md`** in the project root.

**Quick Setup:**

1. Create Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password)
3. Enable Firestore Database (test mode)
4. Copy config to `src/lib/firebase.ts`
5. Run `npm install` and `npm run dev`

**Firestore Collections:**

- `wizards` - User profiles (linked to Firebase Auth UIDs)
- `teams` - Quidditch teams with standings
- `players` - Players linked to teams
- `matches` - Match results and scores

**Security Note:** The current Firebase configuration uses test mode rules for development. Before deploying to production, implement proper Firestore security rules.

---

_Last Updated: December 2024_
