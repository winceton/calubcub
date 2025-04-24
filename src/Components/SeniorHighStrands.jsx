'use client';
import React, { useState, useEffect } from "react";
import { FaAtom, FaBook, FaTools, FaChartLine } from "react-icons/fa";

const strands = [
  {
    name: "STEM",
    description: "Science, Technology, Engineering and Mathematics",
    icon: <FaAtom size={60} className="opacity-40" />,
    bgColor: "bg-blue-500",
    image: "../../img/students/stem-student.png"
  },
  {
    name: "HUMSS",
    description: "Humanities and Social Sciences",
    icon: <FaBook size={60} className="opacity-40" />,
    bgColor: "bg-green-500",
    image: "../../img/students/humss-student.png"
  },
  {
    name: "TVL",
    description: "Technical-Vocational-Livelihood",
    icon: <FaTools size={60} className="opacity-40" />,
    bgColor: "bg-yellow-400",
    image: "../../img/students/tvl-student.png"
  },
  {
    name: "ABM",
    description: "Accountancy, Business and Management",
    icon: <FaChartLine size={60} className="opacity-40" />,
    bgColor: "bg-purple-500",
    image: "../../img/students/abm-student.png"
  },
];

export default function SeniorHighStrands() {
  const [showJuniorHigh, setShowJuniorHigh] = useState(false);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // trigger fade out
      setTimeout(() => {
        setShowJuniorHigh(prev => !prev); // toggle content
        setFade(true); // trigger fade in
      }, 500); // match transition duration
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [perPage, setPerPage] = useState(1); // Default value to avoid error

  useEffect(() => {
    const itemsPerPage = () => {
      if (window.innerWidth >= 1536) return 4;
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 1024) return 2;
      return 1;
    };

    setPerPage(itemsPerPage());

    const handleResize = () => setPerPage(itemsPerPage());
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures it runs only once after component mount

  const maxIndex = Math.max(0, strands.length - perPage);

  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="absolute bottom-6 w-full xl:bg-[#820000]/90 flex flex-col items-center justify-center p-4 text-white">
      <div
        key={showJuniorHigh ? "junior" : "senior"} // triggers re-animation
        className={`w-full max-w-[90%] transition-opacity duration-500 ease-in-out ${fade ? "opacity-100" : "opacity-0"
          }`}
      >
        {showJuniorHigh ? (
          <>
            <h1 className="text-base md:text-xl lg:text-2xl font-bold text-center drop-shadow-lg bg-[#820000]/50 p-1 w-full rounded-xl xl:bg-transparent">
              Junior High School Program
            </h1>
            <div className="bg-[#820000] rounded-2xl shadow-md text-white p-6 mt-4 text-center">
              {/* Mobile Size */}
              <p className="block sm:hidden text-sm leading-snug">
                Calubcub 1st High School offers Grades 7 to 10.
              </p>

              {/* Big Phone or Small Tablet Size */}
              <p className="hidden sm:block md:hidden text-sm leading-snug">
                We offer a full Junior High School curriculum from Grades 7 to 10, building strong academic foundations.
              </p>

              {/* Tablet Size */}
              <p className="hidden md:block lg:hidden text-base leading-relaxed">
                At our school, students in Grades 7 to 10 engage in a curriculum designed to develop their skills and readiness for senior high school.
              </p>

              {/* Laptop Size */}
              <p className="hidden lg:block text-base leading-relaxed">
                At our school, we recognize the importance of a strong academic foundation. That’s why we offer a full Junior High School program covering Grades 7 to 10,
                where students are guided through a dynamic and engaging curriculum designed to enhance their intellectual, emotional, and social development.
              </p>

              {/* Desktop Size */}
              <p className="hidden xl:block text-base leading-relaxed">
                At our school, we recognize the importance of a strong academic foundation.
                That’s why we offer a full Junior High School program covering Grades 7 to 10,
                where students are guided through a dynamic and engaging curriculum designed
                to enhance their intellectual, emotional, and social development.
                Through these formative years, learners are equipped with the tools and confidence
                they need to thrive as they continue their educational journey.
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-base md:text-xl lg:text-2xl font-bold text-center drop-shadow-lg bg-[#820000]/50 p-1 w-full rounded-xl xl:bg-transparent">
              Offered Senior High School Strands
            </h1>

            <div className="relative overflow-hidden mt-4">
              {currentIndex > 0 && (
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 text-3xl px-4 text-white"
                >
                  ❮
                </button>
              )}

              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / perPage)}%)` }}
              >
                {strands.map((strand, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 px-4 py-6 w-full ${perPage === 1
                      ? "sm:w-full"
                      : perPage === 2
                        ? "sm:w-1/2"
                        : perPage === 3
                          ? "md:w-1/3"
                          : "lg:w-1/4"
                      }`}
                  >
                    <div
                      className={`rounded-2xl shadow-xl px-6 py-8 text-white flex justify-between items-center h-20 md:h-20 lg:h-24 xl:h-32 overflow-hidden ${strand.bgColor}`}
                    >
                      <img
                        src={strand.image}
                        alt="strand-student"
                        className="h-32 pr-4"
                      />
                      <div className="text-left pr-4">
                        <h2 className="text-xl font-bold">{strand.name}</h2>
                        <p className="hidden md:block text-sm mt-1 max-w-xs leading-snug">
                          {strand.description}
                        </p>
                      </div>
                      <div className="text-right">{strand.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {currentIndex < maxIndex && (
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 text-3xl px-4 text-white"
                >
                  ❯
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
