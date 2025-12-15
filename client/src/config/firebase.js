import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDo9wv1ouNZ40ozJxeYPc7YFmGNSl79Xyc",
  authDomain: "doctor-plus-30fed.firebaseapp.com",
  projectId: "doctor-plus-30fed",
  storageBucket: "doctor-plus-30fed.firebasestorage.app",
  messagingSenderId: "62738341187",
  appId: "1:62738341187:web:2937ce884b6320f73623f6",
  measurementId: "G-JG9WQFKTSD",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
