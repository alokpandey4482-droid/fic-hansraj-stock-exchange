// app/admin/page.js → FINAL FIXED: SEPARATE TRIGGERS + NO ERRORS
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, push, set, remove, onValue, get } from "firebase/database";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [news, setNews] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [selectedStocks, setSelectedStocks] = useState({});
  const [impactPercent, setImpactPercent] = useState(10);
  const [message, setMessage] = useState("");
  const [stocks, setStocks] = useState({});
  const [pendingNews, setPendingNews] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [isFrozen, setIsFrozen] = useState(false);

  const ADMIN_PASS = "PunkRocker@Alok0045";

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    if (!isAuth) return;
    onValue(ref(db, "stocks"), (s) => setStocks(s.val() || {}));
    onValue(ref(db, "pendingNews"), (s) => setPendingNews(s.val() || {}));
    onValue(ref(db, "round/current"), (s) => setCurrentRound(s.val() || 1));
    onValue(ref(db, "game/frozen"), (s) => setIsFrozen(s.val() === true));
  }, [isAuth]);

  const login = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setIsAuth(true);
      setMessage("GOD MODE ACTIVATED");
    } else setMessage("WRONG PASSWORD");
  };

  const publishNews = async () => {
    if (!news.trim()) return setMessage("Write news first!");
    const id = Date.now().toString();
    await set(ref(db, `pendingNews/${id}`), {
      id,
      text: news,
      severity,
      stocks: selectedStocks,
      impact: impactPercent,
      newsTriggered: false,
      priceTriggered: false,
      timestamp: Number(id),
    });
    setNews("");
    setSelectedStocks({});
    setImpactPercent(10);
    setMessage("NEWS QUEUED — READY TO TRIGGER");
  };

  // SHOW NEWS ONLY
  const triggerNewsOnly = async (id) => {
    const n = pendingNews[id];
    if (!n || n.newsTriggered) return;

    try {
      // Clean object — NO UNDEFINED VALUES!
      const cleanNews = {
        id: n.id || id,
        text: n.text,
        severity: n.severity,
        impact: n.impact || 0,
        stocks: n.stocks || {},
        newsTriggered: true,
        priceTriggered: n.priceTriggered || false,
        newsTriggerTime: Date.now(),
        timestamp: n.timestamp || Date.now(),
      };

      await push(ref(db, "liveNews"), cleanNews);
      await set(ref(db, `pendingNews/${id}/newsTriggered`), true);
      setMessage(`NEWS FLASHED: "${n.text}"`);
    } catch (err) {
      console.error("triggerNewsOnly error:", err);
      setMessage("FAILED TO TRIGGER NEWS");
    }
  };

  // PRICE SHOCK ONLY
  const triggerPriceOnly = async (id) => {
    const n = pendingNews[id];
    if (!n || n.priceTriggered) return;

    try {
      for (const [sym, apply] of Object.entries(n.stocks || {})) {
        if (!apply) continue;
        const price = stocks[sym]?.price || 100;
        // impact can be positive or negative
        const direction = Math.random() > 0.5 ? 1 : -1;
        const changeMultiplier = 1 + (n.impact / 100) * direction;
        await set(ref(db, `stocks/${sym}/price`), Math.max(10, Math.round(price * changeMultiplier * 100) / 100));
      }

      await set(ref(db, `pendingNews/${id}/priceTriggered`), true);
      setMessage(`PRICE SHOCKED: ${Object.keys(n.stocks || {}).filter(s => n.stocks[s]).join(", ")}`);
    } catch (err) {
      console.error("triggerPriceOnly error:", err);
      setMessage("FAILED TO TRIGGER PRICE SHOCK");
    }
  };

  // UPDATED deleteNews — removes from pending and from liveNews if already shown
  const deleteNews = async (id) => {
    const n = pendingNews[id];
    if (!n) return;

    try {
      // 1. Remove from pending
      await remove(ref(db, `pendingNews/${id}`));

      // 2. If news was already shown → also delete it from liveNews
      if (n.newsTriggered) {
        const liveSnap = await get(ref(db, "liveNews"));
        if (liveSnap.exists()) {
          const liveData = liveSnap.val();
          const liveKeyToDelete = Object.keys(liveData).find((key) =>
            liveData[key].id === id ||
            (liveData[key].text === n.text && liveData[key].timestamp == n.timestamp)
          );
          if (liveKeyToDelete) {
            await remove(ref(db, `liveNews/${liveKeyToDelete}`));
          }
        }
      }

      setMessage("NEWS ERASED — NO TRACE LEFT");
    } catch (err) {
      console.error("deleteNews error:", err);
      setMessage("FAILED TO DELETE NEWS");
    }
  };

  const freeze = () => set(ref(db, "game/frozen"), true).then(() => setMessage("TRADING FROZEN"));
  const unfreeze = () => set(ref(db, "game/frozen"), false).then(() => setMessage("TRADING UNLOCKED"));
  const nextRound = () => set(ref(db, "round/current"), currentRound + 1).then(() => setMessage(`ROUND ${currentRound + 1} STARTED`));
  const prevRound = () => currentRound > 1 && set(ref(db, "round/current"), currentRound - 1).then(() => setMessage(`BACK TO ROUND ${currentRound - 1}`));

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-10">
        <form onSubmit={login} className="text-center">
          <h1 className="text-9xl font-black mb-16 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">GOD</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-96 p-8 text-5xl bg-white/10 rounded-3xl border-4 border-purple-600" autoFocus />
          <button className="block w-96 mt-10 py-12 text-6xl font-black bg-red-600 rounded-3xl hover:scale-105">ENTER</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-9xl font-black text-center mb-8 bg-gradient-to-r from-red-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent">
          MARKET GOD v2
        </h1>

        <div className="text-center mb-10">
          <p className="text-5xl font-bold text-cyan-400">Round {currentRound}</p>
          <p className={`text-6xl font-black mt-4 ${isFrozen ? "text-red-500" : "text-green-500"}`}>
            {isFrozen ? "FROZEN" : "LIVE"}
          </p>
        </div>

        {/* NEWS CREATOR */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 mb-12 border-4 border-purple-700">
          <textarea value={news} onChange={(e) => setNews(e.target.value)} placeholder="Breaking news..." className="w-full p-8 text-3xl bg-black/50 rounded-3xl mb-6" rows={4} />
          <div className="grid grid-cols-2 gap-6 mb-6">
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="p-6 text-3xl bg-black/50 rounded-3xl">
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">SEVERE</option>
            </select>
            <input type="number" value={impactPercent} onChange={(e) => setImpactPercent(+e.target.value)} placeholder="% Impact" className="p-6 text-3xl bg-black/50 rounded-3xl" />
          </div>
          <p className="text-3xl mb-4 text-cyan-400">Select Stocks for Price Impact:</p>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.keys(stocks).map(s => (
              <label key={s} className="flex items-center gap-3 text-2xl">
                <input type="checkbox" checked={selectedStocks[s] || false} onChange={(e) => setSelectedStocks({ ...selectedStocks, [s]: e.target.checked })} />
                <span>{s}</span>
              </label>
            ))}
          </div>
          <button onClick={publishNews} className="w-full py-12 text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl hover:scale-105">
            QUEUE NEWS
          </button>
        </div>

        {/* PENDING NEWS */}
        <div className="space-y-8 mb-16">
          {Object.entries(pendingNews)
            .sort(([, a], [, b]) => b.timestamp - a.timestamp)
            .map(([id, n]) => (
              <div key={id} className="bg-white/10 rounded-3xl p-8 border-2 border-purple-600">
                <p className="text-4xl font-bold mb-2">{n.severity.toUpperCase()}: {n.text}</p>
                <p className="text-2xl text-gray-400 mb-6">
                  → {Object.keys(n.stocks || {}).filter(s => n.stocks[s]).join(", ")} (±{n.impact}%)
                </p>
                <div className="flex gap-6">
                  <button
                    onClick={() => triggerNewsOnly(id)}
                    disabled={n.newsTriggered}
                    className={`px-16 py-8 text-3xl font-black rounded-3xl ${n.newsTriggered ? "bg-gray-700" : "bg-yellow-600 hover:scale-110"}`}
                  >
                    {n.newsTriggered ? "NEWS SHOWN" : "SHOW NEWS"}
                  </button>
                  <button
                    onClick={() => triggerPriceOnly(id)}
                    disabled={n.priceTriggered}
                    className={`px-16 py-8 text-3xl font-black rounded-3xl ${n.priceTriggered ? "bg-gray-700" : "bg-red-600 hover:scale-110"}`}
                  >
                    {n.priceTriggered ? "PRICE MOVED" : "TRIGGER PRICE"}
                  </button>
                  <button onClick={() => deleteNews(id)} className="px-16 py-8 text-3xl font-black bg-gray-800 rounded-3xl hover:bg-red-900">
                    DELETE
                  </button>
                </div>
              </div>
            ))}
        </div>
               
        {/* PRICE TRIGGER HISTORY */}
<div className="bg-white/10 rounded-3xl p-10 mb-12 border-4 border-red-700">
  <h3 className="text-5xl font-black mb-8 text-red-400">PRICE TRIGGER HISTORY</h3>
  <div className="space-y-6">
    {Object.entries(pendingNews)
      .filter(([, n]) => n.priceTriggered)
      .sort(([, a], [, b]) => (b.priceTriggerTime || 0) - (a.priceTriggerTime || 0))
      .map(([id, n]) => (
        <div key={id} className="bg-red-900/30 p-6 rounded-2xl border border-red-600">
          <p className="text-3xl font-bold">{n.text}</p>
          <p className="text-xl text-gray-300">
            Shocked: {Object.keys(n.stocks || {}).filter(s => n.stocks[s]).join(", ")} (±{n.impact}%)
          </p>
          <p className="text-sm text-gray-500">
            {new Date(n.priceTriggerTime || n.timestamp).toLocaleTimeString()}
          </p>
        </div>
      ))}
  </div>
</div>

        {/* GOD BUTTONS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
          <button onClick={prevRound} className="py-20 text-6xl font-black bg-gradient-to-r from-purple-800 to-purple-600 rounded-3xl hover:scale-110">
            ← PREV ROUND
          </button>
          <button onClick={freeze} className="py-20 text-6xl font-black bg-red-600 rounded-3xl hover:scale-110">FREEZE</button>
          <button onClick={unfreeze} className="py-20 text-6xl font-black bg-green-600 rounded-3xl hover:scale-110">UNFREEZE</button>
          <button onClick={nextRound} className="py-20 text-6xl font-black bg-blue-600 rounded-3xl hover:scale-110">NEXT ROUND →</button>
        </div>

        {message && (
          <div className="text-center mt-16">
            <p className="text-7xl font-black text-green-400 animate-pulse">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
