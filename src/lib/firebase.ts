import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyBRYQnQ2uGyOx4sfIsiAkiJhxPQIrw6NNM",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "bamboo-flow-h8gvj.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "bamboo-flow-h8gvj",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "bamboo-flow-h8gvj.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "814982496499",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:814982496499:web:08fd88b6773d80f91ff786"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app, metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || "ai-studio-citymindai-202df2af-1c19-472d-a923-0c9a03892a9d");

// Standard Error types for Firestore
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase connected successfully");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    } else {
      console.log("Firebase initial check completed:", error);
    }
  }
}
testConnection();

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };

