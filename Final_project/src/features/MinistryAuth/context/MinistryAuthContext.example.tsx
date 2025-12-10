/**
 * MinistryAuthContext Usage Examples
 *
 * Demonstrates how to use the authentication context in React components.
 * These patterns showcase proper integration with the useReducer-based state.
 */

import { useState, useEffect } from 'react';
import { useMinistryAuth } from './MinistryAuthContext';

// ============================================================
// EXAMPLE 1: Login Form Component
// ============================================================

/**
 * Example login form that uses the auth context
 */
export function ExampleLoginForm() {
  const { state, login, clearError } = useMinistryAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    clearError();

    // Attempt login
    await login(email, password);
  };

  return (
    <div className="login-form">
      <h2>Ministry of Magic Authentication</h2>

      {state.error && (
        <div className="error-banner">
          <p>{state.error}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Wizard Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Magic Password (Hint: Alohomora)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={state.isLoading}>
          {state.isLoading ? 'Authenticating...' : 'Cast Login Spell'}
        </button>
      </form>

      <p className="hint">
        💡 Password hint: Use the unlocking charm "Alohomora"
      </p>
    </div>
  );
}

// ============================================================
// EXAMPLE 2: User Profile Card
// ============================================================

/**
 * Profile card displaying authenticated wizard info
 */
export function ExampleWizardProfile() {
  const { state, logout } = useMinistryAuth();

  if (!state.isAuthenticated || !state.wizard) {
    return <p>Please login to view your profile.</p>;
  }

  return (
    <div className="wizard-profile">
      <h2>Welcome, {state.wizard.name}!</h2>

      <div className="profile-details">
        <p><strong>House:</strong> {state.wizard.house}</p>
        <p><strong>Email:</strong> {state.wizard.email}</p>
        <p><strong>Role:</strong> {state.wizard.role}</p>
        <p><strong>Wand Core:</strong> {state.wizard.wandCore}</p>
        <p><strong>Patronus:</strong> {state.wizard.patronus}</p>
        <p><strong>Galleons:</strong> {state.wizard.galleons.toLocaleString()}</p>
        <p>
          <strong>Registered:</strong>{' '}
          {new Date(state.wizard.registeredAt).toLocaleDateString()}
        </p>
      </div>

      <button onClick={logout}>Cast Logout Spell</button>
    </div>
  );
}

// ============================================================
// EXAMPLE 3: Protected Route Guard
// ============================================================

/**
 * HOC for protecting routes that require authentication
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ExampleProtectedRoute({ children }: ProtectedRouteProps) {
  const { state } = useMinistryAuth();

  if (!state.isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Authentication Required</h2>
        <p>You must be a registered wizard to access this area.</p>
        <p>Please login to continue.</p>
      </div>
    );
  }

  return <>{children}</>;
}

// Usage:
/*
<ExampleProtectedRoute>
  <TeamManagement />
</ExampleProtectedRoute>
*/

// ============================================================
// EXAMPLE 4: Navigation Bar with Auth State
// ============================================================

/**
 * Navigation bar that adapts based on authentication state
 */
export function ExampleNavBar() {
  const { state, logout } = useMinistryAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Quidditch Manager</h1>
      </div>

      <div className="nav-links">
        {state.isAuthenticated ? (
          <>
            <span>Welcome, {state.wizard?.name}</span>
            <a href="/teams">My Teams</a>
            <a href="/league">League</a>
            <a href="/profile">Profile</a>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>

      {state.wizard && (
        <div className="nav-user-badge">
          <span className="house-badge">{state.wizard.house}</span>
          <span className="galleons">{state.wizard.galleons} 🪙</span>
        </div>
      )}
    </nav>
  );
}

// ============================================================
// EXAMPLE 5: Using Dispatch Directly (Advanced)
// ============================================================

/**
 * Example of using dispatch directly for custom actions
 * Useful when you need more control than the helper functions provide
 */
export function ExampleAdvancedAuthComponent() {
  const { state, dispatch } = useMinistryAuth();

  const handleCustomAction = () => {
    // Dispatch a custom action if needed
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const handleManualLogout = () => {
    // You can use dispatch directly instead of logout()
    dispatch({ type: 'LOGOUT_SPELL' });
  };

  return (
    <div>
      <h3>Advanced Auth Controls</h3>
      <button onClick={handleCustomAction}>Clear Errors</button>
      <button onClick={handleManualLogout}>Manual Logout</button>

      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}

// ============================================================
// EXAMPLE 6: App Root Setup
// ============================================================

/**
 * Example App.tsx showing how to wrap your app with the provider
 */
/*
import { MinistryAuthProvider } from '@/features/MinistryAuth';

export function App() {
  return (
    <MinistryAuthProvider>
      <Router>
        <ExampleNavBar />
        <Routes>
          <Route path="/login" element={<ExampleLoginForm />} />
          <Route
            path="/teams"
            element={
              <ExampleProtectedRoute>
                <TeamsPage />
              </ExampleProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ExampleProtectedRoute>
                <ExampleWizardProfile />
              </ExampleProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </MinistryAuthProvider>
  );
}
*/

// ============================================================
// EXAMPLE 7: Testing Login Flow
// ============================================================

/**
 * Example test component for trying the authentication
 */
export function ExampleAuthTester() {
  const { state, login, logout } = useMinistryAuth();

  const testLogin = async () => {
    await login('harry.potter@hogwarts.edu', 'Alohomora');
  };

  const testFailedLogin = async () => {
    await login('test@test.com', 'WrongPassword');
  };

  return (
    <div className="auth-tester">
      <h3>Auth State Tester</h3>

      <div className="test-buttons">
        <button onClick={testLogin}>Test Successful Login</button>
        <button onClick={testFailedLogin}>Test Failed Login</button>
        <button onClick={logout}>Test Logout</button>
      </div>

      <div className="state-display">
        <h4>Current State:</h4>
        <ul>
          <li>Authenticated: {state.isAuthenticated ? '✅' : '❌'}</li>
          <li>Loading: {state.isLoading ? '⏳' : '✅'}</li>
          <li>Error: {state.error || 'None'}</li>
          <li>Wizard: {state.wizard?.name || 'None'}</li>
          <li>Token: {state.token ? '🔑 Present' : '❌ None'}</li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 8: Custom Hook for Auth-Dependent Data
// ============================================================

/**
 * Example custom hook that depends on authentication
 */
export function useWizardTeams() {
  const { state } = useMinistryAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch if authenticated
    if (!state.isAuthenticated || !state.wizard) {
      setTeams([]);
      return;
    }

    async function fetchTeams() {
      setLoading(true);
      try {
        // Fetch teams managed by this wizard
        const response = await fetch(`/api/teams?managerId=${state.wizard!.id}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, [state.isAuthenticated, state.wizard, state.token]);

  return { teams, loading };
}

// Usage in component:
/*
function MyTeamsPage() {
  const { teams, loading } = useWizardTeams();

  if (loading) return <Spinner />;

  return (
    <div>
      <h2>My Teams</h2>
      {teams.map(team => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}
*/
