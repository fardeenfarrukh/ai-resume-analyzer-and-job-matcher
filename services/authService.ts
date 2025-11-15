import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import type { User } from '../types';

// IMPORTANT: Replace with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaaTw4vqJrxAQxOFDTGgY1_tIe4IKo-J4",
  authDomain: "ai-resume-analyzer-b10c9.firebaseapp.com",
  projectId: "ai-resume-analyzer-b10c9",
  storageBucket: "ai-resume-analyzer-b10c9.appspot.com",
  messagingSenderId: "624415482659",
  appId: "1:624415482659:web:61580c162bda1497d6e296"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


/**
 * Signs up a new user and creates a corresponding document in Firestore.
 */
export const signup = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Create a user profile in Firestore
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const newUser: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    isAdmin: false, // Default role
  };
  await setDoc(userDocRef, { email: newUser.email, isAdmin: newUser.isAdmin });
  
  return newUser;
};

/**
 * Logs in a user.
 */
export const login = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;
  
  // Fetch user profile from Firestore to get isAdmin flag
  const user = await getUserProfile(firebaseUser.uid);
  if (!user) {
    // This case is unlikely but handles DB inconsistency
    throw new Error("User profile not found.");
  }

  return user;
};

/**
 * Logs out the current user.
 */
export const logout = (): Promise<void> => {
  return signOut(auth);
};

/**
 * Listens for authentication state changes.
 */
export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return onFirebaseAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userProfile = await getUserProfile(firebaseUser.uid);
      callback(userProfile);
    } else {
      callback(null);
    }
  });
};

/**
 * Fetches a user's profile from Firestore.
 */
export const getUserProfile = async (uid: string): Promise<User | null> => {
  const userDocRef = doc(db, "users", uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const data = userDocSnap.data();
    return {
      id: uid,
      email: data.email,
      isAdmin: data.isAdmin || false,
    };
  } else {
    return null;
  }
};

/**
 * Fetches all users for the admin panel.
 * Requires Firestore rules allowing admins to read the 'users' collection.
 */
export const getAllUsers = async (): Promise<User[]> => {
  const usersCol = collection(db, "users");
  const userSnapshot = await getDocs(usersCol);
  const userList = userSnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      isAdmin: doc.data().isAdmin
  }));
  return userList;
};

/**
 * Deletes a user's Firestore documents (profile and all associated reports).
 * This is the complete client-side data cleanup for a user.
 */
export const deleteUserDocuments = async (userId: string): Promise<void> => {
    // 1. Find and delete all reports associated with the user.
    const reportsRef = collection(db, "reports");
    const q = query(reportsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    // Create an array of delete promises to run them in parallel.
    const deletePromises = querySnapshot.docs.map(reportDoc => deleteDoc(reportDoc.ref));
    await Promise.all(deletePromises);

    // 2. Delete the user's main profile document.
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
};
