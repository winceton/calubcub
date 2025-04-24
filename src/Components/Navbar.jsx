'use client'

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import bcrypt from 'bcryptjs'
import supabase from '../app/lib/supabaseClient'
import Link from "next/link";

import { GiHamburgerMenu as Hamburger } from "react-icons/gi";
import { IoMdClose as Close } from "react-icons/io";
import { FaArrowRightLong as ArrowRight } from "react-icons/fa6";
import { CiLogin as Login } from "react-icons/ci";
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"
import OtpModal from "./OtpModal";

const Navbar = ({ logoHidden }) => {
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

  const loginButton = () => {
    setLoginForm(!loginForm)
    setListDisplay(!listDisplay)
  }

  const [listDisplay, setListDisplay] = useState(false)

  const [loginForm, setLoginForm] = useState(false)

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loginError, setLoginError] = useState(false)

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [otpSent, setOtpSent] = useState(false)
  const [userData, setUserData] = useState(null)

  const truelogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    let { data: user, error } = await supabase
      .from('users')
      .select('id, school_id, hashed_password, role, section(*)')
      .eq('email', loginIdentifier)
      .single()

    if (error || !user) {
      setLoginError(true)
      setLoginPassword('')
      setLoading(false)
      return
    }

    const match = await bcrypt.compare(loginPassword, user.hashed_password)
    if (!match) {
      setLoading(false)
      setLoginError(true)
      setLoginPassword('')
      return
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: otpError } = await supabase.from('email_otps').insert({
      school_id: user.school_id,
      code: otp,
      expires_at: expiresAt,
    });

    if (otpError) {
      console.error('Error saving OTP:', otpError);
      setLoading(false);
      setLoginError(true);
      return;
    }

    await fetch('/accountManagement/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginIdentifier,
        code: otp,
      }),
    })

    setUserData(user)
    setOtpSent(true)
    setLoading(false)
  }

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)

    let { data: user, error } = await supabase
      .from('users')
      .select('id, hashed_password, role, section(*)')
      .eq('email', loginIdentifier)
      .single()

    if (error || !user) {
      setLoginError(true)
      setLoading(false)
      setLoginPassword('')
      return
    }

    const match = await bcrypt.compare(loginPassword, user.hashed_password)
    if (!match) {
      setLoading(false)
      setLoginError(true)
      setLoginPassword('')
      return
    }

    localStorage.setItem('user_id', user.id)
    localStorage.setItem('role', user.role)

    if (user.role === 'admin') {
      router.replace('/admin/profile')
    } else if (user.role === 'teacher') {
      localStorage.setItem('section', JSON.stringify(user.section[0] || {}))
      router.replace('/teacher/profile')
    } else if (user.role === 'officer') {
      router.replace('/officer/profile')
    } else {
      setLoading(false)
      setLoginError(true)
      setLoginPassword('')
    }
  }

  return (
    <div className="relative">
      <div className='fixed bottom-0 md:top-0 md:bottom-auto left-0 right-0 flex items-center justify-around z-20 text-black font-semibold shadow-md drop-shadow-md bg-[#820000] md:bg-[#FAF9F6] p-2 md:p-3 lg:p-2 rounded-t-lg md:rounded-t-none md:border-t-0 border-t-2 border-yellow-400'>
        <div className="hidden md:flex gap-2 items-center">
          <img src={images[currentImageIndex]} alt="calubcub-logo" className={`slider-image ${fade ? 'fade-in' : 'fade-out'} drop-shadow-lg hidden lg:flex lg:w-[3.5rem] select-none z-50`} />
          <img src='../../img/calubcub-text-navbar.png' alt="calubcub-text-navbar" className="h-[2rem]" />
        </div>
        <div className="flex gap-3 md:gap-5 items-center text-xs lg:text-sm text-white md:text-gray-950 select-none relative">
          <Link href='/' className="hover:text-yellow-300 md:hover:text-[#820000] transition-all">
            HOME
          </Link>

          {/* ABOUT US with dropdown */}
          <div className="relative group">
            <button className="hover:text-yellow-300 md:hover:text-[#820000] transition-all">
              ABOUT US
            </button>

            {/* Dropdown */}
            <div className="absolute left-0 mt-2 w-40 bg-white text-gray-800 shadow-md rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-10"
              onMouseEnter={(e) => e.currentTarget.classList.add("opacity-100", "visible")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("opacity-100", "visible")}>
              <Link
                href="/about-us"
                className="block px-4 py-2 hover:bg-gray-100 hover:text-[#820000] transition-colors"
              >
                School
              </Link>
              <Link
                href="/facilities"
                className="block px-4 py-2 hover:bg-gray-100 hover:text-[#820000] transition-colors"
              >
                Facilities
              </Link>
              <Link
                href="/faculty"
                className="block px-4 py-2 hover:bg-gray-100 hover:text-[#820000] transition-colors"
              >
                Faculty
              </Link>
              <Link
                href="/services"
                className="block px-4 py-2 hover:bg-gray-100 hover:text-[#820000] transition-colors"
              >
                Services
              </Link>
            </div>
          </div>

          <Link href='/news' className="hover:text-yellow-300 md:hover:text-[#820000] transition-all">
            NEWS
          </Link>
          <Link href='/contacts' className="hover:text-yellow-300 md:hover:text-[#820000] transition-all">
            CONTACTS
          </Link>
        </div>

      </div>
      <div className="fixed top-0 right-0 z-50 p-2 sm:p-3 md:p-4 lg:p-5 bg-[#820000] text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer text-white hover:bg-[#922020] transition-all" onClick={() => setListDisplay(!listDisplay)}>
        {listDisplay ? (
          <Close />
        ) : (
          <Hamburger />
        )}
      </div>

      {loading && (<div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-[100]'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
          <Loader className='loading-circle text-6xl text-[#d62b2b] z-[100]' />
        </div>
      </div>)}

      {/* List Display */}
      <div className={`${listDisplay ? 'slideInLeft opacity-100' : 'slideInRight opacity-0 duration-[1000ms]'} fixed top-0 right-0 min-w-[45vmin] sm:min-w-[20vmin] md:min-w-[25vmin] lg:min-w-[30vmin] flex flex-col bg-white p-1 sm:p-2 md:p-3 lg:p-4 rounded-bl-lg z-10 border-[#820000] border-t-[2.2rem] sm:border-t-[2.8rem] md:border-t-[4.5rem] lg:border-t-[4.5rem] shadow-left`}>
        <div className="text-black" onClick={() => loginButton()}>
          <div className="flex justify-between items-center py-2 lg:py-2 hover:text-[#820000] hover:font-semibold cursor-pointer transition-all text-sm md:text-base">
            <div className="select-none">
              Login
            </div>
            <Login />
          </div>
        </div>
      </div>

      {/* Login Form */}
      {loginForm ? (
        <>
          <form
            onSubmit={truelogin}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-5 sm:p-8 md:p-10 flex flex-col items-center z-20 border border-white/20"
          >
            {/* Close Button */}
            <Close
              className="absolute top-3 right-3 text-3xl text-white bg-gray-700 bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 cursor-pointer transition-all"
              onClick={() => setLoginForm(false)}
            />

            {/* School Logo */}
            <img
              src={images[currentImageIndex]}
              alt="school logo"
              className={`slider-image ${fade ? 'fade-in' : 'fade-out'} w-16 sm:w-28 mb-4 sm:mb-6`}
            />

            {/* Input Fields */}
            <div className="w-full">
              <input
                type="text"
                placeholder="ID"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-black bg-opacity-30 text-white placeholder-gray-300"
              />

              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-black bg-opacity-30 text-white placeholder-gray-300"
              />
              {loginError && <p className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded mb-4">Incorrect login credentials</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              {loading ? (
                'Logging in...'
              ) : (
                'Log In'
              )}
            </button>

          </form>
          {otpSent && userData && (
            <OtpModal
              email={loginIdentifier}
              schoolId={userData.school_id}
              onVerified={() => {
                localStorage.setItem('user_id', userData.id)
                localStorage.setItem('role', userData.role)
                if (userData.role === 'admin') {
                  router.replace('/admin/profile')
                } else if (userData.role === 'teacher') {
                  localStorage.setItem('section', JSON.stringify(userData.section[0] || {}))
                  router.replace('/teacher/profile')
                } else if (userData.role === 'officer') {
                  router.replace('/officer/profile')
                }
              }}
            />
          )}
        </>


      ) : (
        logoHidden ? (
          <div />
        ) : (
          <img
            className="select-none absolute w-60 sm:w-80 md:w-[30rem] lg:w-[40rem] xl:w-[50rem] top-[30vmin] sm:top-[20vmin] md:top-[25vmin] xl:top-[20vmin] left-1/2 -translate-x-1/2 -translate-y-1/2 fadeIn"
            src="../../img/calubcob-text.png"
            alt="calubcub-text"
          />
        )
      )}

    </div>
  )
}

export default Navbar