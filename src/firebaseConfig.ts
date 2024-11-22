import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqxtl8_addggGKl1ZZFjNPJx7iBgebUsg",
  authDomain: "phone-auth-totalx.firebaseapp.com",
  projectId: "phone-auth-totalx",
  storageBucket: "phone-auth-totalx.firebasestorage.app",
  messagingSenderId: "301328474080",
  appId: "1:301328474080:web:31d6b49f5092f9d6805585",
  measurementId: "G-R6JMLZM2C3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
