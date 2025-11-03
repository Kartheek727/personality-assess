// src/components/(Home)/Header/MobileNav.tsx
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";

// Define the banner type
interface Banner {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}

// Sample data (static for now)
const banners: Banner[] = [
  {
    id: 1,
    imageUrl: "/banner1.jpg",
    title: "Empowering Growth",
    description: "Discover Your Potential",
  },
  {
    id: 2,
    imageUrl: "/banner2.jpg",
    title: "Strategic Insights",
    description: "Navigate Your Path Forward",
  },
  {
    id: 3,
    imageUrl: "/banner3.jpg",
    title: "Transformative Learning",
    description: "Elevate Your Performance",
  },
];

const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  // Variants for animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (custom: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: custom * 0.2,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  };

  // Indicator dots
  const Indicators = () => {
    return (
      <div className="flex justify-center space-x-2 mt-4 absolute bottom-8 left-0 right-0">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-3 w-3 rounded-full ${
              index === currentIndex ? "bg-[#f47528]" : "bg-[#1a62a4]/40"
            } hover:bg-[#fc9054] transition-all duration-300`}
          />
        ))}
      </div>
    );
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Navigation arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full text-[#1a62a4] hover:text-[#f47528] transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ArrowBackIos />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full text-[#1a62a4] hover:text-[#f47528] transition-colors duration-300"
        aria-label="Next slide"
      >
        <ArrowForwardIos />
      </button>

      {/* Image and content */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Image with overlay */}
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-700/80 z-10" /> {/* Neutral gray overlay */}
            <div className="relative w-full h-full">
              <Image
                src={currentBanner.imageUrl}
                alt={currentBanner.title}
                fill
                priority
                sizes="100vw"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl">
                <motion.div
                  custom={0}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-2"
                >
                  <div className="w-20 h-1 bg-[#f47528] mx-auto mb-4" /> {/* Orange highlight bar */}
                  <Typography
                    variant="h4"
                    className="text-white font-light mb-2"
                  >
                    {currentBanner.description}
                  </Typography>
                </motion.div>

                <motion.div
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Typography
                    variant="h2"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a62a4] to-[#f47528] font-bold mb-6" /* Blue to orange gradient */
                  >
                    {currentBanner.title}
                  </Typography>
                </motion.div>

                <motion.div
                  custom={2}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-8"
                >
                  <motion.div
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link href="/inner-mind-map" passHref>
                      <div className="inline-block relative overflow-hidden py-3 px-8 rounded-full bg-[#1a62a4] hover:bg-[#f47528] text-white font-medium text-lg cursor-pointer group transition-colors duration-300">
                        <span className="block transition-transform duration-300 transform group-hover:scale-105">
                          Take Assessment
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicators */}
      <Indicators />
    </div>
  );
};

export default HeroCarousel;