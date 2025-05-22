// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// (optional) import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCEmvBKsokuMYOVbEoR54luj3WPuMshshw",
  authDomain: "fp-pso.firebaseapp.com",
  projectId: "fp-pso",
  storageBucket: "fp-pso.appspot.com",  // <-- ini YANG BENAR
  messagingSenderId: "619030250517",
  appId: "1:619030250517:web:e9cd05371d1eacb7f57a1c",
  measurementId: "G-CXKLQJR8T0"
};

// Prevent re-initialize on hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// const analytics = typeof window !== "undefined" ? getAnalytics(app) : null; // Only use analytics on client
const auth = getAuth(app);
export { app, db, auth };
