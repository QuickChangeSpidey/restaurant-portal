"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isAuthenticated } from "./lib/auth";

export default function Home() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      if (!isAuthenticated()) {
        router.push("/auth"); // Redirect to auth if not logged in
      } else {
        router.push("/dashboard/coupons"); // Redirect to coupons if logged in
      }
    }, 5000); // 5-second delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-green-500 text-white">
      {showAnimation && (
        <motion.h1
          className="text-6xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5 }}
        >
          BOGO Ninja
        </motion.h1>
      )}
    </div>
  );
}
