// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCeEKFRIijK6RxNuAjUhWJ6wUYAcxtu4kY",
  authDomain: "yameensportfolio.firebaseapp.com",
  projectId: "yameensportfolio",
  storageBucket: "yameensportfolio.firebasestorage.app",
  messagingSenderId: "819510076992",
  appId: "1:819510076992:web:7264a959baa33fb03ae1a5"
};

// Initialize Firebase (singleton pattern to prevent multiple initializations)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
