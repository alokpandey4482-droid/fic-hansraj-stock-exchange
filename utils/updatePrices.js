// utils/updatePrices.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

// Your REAL Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC29RoFWLckYh2NpIjOPlYbD4tKx81Npg0",
  authDomain: "fic-hansraj-stock.firebaseapp.com",
  databaseURL: "https://fic-hansraj-stock-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fic-hansraj-stock",
  storageBucket: "fic-hansraj-stock.firebasestorage.app",
  messagingSenderId: "889246830076",
  appId: "1:889246830076:web:b585acd11981915d177679",
  measurementId: "G-S3QXS289LH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const stocks = {
  RELIANCE: { name: "Reliance Industries", base: 2987.45 },
  TCS: { name: "Tata Consultancy", base: 4198.30 },
  HDFCBANK: { name: "HDFC Bank", base: 1624.10 },
  INFY: { name: "Infosys", base: 1876.90 },
  ITC: { name: "ITC Limited", base: 492.55 },
  BHARTIARTL: { name: "Bharti Airtel", base: 1482.30 },
  SBIN: { name: "State Bank of India", base: 812.65 }
};

let currentPrices = { ...stocks };

function getRandomChange() {
  return (Math.random() - 0.5) * 3.8; // ±1.9% max
}

function updatePrices() {
  const updates = {};

  Object.keys(currentPrices).forEach(symbol => {
    const stock = currentPrices[symbol];
    const changePercent = getRandomChange();
    const oldPrice = stock.price || stock.base;
    const newPrice = oldPrice * (1 + changePercent / 100);

    stock.price = Number(newPrice.toFixed(2));

    updates[symbol] = {
      name: stock.name,
      price: stock.price,
      change: changePercent
    };
  });

  set(ref(db, "stocks"), updates)
    .then(() => {
      console.log("Prices updated at", new Date().toLocaleTimeString());
      console.log("RELIANCE → ₹" + updates.RELIANCE.price + " (" + updates.RELIANCE.change.toFixed(2) + "%)");
    })
    .catch(err => console.error("Error updating prices:", err));
}

// FIXED LINE — was missing parentheses!
setInterval(updatePrices, 3000);

// First update immediately
updatePrices();

console.log("REAL-TIME PRICE UPDATER IS NOW RUNNING!");
console.log("Prices update every 3 seconds — watch your dashboard!");
console.log("Press Ctrl+C to stop");