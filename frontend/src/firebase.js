// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyDP-eAwM3ypxDcNvQnxaCb_igcXLEJVkEE",
  authDomain: "automate-ai-7cb99.firebaseapp.com",
  projectId: "automate-ai-7cb99",
  storageBucket: "automate-ai-7cb99.firebasestorage.app",
  messagingSenderId: "737401811128",
  appId: "1:737401811128:web:3b9e32a6fb29d2b304044d",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

