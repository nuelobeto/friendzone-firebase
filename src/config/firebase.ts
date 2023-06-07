import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAX_wGeOdRtVNLBwYll52BgYZ5-I6_PaV4",
  authDomain: "friendzone-5bd08.firebaseapp.com",
  projectId: "friendzone-5bd08",
  storageBucket: "friendzone-5bd08.appspot.com",
  messagingSenderId: "809750765671",
  appId: "1:809750765671:web:2af38e60c744f939c5f4c2",
  databaseURL: "friendzone-5bd08-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);
