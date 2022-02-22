import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINSENDERID,
  appId: process.env.REACT_APP_APPID,
};
// Initialize Firebase
const fb = firebase.initializeApp(firebaseConfig);
const googleProvider = new firebase.auth.GoogleAuthProvider();
const db = fb.firestore();
const auth = fb.auth();

export { db, auth, googleProvider, fb };
