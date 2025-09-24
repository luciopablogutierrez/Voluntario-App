import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string | undefined,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string | undefined,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string | undefined,
};

// Initialize only if we have the minimal required config
const app = !getApps().length ? initializeApp(firebaseConfig as any) : getApp();
const db = getFirestore(app);

export { db };
