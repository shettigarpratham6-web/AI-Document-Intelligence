import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCqMPTD-tkAHcBfYpNFzB0HZEuAfLGcOLg",
  authDomain: "milestone2-f6f32.firebaseapp.com",
  projectId: "milestone2-f6f32",
  storageBucket: "milestone2-f6f32.firebasestorage.app",
  messagingSenderId: "553544183443",
  appId:"1:553544183443:web:bd7f9ea8b2598be7516766" ,
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
