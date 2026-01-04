// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBf9k39nxwz4G6iWgNHNGqpVobNVPcRuFU",
  authDomain: "sri-sudha-school.firebaseapp.com",
  projectId: "sri-sudha-school",
  storageBucket: "sri-sudha-school.firebasestorage.app",
  messagingSenderId: "735694245944",
  appId: "1:735694245944:web:8699450887be334e0956cd",
  measurementId: "G-LM01JHHJQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;

