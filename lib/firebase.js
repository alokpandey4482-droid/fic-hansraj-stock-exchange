// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";   // ← ADD THIS LINE

// ←←← PUT YOUR REAL CONFIG HERE (copy from Firebase console) ←←←
const firebaseConfig = {
  apiKey: "AIzaSyC29RoFWLckYh2NpIjOPlYbD4tKx81Npg0",
  authDomain: "fic-hansraj-stock.firebaseapp.com",
  databaseURL: "https://fic-hansraj-stock-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fic-hansraj-stock",
  storageBucket: "fic-hansraj-stock.firebasestorage.app",
  messagingSenderId: "889246830076",
  appId: "1:889246830076:web:b585acd11981915d177679"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);   // ← ADD THIS LINE