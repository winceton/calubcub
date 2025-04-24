'use client'
import { useEffect, useState } from 'react'

import Navbar from '../Components/Navbar'

import Hero from '../Components/Hero'
import BecomeOneOfUs from '../Components/BecomeOneOfUs'
import AboutUs from '../Components/AboutUs'
import Footer from '../Components/Footer'
import Socials from '../Components/Socials'

import { useRouter } from 'next/navigation'

import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('role')

    if (userId && userRole) {
      if (userRole === 'admin') router.push('/admin/profile')
      else if (userRole === 'teacher') router.push('/teacher/profile')
    }
  }, [])

  return (
    <div className='relative h-screen'>
      { true ? (
        <>
          {/* Navbar */}
          <Navbar logoHidden={false} />

          {/* Homepage Content */}
          <Hero />
          <Socials />
          {/* <BecomeOneOfUs />
          <AboutUs />
          <Footer /> */}
        </>
      ) : (
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <Loader className='loading-circle text-4xl text-[#820000]' />
        </div>
      )}
    </div>
  );
}
