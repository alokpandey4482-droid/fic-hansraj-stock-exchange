// app/admin/page.js
"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { ref, set, push } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState("");
  const [severity, setSeverity] = useState("moderate");

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u && u.email === "admin@hansrajfic.com") { // ← CHANGE THIS
        setUser(u);
      } else {
        location.href = "/";
      }
    });
  }, []);

  const publishNews = async () => {
    if (!news.trim()) return;
    const impact = { mild: 0.03, moderate: 0.07, severe: 0.15 }[severity];
    const direction = Math.random() > 0.5 ? 1 : -1;

    // Save news
    await push(ref(db, "news"), {
      text: news,
      severity,
      timestamp: Date.now(),
    });

    // Update all stock prices
    const stocksRef = ref(db, "stocks");
    const snapshot = await stocksRef.once("value");
    snapshot.forEach((child) => {
      const oldPrice = child.val().price;
      const change = 1 + (impact * direction * (0.8 + Math.random() * 0.4));
      child.ref.update({ price: oldPrice * change });
    });

    setNews("");
    alert("NEWS PUBLISHED — MARKET MOVED!");
  };

  if (!user) return <div className="min-h-screen bg-black text-white flex items-center justify-center text-6xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-8xl font-black text-center mb-10 bg-gradient083-to-r from-red-500 to-purple-600 bg-clip-textUrl text-transparent">
          ADMIN CONTROL
        </h1>
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
          <textarea
            value={news}
            onChange={(e) => setNews(e.target.value)}
            placeholder="Type breaking news..."
            className="w-full p-8 text-4xl bg-black/50 rounded-3xl border border-white/30 focus:border-purple-500 outline-none mb-8"
            rows={6}
          />
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full p-8 text-4xl bg-black/50 rounded-3xl border border-white/30 mb-8">
            <option value="mild">Mild Impact</option>
            <option value="moderate">Moderate Impact</option>
            <option value="severe">Severe Impact</option>
          </select>
          <button onClick={publishNews} className="w-full py-12 text-6xl font-black bg-gradient-to-r from-red-600 to-purple-800 rounded-3xl hover:scale-105 transition">
            PUBLISH NEWS & SHAKE MARKET
          </button>
        </div>
        <button onClick={() => signOut(auth)} className="mt-8 block mx-auto px-12 py-6 bg-red-600 rounded-xl text-3xl">
          Logout
        </button>
      </div>
    </div>
  );
}