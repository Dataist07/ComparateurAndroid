// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMe0m6sG3gn7heRswJY6GOpHnzwbJO6E8",
  authDomain: "comparator-413015.firebaseapp.com",
  projectId: "comparator-413015",
  storageBucket: "comparator-413015.appspot.com",
  messagingSenderId: "565308592161",
  appId: "1:565308592161:web:5bf120eed50f586b001360",
  measurementId: "G-KJ3ZY005KK"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = initializeAuth(FirebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
export const FirebaseDB = getFirestore(FirebaseApp);
export const analytics = getAnalytics(FirebaseApp);