'use client'

import React, { useRef, useEffect, useState } from 'react';

import { FaCalendarAlt, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import Navbar from '../../Components/Navbar'
import supabase from '../../app/lib/supabaseClient'

const News = () => {
  const [selectedArticle, setSelectedArticle] = React.useState(null);

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [articles, setArticles] = useState([])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth / 1.5;

      if (direction === "left") {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // Sample articles  
  // const articles = [
  //   {
  //     title: 'Calubcub 1st High School Embraces',
  //     date: 'February 18, 2025',
  //     author: 'Admin',
  //     image: '../../img/rooms/3.png',
  //     summary: 'Calubcub 1st High School is set to revolutionize its academic and administrative processes by implementing a School Information Management System. This initiative aims to enhance communication, streamline tasks, and improve the overall educational experience.'
  //   },
  // ];

  useEffect(() => {
    let channel

    const fetchNews = async () => {
      const { data: news, error } = await supabase
        .from('news')
        .select('author(first_name, last_name), title, date, image, summary, type')
        .eq("isDeleted", false)

      if (error) {
        console.error('Error fetching news:', error)
      } else {
        setArticles(news)
      }
    }

    fetchNews()

    channel = supabase
      .channel('realtime_news')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        () => fetchNews()
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  // Sort articles by date descending
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <main className="min-h-screen bg-white flex flex-col text-[#820000] mt-[2rem]">
      <Navbar logoHidden={true} />

      <section className="py-12 md:mt-4 lg:mt-8">
        <div className="container mx-auto px-6 sm:px-12 xl:px-4 max-w-7xl">
          <h2 className="text-2xl md:text-3xl xl:text-4xl font-bold mb-8 text-center text-[#820000]">Latest News</h2>
          <div className="relative">
            {canScrollLeft && (
              <button onClick={() => scroll("left")} className="absolute -left-6 lg:-left-10 top-1/2 transform -translate-y-1/2 bg-[#820000] text-white p-3 rounded-full shadow-lg hover:bg-[#a30000] transition z-10">
                <FaChevronLeft className='text-sm md:text-2xl' />
              </button>
            )}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="overflow-x-auto no-scrollbar"
            >
              <div className="grid grid-flow-col auto-cols-max lg:grid-rows-2 gap-6 min-w-full px-1"
                style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
                {sortedArticles.map((article, index) => (
                  <div
                    key={index}
                    className="bg-[#fbfbfb] text-[#820000] rounded-2xl shadow-md overflow-hidden relative w-[10rem] md:w-[15rem] lg:w-[18rem] xl:w-80 scroll-snap-align-start"
                  >
                    {/* Tag */}
                    <div className="absolute top-2 right-2 bg-teal-500 text-white text-[0.65rem] md:text-xs font-semibold px-2 py-1 rounded">
                      {article.type === 'news' ? 'News' : 'Event'}
                    </div>

                    <img src={article.image} alt="news" className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="text-base md:text-lg font-semibold mb-2 truncate">{article.title}</h3>
                      <div className="text-xs md:text-sm text-[#8d4c4c] flex items-center gap-4 mb-4">
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {article.date}</span>
                        <span className="flex items-center gap-1"><FaUser /> {article.author?.first_name}</span>
                      </div>
                      <p className="mb-4 text-xs md:text-sm text-[#5a2d2d]">
                        {article.summary.length > 60 ? article.summary.substring(0, 60) + "..." : article.summary}
                      </p>
                      <button onClick={() => setSelectedArticle(article)} className="bg-[#820000] text-white px-3 py-1.5 rounded-xl hover:bg-[#a30000] transition absolute bottom-4 right-4 text-xs lg:text-sm">
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {canScrollRight && (
              <button onClick={() => scroll("right")} className="absolute -right-6 lg:-right-10 top-1/2 transform -translate-y-1/2 bg-[#820000] text-white p-3 rounded-full shadow-lg hover:bg-[#a30000] transition z-10">
                <FaChevronRight className='text-sm md:text-2xl' />
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#820000] text-white text-xs md:text-sm py-4 text-center mt-auto">
        © 2025 Calubcub 1st High School. All rights reserved.
      </footer>

      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 md:p-8 rounded-xl max-w-2xl w-full">
            <h3 className="text-xl md:text-2xl font-semibold mb-2">{selectedArticle.title}</h3>
            <div className="text-sm text-gray-600 flex items-center gap-4 mb-4">
              <span className="flex items-center gap-1">
                <FaCalendarAlt />
                {selectedArticle.date}
              </span>
              <span className="flex items-center gap-1">
                <FaUser />
                {selectedArticle.author?.first_name}
              </span>
              <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded font-semibold ml-2">
                {selectedArticle.type === 'news' ? 'News' : 'Event'}
              </span>
            </div>
            <p className="mb-4 text-[#333]">{selectedArticle.summary}</p>
            <button onClick={() => setSelectedArticle(null)} className="bg-[#820000] text-white px-4 py-2 rounded-xl hover:bg-[#a30000] transition">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default News;