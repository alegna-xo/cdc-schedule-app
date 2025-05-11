// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBJGoEGkCCRYboHzK7Fu1Fhwvrp3yGgYbQ",
    authDomain: "cdc-web-app-7f507.firebaseapp.com",
    projectId: "cdc-web-app-7f507",
    storageBucket: "cdc-web-app-7f507.firebasestorage.app",
    messagingSenderId: "179288378281",
    appId: "1:179288378281:web:0da3e8e902d86df8d252b8",
    measurementId: "G-JN2XFPCQ72"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);