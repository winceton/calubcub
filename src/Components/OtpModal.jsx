'use client'

import React, { useRef, useState, useEffect } from 'react'
import supabase from '../app/lib/supabaseClient'
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"

const OTPModal = ({ email, schoolId, onVerified }) => {
    const inputsRef = useRef([])
    const [otpError, setOtpError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(100) // 10 minutes in seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true)

    // Start countdown timer when the component is mounted
    useEffect(() => {
        if (resendTimer === 0) return

        const timerInterval = setInterval(() => {
            setResendTimer((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerInterval)
                    setIsResendDisabled(false)
                    return 0
                }
                return prevTime - 1
            })
        }, 1000)

        return () => clearInterval(timerInterval) // Clear interval on component unmount
    }, [resendTimer])

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, '')
        if (!value) return

        e.target.value = value[0]

        if (index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus()
        }

        const filledCode = inputsRef.current.map((input) => input.value).join('')
        if (filledCode.length === 6) {
            handleSubmit(new Event('submit'))
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const paste = e.clipboardData.getData('text').trim().slice(0, 6).replace(/\D/g, '')
        paste.split('').forEach((char, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i].value = char
            }
        })
        if (paste.length === 6) {
            setTimeout(() => handleSubmit(new Event('submit')), 100) // slight delay to ensure inputs are populated
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (loading) return

        const code = inputsRef.current.map((input) => input.value).join('')
        if (code.length !== 6) {
            setOtpError('Please enter the full 6-digit code')
            return
        }

        setLoading(true)
        const now = new Date().toISOString()

        const { data, error } = await supabase
            .from('email_otps')
            .select('*')
            .eq('school_id', schoolId)
            .eq('code', code)
            .gt('expires_at', now)
            .order('expires_at', { ascending: false })
            .limit(1)
            .single()

        if (error || !data) {
            setOtpError('Invalid or expired code')
            setLoading(false)
            return
        }

        // Optionally: delete used OTP
        await supabase.from('email_otps').delete().eq('school_id', schoolId)

        setOtpError(null)
        setLoading(false)
        onVerified()
    }

    const handleResendOtp = async () => {
        await supabase.from('email_otps').delete().eq('school_id', schoolId)

        setResendTimer(600)
        setIsResendDisabled(true)

        const otp = Math.floor(100000 + Math.random() * 900000).toString();  // Generate 6-digit OTP
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // OTP expires in 10 minutes

        // Store OTP in the database
        const { error: otpError } = await supabase.from('email_otps').insert({
            school_id: schoolId,
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
                email: email,
                code: otp,
            }),
        })
    }

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60)
        const seconds = timeInSeconds % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 rounded-xl shadow-lg p-6 flex flex-col items-center gap-6 z-50 border border-white/20 text-white w-[90%] max-w-sm"
        >
            <div className="text-center">
                <p className="text-sm opacity-80">OTP sent to {email}</p>
                <h2 className="text-lg font-semibold mt-1">Enter OTP</h2>
            </div>

            <div className="flex gap-3" onPaste={handlePaste}>
                {[...Array(6)].map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        ref={(el) => (inputsRef.current[i] = el)}
                        onChange={(e) => handleChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="w-12 h-12 text-center text-xl font-medium bg-white/10 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60 text-white"
                    />
                ))}
            </div>

            {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-500"
                >
                    Resend OTP
                </button>
                <p className="text-sm text-white mt-2">
                    {isResendDisabled ? `You can resend OTP in ${formatTime(resendTimer)}` : 'You can resend OTP now'}
                </p>
            </div>

            {loading && (<div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-[100]'>
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100]'>
                    <Loader className='loading-circle text-6xl text-[#d62b2b] z-[100]' />
                </div>
            </div>)}
        </form>
    )
}

export default OTPModal
