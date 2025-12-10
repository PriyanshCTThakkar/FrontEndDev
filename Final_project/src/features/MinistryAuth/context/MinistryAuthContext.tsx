/**
 * MinistryAuthContext - Authentication State Management
 *
 * Implements useReducer pattern for robust state management with:
 * - Type-safe action dispatching
 * - localStorage persistence for session continuity
 * - Mock authentication system
 * - Custom hook for easy context consumption
 *
 * @architecture Context API + useReducer pattern
 */

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import type { Wizard } from '../../../types/wizardry';

// ============================================================
// TYPESCRIPT DEFINITIONS
// ============================================================

/**
 * Authentication state shape
 */
export interface MinistryAuthState {
  wizard: Wizard | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

/**
 * Action types for the reducer
 */
export type MinistryAuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { wizard: Wizard; token: string } }
  | { type: 'LOGOUT_SPELL' }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'RESTORE_SESSION'; payload: { wizard: Wizard; token: string } }
  | { type: 'CLEAR_ERROR' };

/**
 * Context value shape
 */
interface MinistryAuthContextValue {
  state: MinistryAuthState;
  dispatch: Dispatch<MinistryAuthAction>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = 'wizard_token';
const WIZARD_DATA_KEY = 'wizard_data';
const MAGIC_PASSWORD = 'Alohomora'; // Secret spell to unlock authentication

// ============================================================
// INITIAL STATE & PERSISTENCE
// ============================================================

/**
 * Load persisted session from localStorage
 * Restores user session on page refresh
 */
function loadPersistedSession(): Pick<MinistryAuthState, 'wizard' | 'token' | 'isAuthenticated'> {
  try {
    const token = localStorage.getItem(STORAGE_KEY);
    const wizardData = localStorage.getItem(WIZARD_DATA_KEY);

    if (token && wizardData) {
      const wizard: Wizard = JSON.parse(wizardData);
      return {
        wizard,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('[MinistryAuth] Failed to restore session:', error);
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WIZARD_DATA_KEY);
  }

  return {
    wizard: null,
    token: null,
    isAuthenticated: false,
  };
}

/**
 * Initial state with session restoration
 */
const initialState: MinistryAuthState = {
  ...loadPersistedSession(),
  isLoading: false,
  error: null,
};

// ============================================================
// REDUCER FUNCTION
// ============================================================

/**
 * Authentication state reducer
 * Handles all state transitions in a predictable, type-safe manner
 */
function ministryAuthReducer(
  state: MinistryAuthState,
  action: MinistryAuthAction
): MinistryAuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        wizard: action.payload.wizard,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        wizard: action.payload.wizard,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT_SPELL':
      return {
        wizard: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        // Keep existing session if already authenticated
        // Only clear if this was a failed login attempt
        ...(state.isAuthenticated ? {} : {
          wizard: null,
          token: null,
          isAuthenticated: false,
        }),
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}

// ============================================================
// CONTEXT CREATION
// ============================================================

/**
 * Ministry Authentication Context
 * Provides auth state and actions throughout the application
 */
const MinistryAuthContext = createContext<MinistryAuthContextValue | undefined>(
  undefined
);

// ============================================================
// PROVIDER COMPONENT
// ============================================================

interface MinistryAuthProviderProps {
  children: ReactNode;
}

/**
 * Ministry Authentication Provider
 *
 * Wraps the application to provide authentication state and actions.
 * Handles session persistence and restoration automatically.
 *
 * @example
 * ```tsx
 * <MinistryAuthProvider>
 *   <App />
 * </MinistryAuthProvider>
 * ```
 */
export function MinistryAuthProvider({ children }: MinistryAuthProviderProps) {
  const [state, dispatch] = useReducer(ministryAuthReducer, initialState);

  // ============================================================
  // PERSISTENCE SIDE EFFECT
  // ============================================================

  /**
   * Sync authentication state to localStorage
   * Runs whenever auth state changes
   */
  useEffect(() => {
    if (state.isAuthenticated && state.wizard && state.token) {
      // Persist session
      localStorage.setItem(STORAGE_KEY, state.token);
      localStorage.setItem(WIZARD_DATA_KEY, JSON.stringify(state.wizard));
    } else {
      // Clear session
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(WIZARD_DATA_KEY);
    }
  }, [state.isAuthenticated, state.wizard, state.token]);

  // ============================================================
  // AUTHENTICATION ACTIONS
  // ============================================================

  /**
   * Mock login function
   *
   * Authenticates a wizard using email and password.
   * Password must be "Alohomora" to succeed.
   *
   * @param email - Wizard's email address
   * @param password - Magic password (must be "Alohomora")
   * @throws Dispatches AUTH_ERROR if credentials are invalid
   *
   * @example
   * ```tsx
   * await login('harry@hogwarts.edu', 'Alohomora');
   * ```
   */
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Validate magic password
        if (password !== MAGIC_PASSWORD) {
          dispatch({
            type: 'AUTH_ERROR',
            payload: 'Invalid credentials! The spell failed. Try "Alohomora".',
          });
          return;
        }

        // Mock wizard data based on email
        const emailUsername = email.split('@')[0] || 'Wizard';
        const mockWizard: Wizard = {
          id: `wizard-${Date.now()}`,
          name: emailUsername.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email,
          house: determineHouseFromEmail(email),
          wandCore: 'Phoenix Feather',
          patronus: 'Stag',
          registeredAt: new Date(),
          role: 'Manager',
          galleons: 10000,
        };

        // Generate session token
        const token = `WIZ_TOKEN_${Date.now()}_${Math.random().toString(36).substring(2)}`;

        // Dispatch success
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { wizard: mockWizard, token },
        });

      } catch (error) {
        dispatch({
          type: 'AUTH_ERROR',
          payload: 'An unexpected error occurred during authentication.',
        });
      }
    },
    []
  );

  /**
   * Logout function
   *
   * Clears the current session and removes persisted data.
   * Dispatches LOGOUT_SPELL action to reset state.
   *
   * @example
   * ```tsx
   * logout();
   * ```
   */
  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT_SPELL' });
  }, []);

  /**
   * Clear error message
   *
   * Useful for dismissing error notifications in the UI
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value: MinistryAuthContextValue = {
    state,
    dispatch,
    login,
    logout,
    clearError,
  };

  return (
    <MinistryAuthContext.Provider value={value}>
      {children}
    </MinistryAuthContext.Provider>
  );
}

// ============================================================
// CUSTOM HOOK
// ============================================================

/**
 * useMinistryAuth - Custom hook to access auth context
 *
 * Provides type-safe access to authentication state and actions.
 * Must be used within a MinistryAuthProvider.
 *
 * @throws Error if used outside of MinistryAuthProvider
 *
 * @example
 * ```tsx
 * function ProfileCard() {
 *   const { state, logout } = useMinistryAuth();
 *
 *   if (!state.isAuthenticated) {
 *     return <LoginPrompt />;
 *   }
 *
 *   return (
 *     <div>
 *       <h2>Welcome, {state.wizard?.name}</h2>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMinistryAuth(): MinistryAuthContextValue {
  const context = useContext(MinistryAuthContext);

  if (context === undefined) {
    throw new Error(
      'useMinistryAuth must be used within a MinistryAuthProvider. ' +
      'Wrap your component tree with <MinistryAuthProvider>.'
    );
  }

  return context;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Determine Hogwarts house from email domain
 * Fun heuristic for demo purposes
 */
function determineHouseFromEmail(email: string): Wizard['house'] {
  const domain = email.split('@')[1]?.toLowerCase() || '';

  if (domain.includes('gryffindor') || domain.includes('brave')) {
    return 'Gryffindor';
  }
  if (domain.includes('slytherin') || domain.includes('ambitious')) {
    return 'Slytherin';
  }
  if (domain.includes('hufflepuff') || domain.includes('loyal')) {
    return 'Hufflepuff';
  }
  if (domain.includes('ravenclaw') || domain.includes('wise')) {
    return 'Ravenclaw';
  }

  // Default: randomly assign
  const houses: Wizard['house'][] = ['Gryffindor', 'Slytherin', 'Hufflepuff', 'Ravenclaw'];
  return houses[Math.floor(Math.random() * houses.length)] || 'Gryffindor';
}
