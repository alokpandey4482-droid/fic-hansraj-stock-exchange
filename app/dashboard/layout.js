// app/dashboard/layout.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(false);
      } else {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-[#333] p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">FIC Hansraj Stock Exchange</h1>
        <button
          onClick={() => auth.signOut().then(() => router.replace("/"))}
          className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
}