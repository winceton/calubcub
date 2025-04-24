"use client";
import React, { useState, useEffect } from "react"
import supabase from "../../../../lib/supabaseClient"
import NavbarAdmin from "../../../../../Components/NavbarAdmin"
import { useRouter, useParams } from "next/navigation"
import { IoPersonCircleSharp as DefaultPic } from "react-icons/io5"
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"

const ViewTeacher = () => {
  const router = useRouter();
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);

  const fetchTeacher = async (teacherId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*, section(*)")
        .eq("id", teacherId)
        .single();

      if (error) {
        console.error("Error fetching teacher:", error.message);
        return;
      }

      setTeacher(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  useEffect(() => {

    if (id) {
      fetchTeacher(id);
    }
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <NavbarAdmin route="admin" routeName1="teachers" routeName2="View" />

      {teacher ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-3xl font-bold text-[#820000] mb-6 text-center">
              Teacher Information
            </h2>
            {teacher.profile_picture ? (
              <img
                src={`${teacher.profile_picture}?t=${new Date().getTime()}`}
                alt="Profile"
                className="w-40 h-40 object-cover rounded-full border-4 border-[#820000]"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center rounded-full bg-gray-200">
                <DefaultPic className="text-[10rem] text-gray-400" />
              </div>
            )}

            <div className="text-center">
              <p className="text-lg font-semibold text-[#820000]">
                {teacher.first_name} {teacher.last_name}
              </p>
              <p className="text-gray-600">{teacher.email}</p>
              <p className="text-gray-600">Grade {teacher.section[0].class_id} {teacher.section[0].section_name}</p>
            </div>

            <button
              onClick={() => router.push(`edit/${id}`)}
              className="mt-4 px-6 py-2 bg-[#820000] text-white font-semibold rounded-lg hover:bg-[#660000] transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-40'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loader className='loading-circle text-6xl text-[#d62b2b] z-50' />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTeacher
