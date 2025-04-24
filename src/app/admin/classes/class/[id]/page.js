'use client'

import React, { useEffect, useState } from 'react'
import NavbarAdmin from '../../../../../Components/NavbarAdmin'
import { useRouter, useParams } from 'next/navigation'
import supabase from '../../../../lib/supabaseClient'
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai";
import { IoPersonCircleOutline as DefaultPic } from "react-icons/io5";
import { FiMoreVertical as Kebab } from "react-icons/fi";
import { LuView as View } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { AiOutlineFilePdf as ShowPDF, AiOutlineDelete as Delete } from "react-icons/ai"
import DocumentsModal from '../../../../../Components/DocumentsModal'
import GenerateSF5 from '../../../../../app/forms/SF5'
import GenerateSF9 from '../../../../../app/forms/SF9'
import GenerateSF9B from '../../../../../app/forms/SF9-B'
import GenerateSF10JHS from '../../../../../app/forms/SF10-JHS'
import GenerateSF10SHS from '../../../../../app/forms/SF10-SHS'

const page = () => {
  const router = useRouter()
  const { id } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState({})
  const [deleteModal, setdeleteModalVisible] = useState(false)
  const [documentsModal, setDocumentsModalVisible] = useState(false)
  const [SF5Modal, setSF5Modal] = useState(false)
  const [SF9Modal, setSF9Modal] = useState(null)
  const [SF10Modal, setSF10Modal] = useState(null)

  const [openDropdown, setOpenDropdown] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMale, setFilterMale] = useState(false);
  const [filterFemale, setFilterFemale] = useState(false)

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

    const { data, error } = await supabase
      .from('students')
      .select('*, values(*),section_id(*, adviser(first_name, middle_name, last_name)), jr_student_grades(*, class_id(*)), sr_student_grades(*, subject_id(*))')
      .eq('section_id', id)
      .eq('isDeleted', false)

    const { data: section, error: sectionerror } = await supabase
      .from('section')
      .select('*, adviser(first_name, middle_name ,last_name)')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching students:', error)
      setLoading(false)
    } else {
      setStudents(data)
      setSection(section)
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

  const deleteUser = async (id) => {
    const { data, error } = await supabase
      .from('students')
      .update({ 'isDeleted': true })
      .eq('id', id)

    setdeleteModalVisible(false)
  }

  return (
    <div className="ml-[6rem] mt-[5rem] p-6 bg-white min-h-[90vh] shadow-lg rounded-lg">
      <NavbarAdmin route="admin" routeName1={'classes'} routeName2={`Grade ${section?.class_id} ${section?.section_name}`} />
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
          <Loader className="animate-spin text-6xl text-[#820000] z-50" />
        </div>
      ) : (
        <div>
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
            <div className='flex flex-col lg:flex-row items-center gap-6'>
              <h1 className="text-2xl font-bold text-[#820000]">Class List</h1>
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
              onClick={() => router.push(`addStudent/${section?.id}`)}
              className="bg-[#820000] hover:bg-[#660000] text-white px-5 py-2 rounded-lg shadow-lg drop-shadow-lg transition duration-300"
            >
              Add Student
            </button>
          </div>

          <div className="p-4 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-[#820000] mb-3">Students</h2>
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
                              onClick={() => router.push(`student/${student.id}`)}
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
                            <button
                              className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                              onClick={() => { setDocumentsModalVisible(true) }}
                            >
                              <ShowPDF size={18} className='mr-2' /> Documents
                            </button>
                            <button
                              className='flex items-center px-4 py-2 w-full text-red-600 hover:bg-gray-100'
                              onClick={() => { setdeleteModalVisible(true) }}
                            >
                              <Delete size={18} className='mr-2' /> Delete
                            </button>

                            {documentsModal && (
                              <DocumentsModal onClose={() => { setDocumentsModalVisible(false) }} studentid={student.id} />
                            )}
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

                            {deleteModal && (<div className='fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black/70 z-[100]' onClick={() => setdeleteModalVisible(false)}>
                              <div className='bg-white rounded-lg p-6' onClick={(e) => e.stopPropagation()}>
                                <div className='flex flex-col gap-2 justify-center items-center select-none'>
                                  <div>
                                    Are you sure you want to delete this user? ID: {student.id}
                                  </div>
                                  <div className='flex gap-6'>
                                    <div className='rounded-md py-2 px-4 bg-[#820000] hover:bg-[#972929] transition-all text-white cursor-pointer' onClick={() => { deleteUser(student.id) }}>
                                      Yes
                                    </div>
                                    <div className='rounded-md py-2 px-4 bg-[#820000] hover:bg-[#972929] transition-all text-white cursor-pointer' onClick={() => setdeleteModalVisible(false)}>
                                      No
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div onClick={() => setSF5Modal(true)} className='fixed bottom-8 right-6 bg-[#820000] hover:bg-[#660000] text-white px-5 py-2 rounded-lg shadow-md transition duration-300 cursor-pointer'>
            View SF5
          </div>
          {SF5Modal && (
            <GenerateSF5
              onClose={() => { setSF5Modal(false) }} section={section} />
          )}



        </div>
      )}
    </div>
  );
}

export default page