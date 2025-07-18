// Firebase configuration for Smilescope app
// Fill in with your actual Firebase project credentials
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyB5KsupXeqpe2Jw7sTf7TyK0UWE-ssaSa8",
    authDomain: "smilescope-2f6ce.firebaseapp.com",
    projectId: "smilescope-2f6ce",
    storageBucket: "smilescope-2f6ce.firebasestorage.app",
    messagingSenderId: "85695349817",
    appId: "1:85695349817:web:5c371b385e656278d4b9e8",
    measurementId: "G-3FVWBG1WXW"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); 