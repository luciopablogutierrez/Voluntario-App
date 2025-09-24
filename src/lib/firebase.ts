import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function createFirebaseAppSafe() {
  try {
    const hasMinConfig = Boolean(
      firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
    );
    if (!hasMinConfig) return null;
    return !getApps().length ? initializeApp(firebaseConfig as any) : getApp();
  } catch {
    return null;
  }
}

const app = createFirebaseAppSafe();
// Deliberately type as any to avoid hard crash when config is missing.
const db: any = app ? getFirestore(app as any) : null;

export { db };
