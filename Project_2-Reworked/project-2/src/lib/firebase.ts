import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-x6HJVUnuK7l0VIfQhwIVos2IGSUyoRo",
  authDomain: "quidditch-manager-41f53.firebaseapp.com",
  projectId: "quidditch-manager-41f53",
  storageBucket: "quidditch-manager-41f53.firebasestorage.app",
  messagingSenderId: "377867398790",
  appId: "1:377867398790:web:443f4332ee8d183c7feb07",
  measurementId: "G-VQ97LR5KWB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const COLLECTIONS = {
  STORIES : "stories",
} as const;