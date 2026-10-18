import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// KEEP YOUR OWN VALUES HERE (Project Settings > Your apps)
const firebaseConfig = {
  apiKey: "AIzaSyD2PHXJSOzsbQG7KeGFf2pSq4EWuvoMq6M",

    authDomain: "studentachievementtracke-8ba45.firebaseapp.com",

    databaseURL: "https://studentachievementtracke-8ba45-default-rtdb.asia-southeast1.firebasedatabase.app/",

    projectId: "studentachievementtracke-8ba45",

    storageBucket: "studentachievementtracke-8ba45.firebasestorage.app",

    messagingSenderId: "749245938023",

    appId: "1:749245938023:web:de3d6d9fd6477899a017c2"

};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
