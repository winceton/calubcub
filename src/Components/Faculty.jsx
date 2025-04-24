import React from "react";

const Faculty = () => {
  return (
    <div className="py-20 px-6 bg-gray-100 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-[#820000] mb-6">Meet Our Faculty</h2>
        <p className="text-gray-700 mb-10">Our dedicated educators are the heart of CNHS.</p>
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <img
            src="../../faculties/faculty-1.jpg"
            alt="Faculty"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Faculty;
