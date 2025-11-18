// app/page.js
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Please wait...");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      window.location.replace("/dashboard");
    } catch (err) {
      setMessage(err.message.includes("wrong-password") ? "Wrong password" : "Invalid email/password");
    }
  };

  return (
    <>
      {/* HERO */}
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            The FIC Hansraj <br />
            <span className="text-[#C0C0C0]">Stock Exchange</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Trade. Compete. Learn — in a live 8-round market simulation with real-time prices and ₹1,00,000 virtual capital.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#C0C0C0] hover:bg-white text-black font-bold text-xl px-16 py-7 rounded-xl transition-all hover:scale-105 shadow-2xl"
          >
            Join the Simulation
          </button>
        </div>
      </div>

      {/* ABOUT */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#333]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold mb-10">What is FIC Stock Exchange?</h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-4xl mx-auto">
            A high-intensity, real-time stock market simulation organized by the Finance & Investment Cell, Hansraj College.
            Compete with hundreds of students, manage a ₹1 lakh virtual portfolio, and experience the thrill of live trading across 8 intense rounds.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "01", title: "Register & Get ₹1,00,000", desc: "Every participant starts with equal virtual capital." },
              { step: "02", title: "Trade Live Stocks", desc: "Buy/sell real NSE stocks with live-updating prices." },
              { step: "03", title: "Compete in 8 Rounds", desc: "Top performers win cash prizes and certificates." }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-6xl font-bold text-[#C0C0C0] mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-[#0a0a0a] border-t border-[#333]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Real-time Price Updates",
              "Live Leaderboard",
              "Order Book & Trade History",
              "Portfolio Analytics",
              "Buy/Sell with One Click",
              "Secure Firebase Backend",
              "Mobile Responsive",
              "Zero Real Money Risk"
            ].map((feature) => (
              <div key={feature} className="bg-black border border-[#333] rounded-xl p-8 text-center hover:border-[#C0C0C0] transition">
                <div className="text-4xl mb-4">Check</div>
                <p className="text-lg font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-black border-t border-[#333]">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Dominate the Market?</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#C0C0C0] hover:bg-white text-black font-bold text-xl px-16 py-6 rounded-xl transition-all hover:scale-105"
          >
            Start Trading Now
          </button>
        </div>
      </section>

      {/* AUTH MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-[#C0C0C0] rounded-2xl p-10 w-full max-w-md relative">
            <h2 className="text-3xl font-bold text-center mb-8">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-black border border-gray-700 rounded-xl text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 bg-black border border-gray-700 rounded-xl text-white"
              />
              <button type="submit" className="w-full bg-[#C0C0C0] hover:bg-white text-black font-bold py-4 rounded-xl">
                {isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-gray-400 mt-6">
              {isLogin ? "No account? " : "Have account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
                className="text-[#C0C0C0] underline hover:text-white"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>

            <p className="text-center text-red-400 mt-4 font-medium">{message}</p>

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-8 text-4xl text-gray-500 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}