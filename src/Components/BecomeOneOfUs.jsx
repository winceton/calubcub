'use client'

import React, { useState } from 'react'

const BecomeOneOfUs = () => {
    const facilities = {
        Facilities: ['../../img/facilities/1.png', '../../img/facilities/2.png', '../../img/facilities/3.png', '../../img/facilities/4.png', '../../img/facilities/5.png', '../../img/facilities/6.png', '../../img/facilities/7.png', '../../img/facilities/8.png', '../../img/facilities/9.png', '../../img/facilities/10.png'],
        Laboratory: ['../../img/laboratory/1.png', '../../img/laboratory/2.png', '../../img/laboratory/3.png', '../../img/laboratory/4.png', '../../img/laboratory/5.png', '../../img/laboratory/6.png'],
        Rooms: ['../../img/rooms/1.png', '../../img/rooms/2.png', '../../img/rooms/3.png', '../../img/rooms/4.png', '../../img/rooms/5.png', '../../img/rooms/6.png', '../../img/rooms/7.png', '../../img/rooms/8.png', '../../img/rooms/9.png', '../../img/rooms/10.png', '../../img/rooms/11.png', '../../img/rooms/12.png', '../../img/rooms/13.png'],
    };

    const [activeCategory, setActiveCategory] = useState('Facilities');
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = facilities[activeCategory];

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="bg-[#820000] text-white py-20 px-6 text-center relative" >
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Be a Calubcubian!</h2>
                <p className="text-xl mb-8">Learners Today, Leaders Tomorrow</p>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-md text-left">
                    <h3 className="text-2xl font-semibold mb-4 text-white text-center">Application Requirements</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="font-semibold mb-2">Junior High School (JHS)</p>
                            <ul className="list-disc list-inside text-white/90">
                                <li>Elementary Card</li>
                                <li>Birth Certificate</li>
                                <li>Numeracy & Literacy Test</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Transfer Applicants</p>
                            <ul className="list-disc list-inside text-white/90">
                                <li>Card from Previous School</li>
                                <li>Birth Certificate</li>
                                <li>Form 137</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel */}
            {/* <div className="mt-16">
                <h3 className="text-2xl font-bold mb-4">Explore Our Campus Facilities</h3>
                <div className="flex justify-center gap-4 mb-6">
                    {Object.keys(facilities).map((category) => (
                        <button
                            key={category}
                            onClick={() => { setActiveCategory(category); setCurrentIndex(0); }}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === category ? 'bg-white text-[#820000]' : 'bg-white/30 text-white hover:bg-white/40'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <div className="relative max-w-xl mx-auto">
                    <img
                        src={images[currentIndex]}
                        alt={`${activeCategory} ${currentIndex + 1}`}
                        className="rounded-xl w-full h-72 object-cover shadow-lg"
                    />
                    <button onClick={handlePrev} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black text-[#820000] px-4 py-2 rounded-xl">◀</button>
                    <button onClick={handleNext} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black text-[#820000] px-4 py-2 rounded-xl">▶</button>
                </div>
            </div> */}
        </div>
    )
}

export default BecomeOneOfUs