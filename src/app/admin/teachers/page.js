'use client'
import React, { useEffect, useState } from 'react'
import NavbarAdmin from '../../../Components/NavbarAdmin'
import { useRouter } from 'next/navigation'
import supabase from '../../lib/supabaseClient'
import GenerateSF1 from '../../forms/SF1'
import { IoPersonCircleSharp as DefaultPic } from "react-icons/io5"
import { FiMoreVertical } from "react-icons/fi"
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"
import { LuView as View } from "react-icons/lu";
import { AiOutlineFilePdf as ShowPDF, AiOutlineDelete as Delete } from "react-icons/ai"
import { FaSearch } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import bcrypt from 'bcryptjs'

const TeachersPage = () => {
  const router = useRouter()

  const [teachers, setTeachers] = useState([])
  const [selectedTeacherId, setSelectedTeacherId] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setdeleteModalVisible] = useState(false)

  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade7, setFilterGrade7] = useState(false);
  const [filterGrade8, setFilterGrade8] = useState(false);
  const [filterGrade9, setFilterGrade9] = useState(false);
  const [filterGrade10, setFilterGrade10] = useState(false);
  const [filterGrade11, setFilterGrade11] = useState(false);
  const [filterGrade12, setFilterGrade12] = useState(false);

  const searchedTeachers = teachers
    .filter((teacher) =>
      `${teacher.first_name} ${teacher.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((teacher) => {
      if (filterGrade7 && teacher.section?.[0]?.class_id == '7') return true;
      if (filterGrade8 && teacher.section?.[0]?.class_id == '8') return true;
      if (filterGrade9 && teacher.section?.[0]?.class_id == '9') return true;
      if (filterGrade10 && teacher.section?.[0]?.class_id == '10') return true;
      if (filterGrade11 && teacher.section?.[0]?.class_id == '11') return true;
      if (filterGrade12 && teacher.section?.[0]?.class_id == '12') return true;
      return !filterGrade7 && !filterGrade8 && !filterGrade9 && !filterGrade10 && !filterGrade11 && !filterGrade12 // If no checkbox is selected, show all
    })

  const selectedTeacher = teachers.find(t => t.id === selectedTeacherId)
  const section = selectedTeacher?.section?.[0] || {}

  const fetchTeachers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('users')
      .select('id, school_id, first_name, middle_name, last_name, email, profile_picture, section(id, section_name, class_id)')
      .eq('role', 'teacher')
      .eq('isDeleted', false)

    if (error) {
      console.error('Error fetching teachers:', error)
    } else {
      setTeachers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    let channel

    const checkAuthAndFetchTeachers = async () => {
      const userId = localStorage.getItem('user_id')
      const userRole = localStorage.getItem('role')

      if (!userId || !userRole) {
        router.push('/')
        return
      }

      if (userRole === 'teacher') {
        router.replace('/teacher')
        return
      }

      await fetchTeachers()

      channel = supabase
        .channel('realtime_teachers')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'users', filter: 'role=eq.teacher' },
          () => fetchTeachers()
        )
        .subscribe()
    }

    checkAuthAndFetchTeachers()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [router])


  const deleteUser = async (id) => {
    const { data, error } = await supabase
      .from('users')
      .update({ 'isDeleted': true })
      .eq('id', id)

    setdeleteModalVisible(false)
  }

  const resetPassword = async (id, password) => {

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from('users')
      .update({ 'hashed_password': hashedPassword })
      .eq('id', id)

      alert('Password has been reset')
  }

  return (
    <div className='ml-[6rem] mt-[5rem] p-6 bg-white min-h-auto'>
      <NavbarAdmin route={'admin'} routeName1={'teachers'} />

      {loading ? (
        <div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-40'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loader className='loading-circle text-6xl text-[#d62b2b] z-50' />
          </div>
        </div>
      ) : (
        <>
          <div className='flex flex-col lg:flex-row justify-between items-center mb-6'>
            <div className='flex flex-col items-center gap-6 lg:flex-row'>
              <h1 className="text-2xl font-bold text-[#820000]">Teachers List</h1>
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
              <div className="mb-4 flex gap-2">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterGrade7(!filterGrade7)}>
                  <span className="text-[#820000] font-medium select-none">Grade 7</span>
                  <button
                    className="text-xl"
                  >
                    {filterGrade7 ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterGrade8(!filterGrade8)}>
                  <span className="text-[#820000] font-medium select-none">Grade 8</span>
                  <button
                    className="text-xl"
                  >
                    {filterGrade8 ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterGrade9(!filterGrade9)}>
                  <span className="text-[#820000] font-medium select-none">Grade 9</span>
                  <button
                    className="text-xl"
                  >
                    {filterGrade9 ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterGrade10(!filterGrade10)}>
                  <span className="text-[#820000] font-medium select-none">Grade 10</span>
                  <button
                    className="text-xl"
                  >
                    {filterGrade10 ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterGrade11(!filterGrade11)}>
                  <span className="text-[#820000] font-medium select-none">Grade 11</span>
                  <button
                    className="text-xl"
                  >
                    {filterGrade11 ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterGrade12(!filterGrade12)}>
                  <span className="text-[#820000] font-medium select-none">Grade 12</span>
                  <button
                    className="text-xl"
                  >
                    {filterGrade12 ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => { router.push('teachers/addTeacher') }}
              className='bg-[#820000] hover:bg-[#660000] text-white px-5 py-2 rounded-lg shadow-md transition duration-300'
            >
              Add Teacher
            </button>
          </div>

          <div className='p-4 bg-gray-50 rounded-lg shadow-md'>
            <table className='w-full rounded-lg'>
              <thead>
                <tr className='bg-[#820000] text-white text-left'>
                  <th className='p-3 pl-6 font-semibold'>NAME</th>
                  <th className='p-3 font-semibold'>EMAIL</th>
                  <th className='p-3 font-semibold'>GRADE LEVEL</th>
                  <th className='p-3 font-semibold'>SECTION NAME</th>
                  <th className='p-3 font-semibold text-center'>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {searchedTeachers.map((teacher, index) => (
                  <tr key={teacher.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                    <td className='p-3 flex items-center'>
                      {teacher.profile_picture ? (
                        <img
                          src={teacher.profile_picture}
                          alt='Profile'
                          className='w-11 h-11 p-1 rounded-full mr-3 border border-gray-300'
                        />
                      ) : (
                        <div className='w-11 h-11 text-6xl rounded-full bg-gray-300 flex items-center justify-center text-gray-700 mr-3'>
                          <DefaultPic />
                        </div>
                      )}
                      {teacher.last_name}, {teacher.first_name}
                    </td>
                    <td className='p-3'>{teacher.email}</td>
                    <td className='p-3'>{teacher.section?.[0]?.class_id || 'N/A'}</td>
                    <td className='p-3'>{teacher.section?.[0]?.section_name || 'N/A'}</td>
                    <td className='p-3 relative text-center'>
                      <button
                        onClick={() => setOpenMenu(openMenu === teacher.id ? null : teacher.id)}
                        className='text-gray-700 hover:text-[#820000]'
                      >
                        <FiMoreVertical size={20} />
                      </button>
                      {openMenu === teacher.id && (
                        <div className='absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-20'>
                          <button
                            onClick={() => setSelectedTeacherId(teacher.id)}
                            className='flex items-center px-4 py-2 w-full text-gray-700 hover:bg-gray-100'
                          >
                            <ShowPDF size={18} className='mr-2' /> PDF
                          </button>
                          <button
                            className='flex items-center px-4 py-2 w-full text-gray-600 hover:bg-gray-100'
                            onClick={() => { router.push(`teachers/view/${teacher.id}`) }}
                          >
                            <View size={18} className='mr-2' /> View
                          </button>
                          <button
                            className='flex items-center px-4 py-2 w-full text-gray-600 hover:bg-gray-100'
                            onClick={() => { resetPassword(teacher.id, teacher.school_id) }}
                          >
                            <View size={18} className='mr-2' /> Reset Password
                          </button>
                          <button
                            className='flex items-center px-4 py-2 w-full text-red-600 hover:bg-gray-100'
                            onClick={()=>{setdeleteModalVisible(true)}}
                          >
                            <Delete size={18} className='mr-2' /> Delete
                          </button>

                          {deleteModal && (<div className='fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-black/70 z-[100]' onClick={() => setdeleteModalVisible(false)}>
                            <div className='bg-white rounded-lg p-6' onClick={(e) => e.stopPropagation()}>
                              <div className='flex flex-col gap-2 justify-center items-center select-none'>
                                <div>
                                  Are you sure you want to delete this user? ID: {teacher.id} {teacher.school_id}
                                </div>
                                <div className='flex gap-6'>
                                  <div className='rounded-md py-2 px-4 bg-[#820000] hover:bg-[#972929] transition-all text-white cursor-pointer' onClick={()=> {deleteUser(teacher.id)}}>
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
            {selectedTeacherId && (
              <GenerateSF1
                onClose={() => setSelectedTeacherId(null)}
                section={{ name: section.section_name || 'N/A', classid: section.class_id || null, id: section.id || null }}
                teacherName={`${selectedTeacher?.first_name || ''} ${selectedTeacher?.middle_name || ''} ${selectedTeacher?.last_name || ''}`.trim()}
              />
            )}
          </div>

        </>
      )}
    </div>
  )
}

export default TeachersPage