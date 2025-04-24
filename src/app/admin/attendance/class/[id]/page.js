'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import NavbarAdmin from '../../../../../Components/NavbarAdmin'
import supabase from '../../../../lib/supabaseClient'
import { AiOutlineLoading3Quarters as Loader } from 'react-icons/ai'
import GenerateSF2 from '../../../../forms/SF2'

const page = () => {
  const router = useRouter()
  const { id } = useParams()
  const [students, setStudents] = useState([])
  const [openPDF, setOpenPDF] = useState(false)
  const [section, setSection] = useState([])
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [availableDates, setAvailableDates] = useState([])
  const [dayOfWeek, setDayOfWeek] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('user_id')
    const userRole = localStorage.getItem('role')

    if (userId && userRole) {
      if (userRole === 'teacher') router.replace('/teacher')
    } else {
      router.replace('/')
    }

    const fetchStudents = async () => {
      const { data: sectionData, error: sectionError } = await supabase
        .from('section')
        .select('class_id, section_name, adviser(first_name, last_name)')
        .eq('id', id)

      if (sectionError) {
        console.error('Error fetching section:', sectionError)
        return
      }

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('lrn, firstname, middlename, lastname, remarks, sex, attendance(*)')
        .eq('section_id', id)

      if (studentsError) {
        console.error('Error fetching students:', studentsError)
        return
      }

      setStudents(studentsData || [])
      setSection(sectionData || [])

      const dateSet = new Set()
      studentsData.forEach(student => {
        student.attendance.forEach(att => dateSet.add(att.date))
      })

      const sortedDates = Array.from(dateSet)
        .map(date => {
          const [y, m, d] = date.split('-')
          return { year: y, month: parseInt(m), day: parseInt(d) }
        })
        .sort((a, b) => new Date(b.year, b.month - 1, b.day) - new Date(a.year, a.month - 1, a.day))

      setAvailableDates(sortedDates)

      if (sortedDates.length > 0) {
        setYear(sortedDates[0].year)
        setMonth(sortedDates[0].month)
        setDay(sortedDates[0].day)
      }
    }

    if (id) fetchStudents()
  }, [id])

  useEffect(() => {
    if (year && month && day) {
      const date = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      setDayOfWeek(days[date.getDay()])
    }
  }, [year, month, day])

  const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const availableYears = [...new Set(availableDates.map(d => d.year))]
  const availableMonths = [...new Set(availableDates.filter(d => d.year === year).map(d => d.month))]
  const availableDays = [...new Set(availableDates.filter(d => d.year === year && d.month === month).map(d => d.day))]

  useEffect(() => {
    if (!availableMonths.includes(month)) {
      setMonth(availableMonths[0] || '')
    }
  }, [year])

  useEffect(() => {
    if (!availableDays.includes(day)) {
      setDay(availableDays[0] || '')
    }
  }, [month, year])

  const filteredStudents = students.map(student => ({
    ...student,
    attendance: student.attendance.filter(att =>
      att.date.startsWith(`${year}-${String(month).padStart(2, '0')}-`)
    )
  }))

  const filteredStudents1 = students.map(student => ({
    ...student,
    attendance: student.attendance.filter(att =>
      att.date === `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    )
  }))
  

  return (
    <div className="ml-[6rem] mt-[5rem] p-6 bg-white min-h-[90vh]">
      <NavbarAdmin route="admin" routeName1="attendance" routeName2="Class" />
      
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold text-[#820000]">Attendance for Section {section[0]?.section_name || 'N/A'}</h1>
        <h3 className="text-lg text-gray-700">Selected Date: {dayOfWeek}</h3>
      </div>
  
      <div className="mb-6 flex justify-center space-x-4">
        <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-300 p-2 rounded-lg shadow-md focus:ring-2 focus:ring-[#820000]">
          {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
  
        <select value={month} onChange={e => setMonth(parseInt(e.target.value))} className="border border-gray-300 p-2 rounded-lg shadow-md focus:ring-2 focus:ring-[#820000]">
          {availableMonths.map(m => <option key={m} value={m}>{months[m]}</option>)}
        </select>
  
        <select value={day} onChange={e => setDay(parseInt(e.target.value))} className="border border-gray-300 p-2 rounded-lg shadow-md focus:ring-2 focus:ring-[#820000]">
          {availableDays.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
  
      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Male Students Table */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#820000] mb-3">Male</h2>
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-[#820000] text-white">
                <tr>
                  <th className="p-3 text-left">LRN</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents1.filter(s => s.sex === 'M').sort((a, b) => a.lastname.localeCompare(b.lastname)).map(student => (
                  <tr key={student.lrn} className="odd:bg-white even:bg-gray-100">
                    <td className="p-3">{student.lrn}</td>
                    <td className="p-3">{student.lastname}, {student.firstname} {student.middlename ? student.middlename.charAt(0).toUpperCase() + '.' : ''}</td>
                    <td className="p-3">
                      {student.attendance.length > 0
                        ? student.attendance[0].status === 'P' ? 'Present' 
                        : student.attendance[0].status === 'A' ? 'Absent' 
                        : student.attendance[0].status === 'T' ? 'Tardy' 
                        : student.attendance[0].status === 'C' ? 'Cutting' 
                        : 'Type Error'
                        : 'No Record'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Female Students Table */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#820000] mb-3">Female</h2>
            <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bg-[#820000] text-white">
                <tr>
                  <th className="p-3 text-left">LRN</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents1.filter(s => s.sex === 'F').sort((a, b) => a.lastname.localeCompare(b.lastname)).map(student => (
                  <tr key={student.lrn} className="odd:bg-white even:bg-gray-100">
                    <td className="p-3">{student.lrn}</td>
                    <td className="p-3">{student.lastname}, {student.firstname} {student.middlename ? student.middlename.charAt(0).toUpperCase() + '.' : ''}</td>
                    <td className="p-3">
                      {student.attendance.length > 0
                        ? student.attendance[0].status === 'P' ? 'Present' 
                        : student.attendance[0].status === 'A' ? 'Absent' 
                        : student.attendance[0].status === 'T' ? 'Tardy' 
                        : student.attendance[0].status === 'C' ? 'Cutting' 
                        : 'Type Error'
                        : 'No Record'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div onClick={() => setOpenPDF(true)} className='fixed bottom-8 right-6 bg-[#820000] hover:bg-[#660000] text-white px-5 py-2 rounded-lg shadow-md transition duration-300 cursor-pointer'>
            View SF2
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-40">
          <Loader className="loading-circle text-6xl text-[#820000] z-50" />
        </div>
      )}

  
      {openPDF && <GenerateSF2 
      onClose={() => setOpenPDF(false)} 
      students={filteredStudents} 
      section={section} 
      date={{ month, year }} />}
    </div>
  );  
}

export default page
