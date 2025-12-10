# MinistryAuth Feature

Authentication and authorization system for the Wizarding World Quidditch Manager.

## Overview

This feature implements a robust authentication system using:
- **Context API** for global state distribution
- **useReducer** for predictable state management
- **localStorage** for session persistence
- **TypeScript** for type safety

## Architecture

```
MinistryAuth/
├── context/
│   ├── MinistryAuthContext.tsx          # Main context implementation
│   └── MinistryAuthContext.example.tsx  # Usage examples
├── components/
│   ├── LoginForm.tsx                    # (To be implemented)
│   └── WizardProfileCard.tsx            # (To be implemented)
├── hooks/
│   └── useAuthValidation.ts             # (To be implemented)
├── types/
│   └── index.ts                         # Feature-specific types
└── index.ts                             # Barrel exports
```

## Quick Start

### 1. Wrap Your App with Provider

```tsx
import { MinistryAuthProvider } from '@/features/MinistryAuth';

function App() {
  return (
    <MinistryAuthProvider>
      {/* Your app components */}
    </MinistryAuthProvider>
  );
}
```

### 2. Use the Hook in Components

```tsx
import { useMinistryAuth } from '@/features/MinistryAuth';

function LoginButton() {
  const { state, login } = useMinistryAuth();

  const handleLogin = async () => {
    await login('wizard@hogwarts.edu', 'Alohomora');
  };

  return (
    <button onClick={handleLogin} disabled={state.isLoading}>
      {state.isAuthenticated ? 'Logged In' : 'Login'}
    </button>
  );
}
```

## State Shape

```typescript
interface MinistryAuthState {
  wizard: Wizard | null;          // Current user
  isAuthenticated: boolean;       // Auth status
  isLoading: boolean;             // Loading state
  error: string | null;           // Error message
  token: string | null;           // Session token
}
```

## Available Actions

### Context API

```typescript
const { state, dispatch, login, logout, clearError } = useMinistryAuth();
```

| Method | Parameters | Description |
|--------|------------|-------------|
| `login` | `(email: string, password: string)` | Authenticate user |
| `logout` | `()` | Clear session |
| `clearError` | `()` | Dismiss error message |
| `dispatch` | `(action: MinistryAuthAction)` | Direct dispatch |

## Reducer Actions

```typescript
// Login success
dispatch({
  type: 'LOGIN_SUCCESS',
  payload: { wizard, token }
});

// Logout
dispatch({ type: 'LOGOUT_SPELL' });

// Authentication error
dispatch({
  type: 'AUTH_ERROR',
  payload: 'Error message'
});

// Restore session (automatic)
dispatch({
  type: 'RESTORE_SESSION',
  payload: { wizard, token }
});

// Clear error
dispatch({ type: 'CLEAR_ERROR' });
```

## Mock Authentication

For development and demo purposes, the system uses mock authentication:

- **Magic Password:** `"Alohomora"` (the unlocking charm)
- **Any other password:** Will fail with error
- **Email:** Used to generate wizard name and determine house
- **Delay:** 800ms simulated network latency

### Email-Based House Assignment

The system determines house based on email domain:

| Domain Contains | Assigned House |
|----------------|----------------|
| `gryffindor` or `brave` | Gryffindor |
| `slytherin` or `ambitious` | Slytherin |
| `hufflepuff` or `loyal` | Hufflepuff |
| `ravenclaw` or `wise` | Ravenclaw |
| Other | Random assignment |

**Example:**
```typescript
await login('harry@gryffindor.edu', 'Alohomora');
// Wizard will be assigned to Gryffindor house
```

## Persistence

### LocalStorage Keys

- `wizard_token`: Session token
- `wizard_data`: Serialized wizard object

### Automatic Restoration

On app load, the context automatically:
1. Checks localStorage for saved session
2. Restores wizard and token if valid
3. Sets `isAuthenticated` to true
4. Continues with saved session

Users remain logged in across:
- Page refreshes
- Browser restarts
- Tab closures

### Manual Logout

```typescript
const { logout } = useMinistryAuth();

// Clears localStorage and resets state
logout();
```

## Error Handling

Errors are stored in `state.error` and can be displayed to users:

```tsx
function ErrorDisplay() {
  const { state, clearError } = useMinistryAuth();

  if (!state.error) return null;

  return (
    <div className="error-banner">
      <p>{state.error}</p>
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

### Common Errors

- `"Invalid credentials! The spell failed. Try 'Alohomora'."`
  - Wrong password provided
- `"An unexpected error occurred during authentication."`
  - Network or runtime error
- `"useMinistryAuth must be used within a MinistryAuthProvider."`
  - Hook used outside provider

## Protected Routes

Create a guard component for authenticated routes:

```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { state } = useMinistryAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Usage
<Route
  path="/teams"
  element={
    <ProtectedRoute>
      <TeamsPage />
    </ProtectedRoute>
  }
/>
```

## Testing

### Successful Login

```typescript
const { login, state } = useMinistryAuth();

await login('test@test.com', 'Alohomora');

expect(state.isAuthenticated).toBe(true);
expect(state.wizard).toBeDefined();
expect(state.token).toBeDefined();
```

### Failed Login

```typescript
const { login, state } = useMinistryAuth();

await login('test@test.com', 'WrongPassword');

expect(state.isAuthenticated).toBe(false);
expect(state.error).toContain('Invalid credentials');
```

### Logout

```typescript
const { logout, state } = useMinistryAuth();

logout();

expect(state.isAuthenticated).toBe(false);
expect(state.wizard).toBeNull();
expect(state.token).toBeNull();
```

## Advanced Usage

### Direct Dispatch

For custom state management:

```typescript
const { dispatch } = useMinistryAuth();

// Clear error without helper function
dispatch({ type: 'CLEAR_ERROR' });

// Manual logout
dispatch({ type: 'LOGOUT_SPELL' });
```

### Conditional Rendering

```tsx
function Navigation() {
  const { state } = useMinistryAuth();

  return (
    <nav>
      {state.isAuthenticated ? (
        <>
          <Link to="/teams">My Teams</Link>
          <span>Welcome, {state.wizard?.name}</span>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
```

### Auth-Dependent Data Fetching

```tsx
function useWizardTeams() {
  const { state } = useMinistryAuth();
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (!state.isAuthenticated) return;

    fetch(`/api/teams?wizard=${state.wizard.id}`, {
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    })
      .then(res => res.json())
      .then(setTeams);
  }, [state.isAuthenticated, state.wizard, state.token]);

  return teams;
}
```

## TypeScript Types

All types are exported from the feature:

```typescript
import type {
  MinistryAuthState,
  MinistryAuthAction,
  LoginCredentials,
} from '@/features/MinistryAuth';
```

## Examples

See `context/MinistryAuthContext.example.tsx` for 8 comprehensive examples:

1. Login Form Component
2. User Profile Card
3. Protected Route Guard
4. Navigation Bar with Auth State
5. Using Dispatch Directly
6. App Root Setup
7. Testing Login Flow
8. Custom Hook for Auth-Dependent Data

## Future Enhancements

- [ ] Email validation
- [ ] Password strength requirements
- [ ] Registration flow
- [ ] Forgot password functionality
- [ ] OAuth integration (Google, GitHub)
- [ ] Role-based access control (RBAC)
- [ ] Session expiration
- [ ] Refresh token mechanism
- [ ] Multi-factor authentication (MFA)

## Resources

- [React Context API Docs](https://react.dev/reference/react/useContext)
- [useReducer Hook Docs](https://react.dev/reference/react/useReducer)
- [TypeScript Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
