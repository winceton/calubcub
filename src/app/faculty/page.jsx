import React from "react";
import Navbar from '../../Components/Navbar'

const Faculty = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center px-4 py-[6rem]">
      <Navbar logoHidden={true} />
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-4xl font-bold text-[#820000] mb-4">Meet Our Faculty</h2>
        <p className="text-gray-700 mb-8 text-base md:text-lg">
          Our dedicated educators are the heart of CNHS.
        </p>
        <div className="rounded-2xl shadow-xl mx-auto w-full max-w-4xl">
          <img
            src="../../faculties/faculty-1.jpg"
            alt="Faculty"
            className="w-full mx-auto h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Faculty;
