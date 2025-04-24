'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../../Components/NavbarAdmin'
import { useRouter } from 'next/navigation'
import supabase from '../../lib/supabaseClient'
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai";
import { IoPersonCircleOutline as DefaultPic } from "react-icons/io5";
import { FiMoreVertical as Kebab } from "react-icons/fi";
import { LuView as View } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import GenerateSF9 from '../../../app/forms/SF9'
import GenerateSF9B from '../../../app/forms/SF9-B'
import GenerateSF10JHS from '../../../app/forms/SF10-JHS'
import GenerateSF10SHS from '../../../app/forms/SF10-SHS'
import { AiOutlineFilePdf as ShowPDF } from "react-icons/ai"

const page = () => {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState(null)
  const [openDropdown, setOpenDropdown] = useState(null);

  const [SF9Modal, setSF9Modal] = useState(null)
  const [SF10Modal, setSF10Modal] = useState(null)

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMale, setFilterMale] = useState(false);
  const [filterFemale, setFilterFemale] = useState(false);

  const searchedStudents = students
    .filter((student) =>
      `${student.firstname} ${student.lastname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((student) => {
      if (filterMale && student.sex === "M") return true;
      if (filterFemale && student.sex === "F") return true;
      return !filterMale && !filterFemale; // If no checkbox is selected, show all
    })
    .sort((a, b) => a.lastname.localeCompare(b.lastname));

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const fetchStudents = async () => {
    setLoading(true)
    const section = JSON.parse(localStorage.getItem('section')) || {}

    setSection(section)

    const { data, error } = await supabase
      .from('students')
      .select('*, values(*), section_id(*, adviser(first_name, middle_name, last_name)), jr_student_grades(*, class_id(*)), sr_student_grades(*, subject_id(*))')
      .eq('section_id', section.id)
      .eq('isDeleted', false)

    if (error) {
      console.error('Error fetching students:', error)
      setLoading(false)
    } else {
      setStudents(data)
    }

    setLoading(false)
  }

  useEffect(() => {
    const checkAuthAndFetchStudents = async () => {
      const userId = localStorage.getItem('user_id')
      const userRole = localStorage.getItem('role')

      await fetchStudents()

      const studentchannel = supabase
        .channel('realtime_students')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'students' },
          () => {
            fetchStudents()
          }
        )
        .subscribe()

      const gradeschannel = supabase
        .channel('realtime_students')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'jr_student_grades' },
          () => {
            fetchStudents()
          }
        )
        .subscribe()

      const shsgradeschannel = supabase
        .channel('realtime_students')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sr_student_grades' },
          () => {
            fetchStudents()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(studentchannel)
        supabase.removeChannel(gradeschannel)
        supabase.removeChannel(shsgradeschannel)
      }
    }

    checkAuthAndFetchStudents()

  }, [])

  return (
    <div className="ml-[6rem] mt-[5rem] p-6 bg-white min-h-[90vh] shadow-lg rounded-lg">
      <Navbar route="teacher" routeName1="class" />

      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
          <Loader className="animate-spin text-6xl text-[#820000] z-50" />
        </div>
      ) : (
        <div>
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
            <div className='flex flex-col lg:flex-row items-center gap-6'>
              <h1 className="text-2xl font-bold text-[#820000]">Grade {section?.class_id} {section?.section_name}</h1>
              <div className="flex items-center gap-4 mb-4 border border-gray-300 rounded-lg p-2">
                <FaSearch className="text-gray-500 text-lg" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-2 focus:outline-none"
                />
              </div>
              <div className="mb-4 flex gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterMale(!filterMale)}>
                  <span className="text-[#820000] font-medium select-none">Male</span>
                  <button
                    className="text-xl"
                  >
                    {filterMale ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterFemale(!filterFemale)}>
                  <span className="text-[#820000] font-medium select-none">Female</span>
                  <button
                    className="text-xl"
                  >
                    {filterFemale ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/teacher/class/addStudent")}
              className="bg-[#820000] hover:bg-[#660000] text-white px-5 py-2 rounded-lg shadow-lg drop-shadow-lg transition duration-300"
            >
              Add Student
            </button>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-lg">
            <table className="w-full rounded-lg">
              <thead>
                <tr className="bg-[#820000] text-white text-left">
                  <th className="p-3 pl-6 font-semibold">NAME</th>
                  <th className="p-3 font-semibold">GENDER</th>
                  <th className="p-3 font-semibold">CONTACT NUMBER</th>
                  <th className="p-3 font-semibold">LRN</th>
                  <th className="p-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchedStudents
                  .sort((a, b) => a.lastname.localeCompare(b.lastname))
                  .map((student, index) => (
                    <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                      <td className="p-3 flex items-center">
                        {student.profile_picture ? (
                          <img
                            src={student.profile_picture}
                            alt="Profile"
                            className="w-11 h-11 p-1 rounded-full mr-3 border border-gray-300"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 mr-3">
                            <DefaultPic className="text-3xl" />
                          </div>
                        )}
                        {student.lastname}, {student.firstname}
                      </td>
                      <td className="p-3">{student.sex || "N/A"}</td>
                      <td className="p-3">{student.contactNumber || "N/A"}</td>
                      <td className="p-3">{student.lrn || "N/A"}</td>
                      <td className="p-3 text-center relative">
                        <button
                          onClick={() => toggleDropdown(student.id)}
                          className="p-2 rounded-full hover:bg-gray-200 transition"
                        >
                          <Kebab className="text-xl text-[#820000]" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === student.id && (
                          <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden z-10">
                            <button
                              onClick={() => router.push(`class/student/${student.id}`)}
                              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              <View size={18} className='mr-2' /> View
                            </button>
                            <button
                              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => { setSF9Modal(student.section_id.class_id) }}
                            >

                              <ShowPDF size={18} className='mr-2' /> SF 9
                            </button>
                            <button
                              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => { setSF10Modal(student.section_id.class_id) }}
                            >
                              <ShowPDF size={18} className='mr-2' /> SF 10
                            </button>
                            {SF9Modal !== null && (
                              SF9Modal >= 11 ? (
                                <GenerateSF9 onClose={() => setSF9Modal(null)} student={student} />
                              ) : (
                                <GenerateSF9B onClose={() => setSF9Modal(null)} student={student} />
                              )
                            )}

                            {SF10Modal !== null && (
                              SF10Modal >= 11 ? (
                                <GenerateSF10SHS onClose={() => setSF10Modal(null)} student={student} />
                              ) : (
                                <GenerateSF10JHS onClose={() => setSF10Modal(null)} student={student} />
                              )
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default page