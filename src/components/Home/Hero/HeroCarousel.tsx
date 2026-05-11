"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "Tech For The Next Generation",
    subtitle: "SMART TECH",
    discount: "30%",
    description:
      "Experience premium gadgets, powerful devices, and futuristic technology designed for your modern lifestyle.",
    image: "/images/hero/plug-hero-tech.png",
  },
  {
    id: 2,
    title: "iPhone 16 Pro Max",
    subtitle: "APPLE SERIES",
    discount: "25%",
    description:
      "A perfect blend of luxury, performance, and innovation built for creators, professionals, and everyday users.",
    image: "/images/iphone-hand.png",
  },
  {
    id: 3,
    title: "Premium Sound Experience",
    subtitle: "AUDIO COLLECTION",
    discount: "40%",
    description:
      "Immerse yourself in crystal-clear sound with premium headphones and next-level audio technology.",
    image: "/images/hero/sounds.png",
  },
];

const HeroCarousal = () => {
  return (
    <div className="w-full overflow-hidden rounded-3xl bg-black shadow-2xl">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="hero-carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"></div>

              <div className="relative z-10 flex flex-col-reverse items-center justify-between gap-10 px-6 py-12 sm:px-10 lg:flex-row lg:px-20 lg:py-16">
                {/* Left Content */}
                <div className="max-w-xl text-center lg:text-left">
                  {/* Tag */}
                  <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-sky-400/30 bg-sky-400/10 px-5 py-2">
                    <span className="text-3xl font-extrabold text-sky-400">
                      {slide.discount}
                    </span>

                    <span className="text-sm uppercase tracking-widest text-blue/80">
                      Special Offer
                    </span>
                  </div>

                  {/* Subtitle */}
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
                    {slide.subtitle}
                  </p>

                  {/* Title */}
                  <h1 className="mb-6 text-4xl font-black leading-tight text-blue sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mb-8 max-w-lg text-base leading-8 text-gray-300">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                    <a
                      href="#"
                      className="rounded-xl bg-blue px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-sky-300"
                    >
                      Shop Now
                    </a>

                    <a
                      href="/signin"
                      className="rounded-xl border border-sky-400/40 bg-white/5 px-8 py-4 text-sm font-semibold text-blue backdrop-blur-sm transition duration-300 hover:bg-sky-400 hover:text-black"
                    >
                      Explore More
                    </a>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative flex items-center justify-center">
                  {/* Glow */}
                  <div className="absolute h-80 w-80 rounded-full bg-sky-400/20 blur-3xl"></div>

                  <Image
                    src={slide.image}
                    alt={slide.title}
                    width={500}
                    height={500}
                    className="relative z-10 object-contain drop-shadow-[0_20px_40px_rgba(56,189,248,0.45)] transition duration-500 hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Swiper Pagination */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #7dd3fc;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          width: 30px;
          border-radius: 999px;
          opacity: 1;
          background: #38bdf8;
        }
      `}</style>
    </div>
  );
};

export default HeroCarousal;