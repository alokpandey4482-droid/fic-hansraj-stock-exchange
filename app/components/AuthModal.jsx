// app/components/AuthModal.jsx
"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
      alert("Success! You are now logged in.");
    } catch (err) {
      setError(err.message.includes("wrong-password") ? "Wrong password" : "Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-black border border-[#C0C0C0] rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {isLogin ? "Welcome Back" : "Join the Simulation"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="College Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-5 py-4 bg-[#111] border border-[#C0C0C0]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C0C0C0]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-5 py-4 bg-[#111] border border-[#C0C0C0]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C0C0C0]"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C0C0C0] text-black font-medium py-4 rounded-xl hover:bg-white transition-all active:scale-95 disabled:opacity-70"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#C0C0C0] underline hover:text-white"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-[#C0C0C0] text-3xl hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}