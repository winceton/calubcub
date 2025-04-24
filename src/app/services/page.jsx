import React from 'react';

import Navbar from "../../Components/Navbar";
import { FaChalkboardTeacher, FaBookOpen, FaUserGraduate } from 'react-icons/fa';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-[#820000] flex items-center py-20 px-6 text-white">
      <Navbar logoHidden={true} />
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Our Services</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-16 text-base md:text-lg">
          We're committed to nurturing not just students' academic growth, but their personal development too.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-white text-[#820000] rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
            <FaBookOpen className="text-[#820000] text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-3 text-center">Tutoring Services</h3>
            <p className="text-sm text-center text-gray-700">
              One-on-one and group tutoring to help students excel across subjects.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white text-[#820000] rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
            <FaUserGraduate className="text-[#820000] text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-3 text-center">Career Guidance</h3>
            <p className="text-sm text-center text-gray-700">
              Support in planning your academic path, career goals, and college prep.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white text-[#820000] rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all">
            <FaChalkboardTeacher className="text-[#820000] text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-3 text-center">Extracurriculars</h3>
            <p className="text-sm text-center text-gray-700">
              Clubs, sports, and activities that help you grow outside the classroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
