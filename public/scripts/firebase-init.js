// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANFMLhxnMiKWiW_TeV_2irswBONJogux8",
  authDomain: "digitaltipping.firebaseapp.com",
  projectId: "digitaltipping",
  storageBucket: "digitaltipping.appspot.com",
  messagingSenderId: "1028902624608",
  appId: "1:1028902624608:web:101410a2bbd20316701205",
  measurementId: "G-HHTG6R4CH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);