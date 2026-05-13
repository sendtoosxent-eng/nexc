"use client";

import {
  MessageCircle,
  Phone,
  MapPin,
} from "lucide-react";

export default function Whatsapp() {
  
  const whatsappNumber = "256740442029";

  const message = encodeURIComponent(
    "Hello can i know more about your latest iphones and their prices?"
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      {/* SMALLER CONTAINER */}
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-sky-100 shadow-xl rounded-full px-3 py-2">
        
        {/* WHATSAPP */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-[#25D366] hover:scale-105 transition-all duration-300 shadow-lg"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="text-white w-5 h-5" />

          {/* TOOLTIP */}
          <span className="absolute bottom-14 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
            WhatsApp
          </span>
        </a>

        {/* CALL */}
        <a
          href="tel:+256740442029"
          className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-sky-500 hover:bg-sky-600 hover:scale-105 transition-all duration-300 shadow-lg"
          aria-label="Call us"
        >
          <Phone className="text-blue w-4 h-4" />

          {/* TOOLTIP */}
          <span className="absolute bottom-14 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
            Call
          </span>
        </a>

        {/* LOCATION */}
        <a
          href="https://maps.google.com/?q=Pioneer+Mall+Kampala"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-black hover:bg-gray-900 hover:scale-105 transition-all duration-300 shadow-lg border border-sky-400"
          aria-label="Find our location"
        >
          <MapPin className="text-sky-400 w-4 h-4" />

          {/* TOOLTIP */}
          <span className="absolute bottom-14 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
            Location
          </span>
        </a>
      </div>
    </div>
  );
}