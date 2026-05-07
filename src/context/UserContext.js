import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { db } from '../services/firebaseConfig';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const UserContext = createContext(null);

const TOKEN_KEY = 'hms_token';
const USER_KEY = 'hms_user';

const userDocRef = (uid) => doc(db, 'users', uid);

const buildUserData = (firebaseUser, profile = {}) => ({
  id: firebaseUser.uid,
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  studentId: profile.studentId || '',
  name: firebaseUser.displayName || profile.name || 'Student',
  role: profile.role || 'Student',
  department: profile.department || '',
  batch: profile.batch || '',
  phone: profile.phone || '',
  room: profile.room || 'N/A'
});

const saveUserProfile = async (firebaseUser, profile = {}) => {
  const payload = {
    studentId: profile.studentId || '',
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: profile.name || firebaseUser.displayName || 'Student',
    role: profile.role || 'Student',
    department: profile.department || '',
    batch: profile.batch || '',
    phone: profile.phone || '',
    room: profile.room || 'N/A',
    updatedAt: serverTimestamp()
  };

  const snapshot = await getDoc(userDocRef(firebaseUser.uid));
  if (!snapshot.exists()) {
    await setDoc(userDocRef(firebaseUser.uid), {
      ...payload,
      createdAt: serverTimestamp()
    });
  } else {
    await setDoc(userDocRef(firebaseUser.uid), payload, { merge: true });
  }

  return payload;
};

const fetchUserProfile = async (firebaseUser) => {
  const snapshot = await getDoc(userDocRef(firebaseUser.uid));
  if (!snapshot.exists()) {
    return buildUserData(firebaseUser);
  }

  const profile = snapshot.data() || {};
  return buildUserData(firebaseUser, profile);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await fetchUserProfile(firebaseUser);
          const savedUserData = await SecureStore.getItemAsync(USER_KEY);
          const userData = savedUserData ? { ...profile, ...JSON.parse(savedUserData) } : profile;

          setToken(await firebaseUser.getIdToken());
          setUser(userData);
          
          // Save user data locally
          await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
        } else {
          // User is logged out
          setToken(null);
          setUser(null);
          await SecureStore.deleteItemAsync(TOKEN_KEY);
          await SecureStore.deleteItemAsync(USER_KEY);
        }
      } catch (error) {
        console.warn('Failed to restore session', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async ({ email, password }) => {
    try {
      const firebaseUser = await authService.loginStudent(email, password);
      const userData = await fetchUserProfile(firebaseUser);
      
      setToken(await firebaseUser.getIdToken());
      setUser(userData);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const register = async ({ email, password, name, uid, department, batch, phone }) => {
    try {
      console.log('Starting registration for:', email);
      
      const firebaseUser = await authService.registerStudent(email, password);
      const userData = await saveUserProfile(firebaseUser, {
        name,
        studentId: uid,
        department,
        batch,
        phone,
        role: 'Student',
        room: 'N/A'
      });
      console.log('User profile saved to Firestore:', userData);
      
      setToken(await firebaseUser.getIdToken());
      setUser(userData);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      console.log('Registration successful');
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed. Please check Firebase rules and configuration.');
    }
  };

  const switchRole = async (role) => {
    if (!user) return;
    const nextUser = { ...user, role };
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
      setToken(null);
      setUser(null);
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates = {}) => {
    try {
      const firebaseUser = authService.getCurrentUser();
      if (!firebaseUser) throw new Error('No authenticated user');

      const saved = await saveUserProfile(firebaseUser, updates);
      const merged = { ...buildUserData(firebaseUser, saved) };
      setUser(merged);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(merged));
      return merged;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, login, logout, switchRole, register, updateProfile }),
    [user, token, loading]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }
  return context;
};