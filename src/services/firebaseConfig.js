import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for Hall Management System
const firebaseConfig = {
  apiKey: "AIzaSyA4awS9_k9SiaMtLzy7Cb67DQTSQ4kIsGo",
  authDomain: "hall-managment.firebaseapp.com",
  projectId: "hall-managment",
  storageBucket: "hall-managment.firebasestorage.app",
  messagingSenderId: "122586435158",
  appId: "1:122586435158:web:ccec0afabf87817e5c75f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
