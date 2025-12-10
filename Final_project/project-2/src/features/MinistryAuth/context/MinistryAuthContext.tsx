/**
 * MinistryAuthContext - Firebase Authentication State Management
 *
 * Implements useReducer pattern with Firebase Auth integration:
 * - Type-safe action dispatching
 * - Firebase Auth (real authentication)
 * - Firestore user profile management
 * - Custom hook for easy context consumption
 *
 * @architecture Context API + useReducer + Firebase Auth
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
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '../../../lib/firebase';
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
  firebaseUser: FirebaseUser | null;
}

/**
 * Action types for the reducer
 */
export type MinistryAuthAction =
  | { type: 'AUTH_STATE_CHANGED'; payload: { wizard: Wizard | null; firebaseUser: FirebaseUser | null } }
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT_SPELL' }
  | { type: 'CLEAR_ERROR' };

/**
 * Context value shape
 */
interface MinistryAuthContextValue {
  state: MinistryAuthState;
  dispatch: Dispatch<MinistryAuthAction>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials interface
 */
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

// ============================================================
// INITIAL STATE
// ============================================================

/**
 * Initial authentication state
 */
const initialState: MinistryAuthState = {
  wizard: null,
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true while checking auth
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
    case 'AUTH_STATE_CHANGED':
      return {
        ...state,
        wizard: action.payload.wizard,
        firebaseUser: action.payload.firebaseUser,
        isAuthenticated: action.payload.wizard !== null,
        isLoading: false,
        error: null,
      };

    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'LOGOUT_SPELL':
      return {
        wizard: null,
        firebaseUser: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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
 * Wraps the application to provide Firebase authentication state and actions.
 * Listens to Firebase Auth state changes and syncs with Firestore wizard profiles.
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
  // FIREBASE AUTH LISTENER
  // ============================================================

  /**
   * Listen to Firebase Auth state changes
   * Automatically syncs authentication state with Firestore
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, fetch wizard profile from Firestore
        try {
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
          } else {
            // Wizard profile doesn't exist (shouldn't happen)
            console.warn('[MinistryAuth] Wizard profile not found for user:', firebaseUser.uid);
            dispatch({
              type: 'AUTH_STATE_CHANGED',
              payload: { wizard: null, firebaseUser: null },
            });
          }
        } catch (error) {
          console.error('[MinistryAuth] Failed to fetch wizard profile:', error);
          dispatch({
            type: 'AUTH_ERROR',
            payload: 'Failed to load wizard profile from Ministry archives',
          });
        }
      } else {
        // User is logged out
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: { wizard: null, firebaseUser: null },
        });
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // ============================================================
  // AUTHENTICATION ACTIONS
  // ============================================================

  /**
   * Login with Firebase Auth
   *
   * @param email - User's email address
   * @param password - User's password
   * @throws Dispatches AUTH_ERROR if login fails
   */
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        dispatch({ type: 'AUTH_LOADING', payload: true });

        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

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
        } else {
          throw new Error('Wizard profile not found in Ministry archives');
        }
      } catch (error: any) {
        console.error('[MinistryAuth] Login failed:', error);

        let errorMessage = 'Authentication failed';
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          errorMessage = 'Invalid email or password';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later';
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({
          type: 'AUTH_ERROR',
          payload: errorMessage,
        });

        // Re-throw error so calling code knows login failed
        throw new Error(errorMessage);
      }
    },
    []
  );

  /**
   * Signup with Firebase Auth and create wizard profile
   *
   * @param email - User's email address
   * @param password - User's password
   * @param name - User's display name
   * @throws Dispatches AUTH_ERROR if signup fails
   */
  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<void> => {
      try {
        dispatch({ type: 'AUTH_LOADING', payload: true });

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create wizard profile in Firestore
        const house = determineHouseFromEmail(email);
        const wizardProfile: Omit<Wizard, 'id'> = {
          name,
          email,
          house,
          wandCore: randomWandCore(),
          patronus: randomPatronus(),
          registeredAt: new Date(),
          role: 'Manager',
          galleons: 10000,
        };

        const wizardRef = doc(db, COLLECTIONS.WIZARDS, firebaseUser.uid);
        await setDoc(wizardRef, {
          ...wizardProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Update state with new wizard
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            wizard: { id: firebaseUser.uid, ...wizardProfile },
            firebaseUser,
          },
        });
      } catch (error: any) {
        console.error('[MinistryAuth] Signup failed:', error);

        let errorMessage = 'Registration failed';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered with the Ministry';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Use at least 6 characters';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({
          type: 'AUTH_ERROR',
          payload: errorMessage,
        });

        // Re-throw error so calling code knows signup failed
        throw new Error(errorMessage);
      }
    },
    []
  );

  /**
   * Logout from Firebase Auth
   *
   * Signs out the current user and clears all state
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      dispatch({ type: 'LOGOUT_SPELL' });
    } catch (error) {
      console.error('[MinistryAuth] Logout failed:', error);
      dispatch({
        type: 'AUTH_ERROR',
        payload: 'Failed to logout - Ministry protection active!',
      });
    }
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
    signup,
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

/**
 * Generate random wand core for new wizards
 */
function randomWandCore(): string {
  const cores = [
    'Phoenix Feather',
    'Dragon Heartstring',
    'Unicorn Hair',
    'Thestral Tail Hair',
    'Veela Hair',
  ];
  return cores[Math.floor(Math.random() * cores.length)] || 'Phoenix Feather';
}

/**
 * Generate random patronus for new wizards
 */
function randomPatronus(): string {
  const patronuses = [
    'Stag',
    'Otter',
    'Jack Russell Terrier',
    'Swan',
    'Horse',
    'Phoenix',
    'Doe',
    'Hare',
    'Wolf',
    'Lynx',
  ];
  return patronuses[Math.floor(Math.random() * patronuses.length)] || 'Stag';
}
