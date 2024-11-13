import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAozzCYoWuvEj2TA5acTROccHVOb-xjg4I",
  authDomain: "challengeseda2.firebaseapp.com",
  databaseURL: "https://challengeseda2-default-rtdb.firebaseio.com",
  projectId: "challengeseda2",
  storageBucket: "challengeseda2.firebasestorage.app",
  messagingSenderId: "134866943744",
  appId: "1:134866943744:web:c31848ca9248e29508fde5",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);