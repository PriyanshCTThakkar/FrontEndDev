import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from 'react';

import { auth } from "../lib/firebase";

import {
    onAuthStateChanged,
    type User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';


interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState((prev) => ({
        ...prev,
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      }));
    });
    return () => unsubscribe();
  }, []);

  async function signup(email: string, password: string) {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message || "Dark Magic Detected" }));
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }

  async function login(email: string, password: string) {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setState((s) => ({ ...s, error: e.message || "Dark Spell Detected" }));
    } finally {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }

  async function logout() {
    await signOut(auth);
  }

  const value: AuthContextValue = { ...state, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useMyAuth = () => {
  const authData = useContext(AuthContext);
  if (authData === undefined) {
    throw new Error('Missing AuthProvider wrapper!');
  }
  return authData;
};
