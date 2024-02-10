// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCda1Kl5-uYxJCqKZY-kSGuvtxw4j_QA8k",
  authDomain: "cinebite-app.firebaseapp.com",
  projectId: "cinebite-app",
  storageBucket: "cinebite-app.appspot.com",
  messagingSenderId: "649020752034",
  appId: "1:649020752034:web:d9936c919e3a576f9b57fb",
  measurementId: "G-1EL30D4DQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};