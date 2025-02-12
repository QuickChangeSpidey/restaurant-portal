"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth"); // Redirect to auth if not logged in
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-green-500 text-white">
      <h1 className="text-4xl font-bold">Welcome to BOGO Ninja</h1>
    </div>
  );
}
