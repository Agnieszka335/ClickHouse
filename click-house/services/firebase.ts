import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { getFirestore, Firestore, setLogLevel } from "firebase/firestore";

setLogLevel('silent'); // Changed to silent to avoid console noise in production build

const appId = typeof window !== 'undefined' && window.__app_id ? window.__app_id : 'default-app-id';
const firebaseConfigStr = typeof window !== 'undefined' && window.__firebase_config ? window.__firebase_config : '{}';
const initialAuthToken = typeof window !== 'undefined' && window.__initial_auth_token ? window.__initial_auth_token : null;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  const firebaseConfig = JSON.parse(firebaseConfigStr);
  if (Object.keys(firebaseConfig).length > 0) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    console.warn("Firebase config is empty.");
  }
} catch (e) {
  console.error("Error initializing Firebase:", e);
}

export const initializeAuth = async () => {
    if (!auth) return;
    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
    } catch (error) {
        console.error("Auth error:", error);
    }
};

export { app, db, auth, appId };
