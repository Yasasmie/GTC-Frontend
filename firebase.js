import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMwPpoCqEjp1dxxsYb6MvTVhDThhm2oZ8", // Use environment variables in production!
  authDomain: "assetfarm-3f85c.firebaseapp.com",
  projectId: "assetfarm-3f85c",
  storageBucket: "assetfarm-3f85c.firebasestorage.app",
  messagingSenderId: "931720122397",
  appId: "1:931720122397:web:4baff0590689ef133036f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();