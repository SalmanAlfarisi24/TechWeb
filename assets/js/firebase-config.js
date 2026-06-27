// Import SDK Firebase yang diperlukan (Gunakan versi CDN CDN modern yang kompatibel dengan ES Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Konfigurasi Firebase milik proyek Anda
const firebaseConfig = {
  apiKey: "AIzaSyBzFP24wY3JpWO9cwdsNxQLJtp6MTSUUqE",
  authDomain: "testproject-525b4.firebaseapp.com",
  databaseURL: "https://testproject-525b4-default-rtdb.firebaseio.com",
  projectId: "testproject-525b4",
  storageBucket: "testproject-525b4.firebasestorage.app",
  messagingSenderId: "708982701670",
  appId: "1:708982701670:web:324098d7962cef422037a7",
  measurementId: "G-RNGPW5823K"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Realtime Database
const db = getDatabase(app);

// Ekspor objek db agar bisa di-import di file crud-testimoni.js
export { db };