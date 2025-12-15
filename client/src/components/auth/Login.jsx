import React from "react";
import {
  signInAnonymously,
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";

// --- Firebase Configuration (Inlined for stability) ---
const firebaseConfig = {
  apiKey: "AIzaSyDo9wv1ouNZ40ozJxeYPc7YFmGNSl79Xyc",
  authDomain: "doctor-plus-30fed.firebaseapp.com",
  projectId: "doctor-plus-30fed",
  storageBucket: "doctor-plus-30fed.firebasestorage.app",
  messagingSenderId: "62738341187",
  appId: "1:62738341187:web:2937ce884b6320f73623f6",
  measurementId: "G-JG9WQFKTSD",
};

// Initialize Firebase (Singleton pattern to avoid re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      alert("Sign-in failed. Please check your connection.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert(`Google Sign-In failed: ${error.message}`);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center mt-16">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Welcome to Doctor Plus
      </h2>
      <p className="mb-8 text-gray-600">
        Your AI-Powered Health Partner. Please sign in to continue.
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-lg border border-gray-300 shadow-sm transition duration-300 flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign In with Google
        </button>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleAnonymousSignIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
