'use client'

import React from 'react'

const Modal = () => {
  return (
    <div className='fixed top-0 left-0 h-screen w-screen bg-black/40'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 rounded-xl bg-gray-400'>
            MODAL CONTENT
        </div>
    </div>
  )
}

export default Modal