// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrKGzRJDZPdFLUHHsxm2iGcqP6Kczo8Xs",
  authDomain: "grimrk-mangahype.firebaseapp.com",
  projectId: "grimrk-mangahype",
  storageBucket: "grimrk-mangahype.appspot.com",
  messagingSenderId: "999551908846",
  appId: "1:999551908846:web:ab3e1a6e813bf8d68c6cff",
  measurementId: "G-BFC7SMSNFN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
