// File path: src/FirebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCivIOePVK3E1mvCt5SCBShoNbZfRofTLo",
  authDomain: "dateing-outh.firebaseapp.com",
  projectId: "dateing-outh",
  storageBucket: "dateing-outh.appspot.com",
  messagingSenderId: "598401877878",
  appId: "1:598401877878:web:4fbca5807f217812c21c57",
  measurementId: "G-2MBHYBR2CK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const FIREBASE_AUTH = getAuth(app);
const FIREBASE_DB = getFirestore(app);
const FIREBASE_STORAGE = getStorage(app);

export { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE };
