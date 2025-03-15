// Auth.js - Authentication functions
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence 
} from "firebase/auth";

// Fix the import path to match your project structure
import { auth } from "./Firebase";  // Adjust this path as needed, for example "../Firebase/Firebase"

const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistence set to session only.");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInAsGuest = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("Guest user signed in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Guest login failed:", error.message);
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};