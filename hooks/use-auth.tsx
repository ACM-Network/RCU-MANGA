"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";

import {
  auth,
  ensureFirebaseAppCheck,
  googleProvider,
  isFirebaseConfigured,
} from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      return;
    }

    ensureFirebaseAppCheck();

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error("Firebase Auth is not configured.");
    }

    if (!googleProvider) {
      throw new Error("Google Sign-In is not configured.");
    }

    await signInWithPopup(auth, googleProvider);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase Auth is not configured.");
    }

    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase Auth is not configured.");
    }

    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name.trim() || "Cinematic Reader" });
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) {
      return;
    }

    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isConfigured: isFirebaseConfigured,
      signInWithGoogle,
      signIn,
      signUp,
      signOut,
    }),
    [loading, signIn, signInWithGoogle, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
