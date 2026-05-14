"use client";
import { useState, useEffect } from "react";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import Image from "next/image";
import { motion } from "framer-motion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const [showAd, setShowAd] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState(2 * 24 * 60 * 60); // 2 days in seconds

  useEffect(() => {
    // First show preloader for 1s, then show welcome ad
    const timer = setTimeout(() => {
      setLoading(false);
      setShowAd(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!showAd) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showAd]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {loading ? (
  <PreLoader />
) : showAd ? (
  // ================= WELCOME AD =================
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
    >
      <div className="grid md:grid-cols-2 items-center">
        
        {/* LEFT SIDE IMAGE */}
        <div className="flex items-center justify-center bg-sky-50 p-6">
          <Image
            src="/images/welcome.jpg"
            alt="Limited Offer iPhone"
            width={350}
            height={350}
            className="object-contain w-[180px] md:w-[250px] h-auto"
          />
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="p-6 md:p-10 text-center md:text-left">
          
          {/* LOGO */}
          <div className="mb-4 flex justify-center md:justify-start">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="h-auto w-[90px] md:w-[120px]"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-pacific mb-4">
            Limited Offer!
          </h1>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Get exclusive discounts on Nexcell gadgets.
            Hurry — offer ends soon!
          </p>

          <div className="text-xl md:text-2xl font-bold text-red-600 mt-6">
            Offer ends in: {formatTime(timeLeft)}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAd(false)}
            className="mt-8 bg-pacific text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all w-full md:w-auto"
          >
            Continue to Shop
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.div>
) : (
    // ================= MAIN LAYOUT =================
          <>
            <ReduxProvider>
              <CartModalProvider>
                <ModalProvider>
                  <PreviewSliderProvider>
                    <Header />
                    {children}
                    <QuickViewModal />
                    <CartSidebarModal />
                    <PreviewSliderModal />
                  </PreviewSliderProvider>
                </ModalProvider>
              </CartModalProvider>
            </ReduxProvider>
            
            <ScrollToTop />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
