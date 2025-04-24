'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '../../../app/lib/supabaseClient'

import NavbarAdmin from '../../../Components/NavbarAdmin'
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"
import GenerateSF6 from '../../forms/SF6'

const Page = () => {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState(7)
  const [groupedSections, setGroupedSections] = useState({})
  const [loading, setLoading] = useState(true)
  const [SF6Modal, setSF6Modal] = useState(false)

  const fetchSections = async () => {
    setLoading(true)

    const { data: sections, error: sectionError } = await supabase
      .from('section')
      .select('*, adviser(first_name, last_name, middle_name), students(sex, remarks, lrn, section_id(*), jr_student_grades(*), sr_student_grades(*, subject_id(*)))')
      .order('class_id', { ascending: true })

    if (sectionError) {
      console.error('Error fetching sections:', sectionError)
      setLoading(false)
      return
    }

    const grouped = sections.reduce((acc, sec) => {
      acc[sec.class_id] = acc[sec.class_id] || []
      acc[sec.class_id].push({ ...sec })
      return acc
    }, {})

    setGroupedSections(grouped)
    setLoading(false)
  }

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('role')

    if (userId && userRole) {
      if (userRole === 'teacher') router.replace('/teacher')
    } else {
      router.replace('/')
    }

    fetchSections()
  }, [])

  const handleClick = (classId, section_name) => {
    router.push(`classes/class/${classId}`)
  }

  return (
    <div className='ml-[6rem] mt-[5rem] bg-gray-50 min-h-auto p-6 rounded-lg shadow-lg'>
      <NavbarAdmin route={'admin'} routeName1={'classes'} />
      <h2 className='text-3xl font-bold text-[#820000] mb-6'>Sections</h2>


      <div className='flex justify-between items-center'>

        <div className='flex gap-4 mb-6'>
          {[7, 8, 9, 10, 11, 12].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-6 py-3 font-medium border rounded-lg transition-all duration-300 ${selectedGrade === grade ? 'bg-[#820000] text-white shadow-md' : 'bg-white text-[#820000] border-[#820000] hover:bg-[#660000] hover:text-white'}`}
            >
              Grade {grade}
            </button>
          ))}
        </div>
        <div className='text-white cursor-pointer py-2 px-4 rounded-lg bg-[#820000] hover:bg-[#6b1919] transition-all text-lg mr-4' onClick={() => setSF6Modal(true)}>View SF6
        </div>
        {SF6Modal && (
          <GenerateSF6 onClose={() => { setSF6Modal(false) }} sections={groupedSections}/>
        )}
      </div>

      {loading ? (
        <div className='fixed top-0 left-0 bottom-0 right-0 bg-black/70 z-40'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <Loader className='loading-circle text-6xl text-[#d62b2b] z-50' />
          </div>
        </div>
      ) : (
        selectedGrade && groupedSections[selectedGrade] && (
          <div className='overflow-x-auto bg-white p-4 rounded-lg shadow-md'>
            <table className='w-full border border-gray-300 shadow-md rounded-lg table-fixed'>
              <thead className='bg-[#820000] text-white'>
                <tr>
                  <th className='px-6 py-3 text-left font-semibold w-1/3'>Section</th>
                  <th className='px-6 py-3 text-left font-semibold w-1/3'>Adviser</th>
                  <th className='px-6 py-3 text-left font-semibold w-1/3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedSections[selectedGrade].map((section, index) => (
                  <tr key={section.id} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} border-t border-gray-300 hover:bg-gray-300 transition-all duration-300`}>
                    <td className='px-6 py-3'>{section.section_name}</td>
                    <td className='px-6 py-3'>{section.adviser?.first_name || 'N/A'}</td>
                    <td className='px-6 py-3'>
                      <button
                        onClick={() => handleClick(section.id)}
                        className={`px-4 py-2 rounded-lg shadow-md transition-all duration-300  bg-[#820000] text-white hover:bg-[#660000]`}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

    </div>
  )
}

export default Page