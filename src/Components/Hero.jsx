'use client'

import React, { useEffect } from 'react'
import SeniorHighStrands from './SeniorHighStrands';

const Hero = () => {
  useEffect(() => {
    const video = document.querySelector('video');
    if (video) {
      video.load(); // Reloads the video
      video.play().catch(() => console.log('Autoplay Error'));
    }
  }, []);

  return (
    <>
      <div className='h-screen overflow-hidden'>    
          {/* Content */}
          <video autoPlay loop muted className='-z-10 h-full w-full object-cover'>
            <source src='videos/calubcub-video.mp4' type='video/mp4'/>
          </video>
      </div>
      <SeniorHighStrands />
    </>
  )
}

export default Hero