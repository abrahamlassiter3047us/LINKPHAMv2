// src/firebase.js (hoặc tạo một tệp tương tự)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBd_LhOLIDNS5elXZMQINAAXWUmpRkTFLE",
  authDomain: "tickproject-4e416.firebaseapp.com",
  projectId: "tickproject-4e416",
  storageBucket: "tickproject-4e416.firebasestorage.app",
  messagingSenderId: "213342025899",
  appId: "1:213342025899:web:52a37c77ce08f9680d1fee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
