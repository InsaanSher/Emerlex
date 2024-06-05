import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGAAj1y-nNWC6ZueOXVaVSVFZTzUnMalM",
  authDomain: "emerlexpos-b3e34.firebaseapp.com",
  projectId: "emerlexpos-b3e34",
  storageBucket: "emerlexpos-b3e34.appspot.com",
  messagingSenderId: "352257504070",
  appId: "1:352257504070:web:1c0e270aa22ba8d771ab47"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
