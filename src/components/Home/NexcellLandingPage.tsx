"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WelcomeAd() {
  const [showAd, setShowAd] = useState(true);
  const [timeLeft, setTimeLeft] = useState(2 * 24 * 60 * 60); // 2 days in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  if (!showAd) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100 flex flex-col items-center justify-center z-[9999]"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-8"
      >
        <Image
          src="/images/iphone-offer.png" // replace with your uploaded image path
          alt="Limited Offer iPhone"
          width={300}
          height={300}
          className="rounded-3xl shadow-2xl"
        />
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-600">
          Limited Offer!
        </h1>
        <p className="text-gray-700 text-lg max-w-md mx-auto">
          Get exclusive discounts on Nexcell gadgets. Hurry — offer ends soon!
        </p>

        <div className="text-2xl font-bold text-sky-500 mt-4">
          Offer ends in: {formatTime(timeLeft)}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAd(false)}
          className="mt-8 bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all"
        >
          Continue to Shop
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
