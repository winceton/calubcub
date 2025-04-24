import React from 'react';

import { FaChalkboardTeacher, FaBookOpen, FaUserGraduate } from 'react-icons/fa';

const ServicesPage = () => {
  return (
    <div className="bg-white py-20 px-6 relative">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#820000] mb-6">Our Services</h2>
        <p className="text-gray-700 max-w-2xl mx-auto mb-12">
          We're committed to nurturing not just students' academic growth, but their personal development too.
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaBookOpen className="text-[#820000] text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Tutoring Services</h3>
            <p className="text-gray-600">
              One-on-one and group tutoring to help students excel across subjects.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaUserGraduate className="text-[#820000] text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Career Guidance</h3>
            <p className="text-gray-600">
              Support in planning your academic path, career goals, and college prep.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <FaChalkboardTeacher className="text-[#820000] text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Extracurriculars</h3>
            <p className="text-gray-600">
              Clubs, sports, and activities that help you grow outside the classroom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
