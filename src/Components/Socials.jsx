import React from 'react'
import Link from 'next/link'

import { FaFacebookF as Facebook } from "react-icons/fa";
import { SiGmail as Gmail } from "react-icons/si";

const Socials = () => {
    return (
        <div className='fixed left-0 top-1/3 h-screen'>
            <Link href="https://www.facebook.com/DepEdTayoC1SHS305473" target='_blank' className=''>
                <Facebook className='text-4xl md:text-5xl lg:text-6xl text-[#820000] p-2 md:p-3 lg:p-4 bg-white/50 border border-white hover:bg-white transition-all' />
            </Link>
            <Link href="/contacts" className=''>
                <Gmail className='text-4xl md:text-5xl lg:text-6xl text-[#820000] p-2 md:p-3  lg:p-4 bg-white/50 border border-white hover:bg-white transition-all' />
            </Link>
        </div>
    )
}

export default Socials