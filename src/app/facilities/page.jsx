'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import supabase from '../../app/lib/supabaseClient';

// ------------ helper : fetch { Facilities: [...], Laboratory: [...], Rooms: [...] }
async function fetchAboutUsImages() {
  const bucket = supabase.storage.from('aboutus');

  async function list(prefix) {
    const { data: files, error } = await bucket.list(`${prefix}/`);
    if (error) {
      console.error(`List error for ${prefix}:`, error);
      return [];
    }
    return files.map((f) => {
      const { data: { publicUrl } } = bucket.getPublicUrl(`${prefix}/${f.name}`);
      return { name: f.name, url: publicUrl };
    });
  }

  const [fac, lab, room] = await Promise.all([
    list('Facilities'),
    list('Laboratory'),
    list('Rooms'),
  ]);

  return { Facilities: fac, Laboratory: lab, Rooms: room };
}

// ------------ component ------------
const categories = ['Facilities', 'Laboratory', 'Rooms'];

export default function Facilities() {
  const [selectedCategory, setSelectedCategory] = useState('Facilities');
  const [imagesByCat, setImagesByCat] = useState({
    Facilities: [],
    Laboratory: [],
    Rooms: [],
  });
  const [isFading, setIsFading] = useState(false);

  /* initial load */
  useEffect(() => {
    (async () => {
      const grouped = await fetchAboutUsImages();
      setImagesByCat(grouped);
    })();
  }, []);

  /* fade transition when switching category */
  useEffect(() => {
    setIsFading(true);
    const t = setTimeout(() => setIsFading(false), 300);
    return () => clearTimeout(t);
  }, [selectedCategory]);

  const images = imagesByCat[selectedCategory];

  function prettify(name) {
    // keep after first dash, then strip extension
    const afterDash = name.includes('-') ? name.split('-').slice(1).join('-') : name;
    return afterDash.replace(/\.[^/.]+$/, ''); // remove .png / .jpg …
  }

  return (
    <div className="min-h-[101vh] flex flex-col items-center justify-center bg-[#820000] text-white p-6 pt-[5rem]">
      {/* Navbar */}
      <Navbar logoHidden />

      <div className="max-w-5xl w-full bg-white text-gray-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#820000]">
          Our School {selectedCategory}
        </h1>

        {/* Category buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#820000] text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div
          className={`grid md:grid-cols-2 gap-6 transition-opacity duration-300 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {images.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No images uploaded for {selectedCategory}.
            </p>
          ) : (
            images.map(({ name, url }) => (
              <div key={url} className="flex flex-col">
                <img
                  src={url}
                  alt={name}
                  className="w-full h-64 object-contain rounded-lg shadow-md bg-gray-100"
                />
                <p className="text-center mt-2 text-[#820000] font-semibold truncate">
                  {prettify(name)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
