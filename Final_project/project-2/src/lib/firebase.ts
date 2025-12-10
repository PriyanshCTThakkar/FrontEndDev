/**
 * Firebase Configuration & Initialization
 *
 * Initializes Firebase services for the Quidditch Manager application.
 * Exports configured instances of Firebase Auth and Firestore.
 *
 * @pattern Service Initialization
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object
 * Production credentials for Quidditch Manager
 */
const firebaseConfig = {
  apiKey: 'AIzaSyB-x6HJVUnuK7l0VIfQhwIVos2IGSUyoRo',
  authDomain: 'quidditch-manager-41f53.firebaseapp.com',
  projectId: 'quidditch-manager-41f53',
  storageBucket: 'quidditch-manager-41f53.firebasestorage.app',
  messagingSenderId: '377867398790',
  appId: '1:377867398790:web:443f4332ee8d183c7feb07',
  measurementId: 'G-VQ97LR5KWB'
};

/**
 * Initialize Firebase App
 * This must be called before using any Firebase services
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance
 * Use for all authentication operations (login, signup, logout)
 *
 * @example
 * ```typescript
 * import { auth } from './lib/firebase';
 * import { signInWithEmailAndPassword } from 'firebase/auth';
 *
 * await signInWithEmailAndPassword(auth, email, password);
 * ```
 */
export const auth = getAuth(app);

/**
 * Firestore Database instance
 * Use for all database operations (CRUD)
 *
 * @example
 * ```typescript
 * import { db } from './lib/firebase';
 * import { collection, getDocs } from 'firebase/firestore';
 *
 * const teamsSnapshot = await getDocs(collection(db, 'teams'));
 * ```
 */
export const db = getFirestore(app);

/**
 * Firestore Collection Names
 * Centralized constants for collection references
 */
export const COLLECTIONS = {
  TEAMS: 'teams',
  PLAYERS: 'players',
  MATCHES: 'matches',
  WIZARDS: 'wizards',
} as const;

export default app;
