# Container/Presentational Pattern

## Overview

This feature demonstrates the **Container/Presentational** architectural pattern, a fundamental React pattern that separates business logic from UI presentation.

## The Pattern

```
┌─────────────────────────────────────────┐
│         CONTAINER COMPONENT             │
│  (TeamsPage - Logic & State)           │
│                                         │
│  - Uses custom hooks (useTeamList)     │
│  - Manages state & side effects        │
│  - Handles data fetching               │
│  - Processes callbacks                 │
│                                         │
│         ↓ passes props ↓               │
└─────────────────────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│      PRESENTATIONAL COMPONENT           │
│  (LeagueScroll - Pure UI)              │
│                                         │
│  - Receives data via props only        │
│  - NO hooks (except maybe useCallback) │
│  - NO state management                 │
│  - NO API calls                        │
│  - Just renders UI                     │
└─────────────────────────────────────────┘
```

## Implementation

### 1. Custom Hook (Container Logic)

**File:** `src/features/QuidditchLeague/hooks/useTeamList.ts`

```typescript
export function useTeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchTeams = async () => {
      const data = await owlPostService.getAllTeams();
      setTeams(data);
    };
    fetchTeams();
  }, []);

  // Business logic functions
  const recruitTeam = async (teamData) => {
    const newTeam = await owlPostService.recruitTeam(teamData);
    setTeams(prev => [...prev, newTeam]);
  };

  const banishTeam = async (teamId) => {
    await owlPostService.banishTeam(teamId);
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  return { teams, isLoading, error, recruitTeam, banishTeam };
}
```

**Responsibilities:**
- Data fetching with OwlPostService
- State management (teams, loading, error)
- Business logic (recruit, banish)
- Side effects (useEffect)
- Error handling

### 2. Presentational Component (UI Only)

**File:** `src/features/QuidditchLeague/components/LeagueScroll.tsx`

```typescript
interface LeagueScrollProps {
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  onBanishTeam?: (teamId: string) => void;
}

export function LeagueScroll({
  teams,
  isLoading,
  error,
  onBanishTeam,
}: LeagueScrollProps) {
  // NO hooks
  // NO state
  // NO API calls
  // JUST UI rendering

  if (isLoading) return <LoadingPotion />;
  if (error) return <ErrorParchment error={error} />;
  if (teams.length === 0) return <EmptyScroll />;

  return (
    <div className="league-scroll">
      {teams.map(team => (
        <TeamCard
          key={team.id}
          team={team}
          onBanish={onBanishTeam}
        />
      ))}
    </div>
  );
}
```

**Responsibilities:**
- Renders UI based on props
- Handles user interactions (clicks, etc.)
- Calls prop callbacks (onBanishTeam)
- NO business logic
- NO state (unless local UI state like isOpen)

### 3. Container Component (Connects Hook to UI)

**File:** `src/pages/Teams/TeamsPage.tsx`

```typescript
export function TeamsPage() {
  // USE THE HOOK (Container logic)
  const { teams, isLoading, error, banishTeam } = useTeamList();

  // PASS TO PRESENTATIONAL COMPONENT
  return (
    <LeagueScroll
      teams={teams}
      isLoading={isLoading}
      error={error}
      onBanishTeam={banishTeam}
    />
  );
}
```

## Benefits

### 1. Separation of Concerns
- **Logic** lives in hooks
- **UI** lives in components
- Easy to understand where code belongs

### 2. Reusability
```typescript
// Same presentational component, different data sources
function AdminTeamsPage() {
  const { teams } = useAdminTeamList(); // Different hook
  return <LeagueScroll teams={teams} />;
}

function ArchivedTeamsPage() {
  const { teams } = useArchivedTeams(); // Different hook
  return <LeagueScroll teams={teams} />;
}
```

### 3. Testability

**Testing Presentational Component:**
```typescript
// Easy to test - just pass props
test('renders teams correctly', () => {
  const mockTeams = [
    { id: '1', name: 'Team A', ... },
    { id: '2', name: 'Team B', ... },
  ];

  render(
    <LeagueScroll
      teams={mockTeams}
      isLoading={false}
      error={null}
    />
  );

  expect(screen.getByText('Team A')).toBeInTheDocument();
});
```

**Testing Hook:**
```typescript
// Test logic in isolation
test('fetchs teams on mount', async () => {
  const { result } = renderHook(() => useTeamList());

  expect(result.current.isLoading).toBe(true);

  await waitFor(() => {
    expect(result.current.teams).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
  });
});
```

### 4. Maintainability
- Change logic → Edit hook
- Change UI → Edit component
- No tangled code

### 5. Storybook-Friendly
```typescript
// Easy to create stories
export default {
  title: 'QuidditchLeague/LeagueScroll',
  component: LeagueScroll,
};

export const Loading = {
  args: {
    teams: [],
    isLoading: true,
    error: null,
  },
};

export const WithTeams = {
  args: {
    teams: mockTeams,
    isLoading: false,
    error: null,
  },
};

export const Error = {
  args: {
    teams: [],
    isLoading: false,
    error: 'Failed to load teams',
  },
};
```

## CSS Theme Variables

**File:** `src/styles/theme.css`

Define design tokens centrally:

```css
:root {
  --spell-damage-red: #8a2be2;
  --parchment-bg: #f5f5dc;
  --ink-black: #2c2c2c;
  /* ... more variables */
}
```

**Usage in components:**
```css
.team-card {
  background: var(--parchment-bg);
  color: var(--ink-black);
  border: 2px solid var(--spell-damage-red);
}
```

**Benefits:**
- Consistent design system
- Easy theming (light/dark mode)
- Single source of truth for colors
- Type-safe with CSS modules

## Data Flow

```
┌─────────────────────────────────────────┐
│         OwlPostService                  │
│  (Data Layer - localStorage)            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         useTeamList Hook                │
│  (Business Logic)                       │
│                                         │
│  - Calls owlPostService.getAllTeams()  │
│  - Manages state (teams, loading)      │
│  - Provides: { teams, isLoading, ... } │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         TeamsPage                       │
│  (Container)                            │
│                                         │
│  const { teams, isLoading } = useTeamList();
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         LeagueScroll                    │
│  (Presentational)                       │
│                                         │
│  Receives: teams, isLoading as props   │
│  Renders: UI with parchment styling    │
└─────────────────────────────────────────┘
```

## When to Use This Pattern

### ✅ Use Container/Presentational When:
- Component needs to fetch data
- Complex business logic exists
- Component will be reused with different data
- You want to test logic separately from UI
- Building a design system

### ❌ Don't Use When:
- Simple components with no logic
- One-off components that won't be reused
- Over-engineering simple features

## Anti-Patterns to Avoid

### ❌ Bad: Logic in Presentational Component
```typescript
// DON'T DO THIS
function LeagueScroll() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    owlPostService.getAllTeams().then(setTeams);
  }, []);

  return <div>{/* render */}</div>;
}
```

### ✅ Good: Pure Presentational
```typescript
// DO THIS
function LeagueScroll({ teams }: LeagueScrollProps) {
  return <div>{/* render */}</div>;
}
```

## Example: Adding a New Feature

**Requirement:** Add player filtering by position

### Step 1: Update Hook (Logic)
```typescript
export function useTeamList() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  const filteredTeams = useMemo(() => {
    if (!filter) return teams;
    return teams.filter(t => t.position === filter);
  }, [teams, filter]);

  return {
    teams: filteredTeams,
    setFilter,
    // ...
  };
}
```

### Step 2: Update Presentational (UI)
```typescript
interface LeagueScrollProps {
  teams: Team[];
  currentFilter: string | null;
  onFilterChange: (filter: string) => void;
  // ...
}

export function LeagueScroll({ onFilterChange }) {
  return (
    <div>
      <select onChange={(e) => onFilterChange(e.target.value)}>
        <option value="">All</option>
        <option value="Seeker">Seekers</option>
        {/* ... */}
      </select>
      {/* render teams */}
    </div>
  );
}
```

### Step 3: Connect in Container
```typescript
export function TeamsPage() {
  const { teams, setFilter } = useTeamList();

  return (
    <LeagueScroll
      teams={teams}
      onFilterChange={setFilter}
    />
  );
}
```

## Resources

- [React Docs: Thinking in React](https://react.dev/learn/thinking-in-react)
- [Dan Abramov: Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Kent C. Dodds: Colocation](https://kentcdodds.com/blog/colocation)

## Summary

| Aspect | Container | Presentational |
|--------|-----------|----------------|
| **Purpose** | How things work | How things look |
| **State** | Yes | No (only local UI state) |
| **Hooks** | Yes (useEffect, custom hooks) | No |
| **Data Source** | Calls APIs, services | Receives via props |
| **Styling** | Minimal | All styling |
| **Reusability** | Low | High |
| **Testing** | Integration tests | Unit tests |

This pattern is **key to scaling React applications** and demonstrates senior-level architectural thinking.
