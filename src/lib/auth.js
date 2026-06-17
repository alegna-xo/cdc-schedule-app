import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged as _onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase.js';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signOutUser() {
  return signOut(auth);
}

// Pre-bound to the app's auth instance so callers don't need to import auth
export function onAuthStateChanged(callback) {
  return _onAuthStateChanged(auth, callback);
}
