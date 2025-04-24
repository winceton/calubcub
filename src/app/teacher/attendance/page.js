'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '../../../Components/NavbarAdmin'
import supabase from '../../lib/supabaseClient'
import { AiOutlineLoading3Quarters as Loader } from "react-icons/ai"
import { FiChevronDown } from "react-icons/fi";  // Importing a soft chevron
import { FaSearch } from "react-icons/fa";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import GenerateSF2 from '../../forms/SF2'

const getNearestWeekday = () => {
  let date = new Date()
  let dayOfWeek = date.getDay()

  if (dayOfWeek === 0) date.setDate(date.getDate() - 2) // Move to Friday if Sunday
  else if (dayOfWeek === 6) date.setDate(date.getDate() - 1) // Move to Friday if Saturday

  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }
}

const AttendancePage = () => {
  const { year, month, day } = getNearestWeekday()

  const [students, setStudents] = useState([])
  const [attendanceList, setAttendanceList] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(year.toString())
  const [selectedMonth, setSelectedMonth] = useState(month.toString())
  const [selectedDay, setSelectedDay] = useState(day.toString())
  const [weekdays, setWeekdays] = useState([])
  const [SF2Modal, setSF2Modal] = useState(false)
  const [section, setSection] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])

  useEffect(() => {
    const fetchStudentsAndAttendance = async () => {
      const section = JSON.parse(localStorage.getItem('section')) || {}

      const { data: section1, error: sectionError } = await supabase
        .from('section')
        .select('*, adviser(first_name, last_name, middle_name)')
        .eq('id', section.id)

      setSection(section1)

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('lrn, firstname, middlename, lastname, remarks, sex, attendance(*)')
        .eq('section_id', section.id)


      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('lrn, date, status')

      if (studentsError) console.error('Error fetching students:', studentsError)
      if (attendanceError) console.error('Error fetching attendance:', attendanceError)

      setStudents(studentsData || [])
      setAttendanceList(attendanceData || [])
      setLoading(false)
    }


    fetchStudentsAndAttendance()
  }, [])

  useEffect(() => {
    const filteredStudents = students.map(student => ({
      ...student,
      attendance: student.attendance.filter(att =>
        att.date.startsWith(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-`)
      )
    }))

    setFilteredStudents(filteredStudents)
  }, [students])

  useEffect(() => {
    const fetchAttendanceForSelectedDate = async () => {
      const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;

      const { data: attendanceData, error } = await supabase
        .from('attendance')
        .select('lrn, date, status')
        .eq('date', formattedDate);

      if (error) {
        console.error('Error fetching attendance:', error);
      } else {
        setAttendanceList(attendanceData || []);
        setAttendance({}); // Reset local attendance state to match new data
      }
    };

    if (selectedYear && selectedMonth && selectedDay) {
      fetchAttendanceForSelectedDate();
    }
  }, [selectedYear, selectedMonth, selectedDay]);


  const [saving, setSaving] = useState(false)
  const [savingModal, setSavingModal] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const attendanceSavedAppear = () => {
    setSavingModal(true)
    setIsVisible(true)

    setTimeout(() => {
      setIsVisible(false)

      setTimeout(() => {
        setSavingModal(false)
      }, 1000)
    }, 4000)
  }

  useEffect(() => {
    const subscription = supabase
      .channel('attendance_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendance' },
        (payload) => {
          setAttendanceList((prevAttendanceList) => {
            const updatedList = prevAttendanceList.filter(
              (record) => record.lrn !== payload.new.lrn || record.date !== payload.new.date
            )
            return [...updatedList, payload.new]
          })

          setAttendance((prev) => ({
            ...prev,
            [payload.new.lrn]: payload.new.status,
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }

  }, [])


  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const today = new Date()
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
      const weekdaysArray = []

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth - 1, day)
        const dayOfWeek = date.getDay()

        if (dayOfWeek !== 0 && dayOfWeek !== 6 && date <= today) {
          weekdaysArray.push(day)
        }
      }
      setWeekdays(weekdaysArray)
    }

    const filteredStudents = students.map(student => ({
      ...student,
      attendance: student.attendance.filter(att =>
        att.date.startsWith(`${selectedYear}-${String(selectedMonth).padStart(2, '0')}-`)
      )
    }))

    setFilteredStudents(filteredStudents)
  }, [selectedYear, selectedMonth])

  const handleAttendanceChange = (lrn, status) => {
    setAttendance((prev) => ({ ...prev, [lrn]: status }))
  }

  const saveAttendance = async () => {
    const date = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`

    const records = students.map((student) => {
      // Find the existing record from attendanceList
      const existingRecord = attendanceList.find(
        (record) => record.lrn === student.lrn && record.date === date
      )

      return {
        lrn: student.lrn,
        date,
        status: attendance[student.lrn] ?? existingRecord?.status ?? 'P',
      }
    })

    const { error } = await supabase.from('attendance').upsert(records, { onConflict: ['lrn', 'date'] })

    attendanceSavedAppear()

    if (error) {
      console.error('Error saving attendance:', error)
    } else {
      setAttendanceList(records)
      setSaving(false)
    }
  }

  const getWeekdayName = (year, month, day) => {
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { weekday: 'long' })
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  const availableYears = []
  for (let y = currentYear; y >= 2025; y--) availableYears.push(y)

  const availableMonths = months.slice(0, selectedYear == currentYear ? currentMonth : 12)

  const [searchTerm, setSearchTerm] = useState("");
  const [filterMale, setFilterMale] = useState(false);
  const [filterFemale, setFilterFemale] = useState(false);

  const searchedStudents = students
    .filter((student) =>
      `${student.firstname} ${student.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((student) => {
      if (filterMale && student.sex === "M") return true;
      if (filterFemale && student.sex === "F") return true;
      return !filterMale && !filterFemale; // If no checkbox is selected, show all
    })
    .sort((a, b) => a.lastname.localeCompare(b.lastname));



  return (
    <div className="min-h-auto text-gray-900 relative">
      <Navbar route={'teacher'} routeName1={'Attendance'} />

      <button
        onClick={saveAttendance}
        className='fixed top-[6rem] right-8 py-3 px-6 bg-[#820000] text-white font-semibold rounded-md hover:bg-[#6a0000] transition shadow-lg drop-shadow-lg outline-none'
      >
        {saving ? 'Saving...' : 'Save Attendance'}
      </button>

      {savingModal && (
        <div className={`z-50 fixed top-20 left-1/2 -translate-x-1/2 py-4 px-8 text-[#820000] text-center bg-white border-t-4 border-[#820000] rounded-lg shadow-md drop-shadow-md transition-all duration-600 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          Attendance saved successfully.
        </div>
      )}

      {loading ? (
        <div className='fixed inset-0 bg-black/70 z-40 flex items-center justify-center'>
          <Loader className='loading-circle text-6xl text-[#820000] z-50' />
        </div>
      ) : (
        <div className='ml-[6rem] mt-[5rem] p-6 bg-white shadow-lg rounded-lg min-h-[90vh]'>
          <div className='flex items-center gap-8 flex-wrap'>
            <h2 className='text-3xl font-bold text-[#820000] mb-6'>{getWeekdayName(selectedYear, selectedMonth, selectedDay)}</h2>

            <div className='grid grid-cols-3 gap-4 mb-6'>
              {[{ label: "Year", value: selectedYear, set: setSelectedYear, options: availableYears },
              { label: "Month", value: selectedMonth, set: setSelectedMonth, options: availableMonths.map((_, i) => i + 1) },
              { label: "Day", value: selectedDay, set: setSelectedDay, options: weekdays }]
                .map(({ label, value, set, options }) => (
                  <label key={label} className='block relative cursor-pointer hover:opacity-80 transition-opacity'>
                    <div className='text-[#820000] absolute -top-[0.55rem] left-1/2 -translate-x-1/2 text-sm bg-white px-2 z-[1]'>{label}</div>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => set(e.target.value)}
                        className='w-full mt-1 px-4 py-2 border border-[#820000] rounded-md bg-transparent text-2xl text-center appearance-none shadow-sm transition-all outline-none'>
                        {options.map((option, i) => (
                          <option key={i} value={option}>{label === "Month" ? availableMonths[option - 1] : option}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#820000] text-2xl" />
                    </div>
                  </label>
                ))}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row items-center mb-6 gap-4">
            <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-2 w-full max-w-xs">
              <FaSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 focus:outline-none"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterMale(!filterMale)}>
                <span className="text-[#820000] font-medium select-none">Male</span>
                {filterMale ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
              </div>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setFilterFemale(!filterFemale)}>
                <span className="text-[#820000] font-medium select-none">Female</span>
                {filterFemale ? <MdCheckBox className="text-[#820000]" /> : <MdCheckBoxOutlineBlank className="text-gray-400" />}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="w-full table-auto">
              <thead className="bg-[#820000] text-white text-center">
                <tr>
                  <th className="py-3 pl-6">LRN</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {searchedStudents.map((student, index) => {
                  const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`
                  const studentRecord = attendanceList.find(record => record.lrn === student.lrn && record.date === formattedDate)
                  const statusMap = { P: "Present", A: "Absent", T: "Tardy", C: "Cutting" }
                  const displayStatus = studentRecord ? statusMap[studentRecord.status] : "N/A"

                  return (
                    <tr key={student.lrn} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="py-3 pl-6 text-center">{student.lrn}</td>
                      <td className="py-3 text-center">{`${student.lastname}, ${student.firstname} ${student.middlename}`}</td>
                      <td className="py-3 text-center">{displayStatus}</td>
                      <td className="py-3 text-center">
                        <select
                          className="border rounded-md p-2 bg-white"
                          value={attendance[student.lrn] ?? studentRecord?.status ?? 'P'}
                          onChange={(e) => handleAttendanceChange(student.lrn, e.target.value)}
                        >
                          <option value="P">Present</option>
                          <option value="A">Absent</option>
                          <option value="T">Tardy</option>
                          <option value="C">Cutting</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div onClick={() => setSF2Modal(true)} className='fixed bottom-8 right-6 bg-[#820000] hover:bg-[#660000] text-white px-5 py-2 rounded-lg shadow-md transition duration-300 cursor-pointer'>
            View SF2
          </div>
          {SF2Modal && <GenerateSF2
            onClose={() => setSF2Modal(false)}
            students={filteredStudents}
            section={section}
            date={{ month: Number(selectedMonth), year: selectedYear }} />}
        </div>
      )}
    </div>
  )
}

export default AttendancePage
