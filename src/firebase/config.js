// Firebase Configuration
// Replace these values with your Firebase project credentials

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// TODO: Replace with your Firebase project config
const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"

  apiKey: "AIzaSyA5VyZUANZxY8gsiY84ShG3RXJMeKa2tNg",
  authDomain: "auto-review-system-c3aee.firebaseapp.com",
  projectId: "auto-review-system-c3aee",
  storageBucket: "auto-review-system-c3aee.firebasestorage.app",
  messagingSenderId: "63694167171",
  appId: "1:63694167171:web:e4de005e7552f63a350fb6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
