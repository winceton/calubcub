'use client'

import React, { useState, useEffect } from 'react'

const AboutUs = () => {
  // Image slide effect
  const images = [
    '../../img/school-logo.png',
    '../../img/jhs-logo.png'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 400); // Match this with animation duration
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <div className="relative px-6 py-20 bg-gradient-to-br from-white to-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:flex md:justify-center items-center">
        <div>
          <h1 className="text-4xl font-bold leading-tight mb-6 text-center md:text-left">Welcome to Calubcub 1.0 National High School</h1>
          <p className="text-lg leading-relaxed text-gray-800 text-center md:text-left">
            Located in the Southern part of San Juan, Batangas, Calubcub 1.0 National High School was founded in 1998
            through the initiative of the local government and community stakeholders. With years of growth, CNHS now
            stands proud with numerous achievements, a growing student body, and a strong alumni network.
          </p>
        </div>
        <div className="">
          <img
            src={images[currentImageIndex]}
            alt="School Logo"
            className={`slider-image ${fade ? 'fade-in' : 'fade-out'} mx-auto w-[10rem] lg:w-[60rem] h-60 object-contain drop-shadow-xl`}
          />
        </div>
      </div>
    </div>
  )
}

export default AboutUs