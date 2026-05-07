import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const authService = {
  // Register new student
  async registerStudent(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered in Firebase Auth:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Registration error in authService:', error.code, error.message);
      throw new Error(error.message);
    }
  },

  // Login with email and password
  async loginStudent(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};
