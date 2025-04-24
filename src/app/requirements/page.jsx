import React from "react";

import Navbar from '../../Components/Navbar'

const Requirements = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#5d1111]/90 text-white p-6">
      {/* Navbar */}
      <Navbar logoHidden={true} />

      <img src="../../facilities/IMG_2018.JPG" alt="facility-img" className="fixed top-0 left-0 h-full w-full -z-10" />
      <div className="max-w-3xl w-full bg-white text-gray-900 p-16 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#820000]">
          Application Requirements
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-semibold text-[#820000] mb-4">
              Junior High School (JHS)
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Elementary Card</li>
              <li>Birth Certificate</li>
              <li>Undergo Numeracy & Literacy Test</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-[#820000] mb-4">
              Transfer Applicants
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Card from Previous School</li>
              <li>Birth Certificate</li>
              <li>Form 137</li>
            </ul>
          </div>
        </div>
      </div>
      <img src="../../img/school-logo.png" alt="calubcob-logo" className="h-[15rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[.07]" />
    </div>
  );
};

export default Requirements;
