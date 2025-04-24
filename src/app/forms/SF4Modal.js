'use client'
import React, { useState, useEffect } from 'react'
import GenerateSF4 from './SF4'
import supabase from '../lib/supabaseClient'


const SF4Modal = ({ onClose }) => {
  const [openPDF, setOpenPDF] = useState(false)
  const [year, setSelectedYear] = useState('2025')
  const [month, setSelectedMonth] = useState(1) // Default to January
  const [sections, setsections] = useState([])
  const [students, setstudents] = useState([])

  const groupSectionsByClass = (sections) => {
    return sections.reduce((acc, section) => {
      const { class_id } = section;

      if (!acc[class_id]) {
        acc[class_id] = []
      }

      acc[class_id].push(section)

      return acc
    }, {})
  }

  const appendStudentsToSections = (sections, students) => {
    // Convert sections array into an object with section_id as keys
    const sectionMap = sections.reduce((acc, section) => {
      acc[section.id] = {
        ...section,
        students: { male: [], female: [] } // Initialize male and female arrays
      };
      return acc;
    }, {});

    // Append students to their respective section & categorize them
    students.forEach(student => {
      if (sectionMap[student.section_id]) {
        if (student.sex === "M") {
          sectionMap[student.section_id].students.male.push(student);
        } else if (student.sex === "F") {
          sectionMap[student.section_id].students.female.push(student);
        }
      }
    });

    // Convert back to an array if needed
    return Object.values(sectionMap);
  }

  const filterStudentsByMonth = (students, selectedMonth) => {
    return students.map(student => {
      // If attendance is null, keep the student with attendance set to null
      if (!student.attendance) {
        return { ...student, attendance: null };
      }

      // Ensure attendance is an array
      if (!Array.isArray(student.attendance)) {
        console.warn("Skipping student due to invalid attendance format:", student);
        return { ...student, attendance: null };
      }

      // Filter attendance records that match the selected month
      const filteredAttendance = student.attendance.filter(record => {
        if (!record.date) return false; // Ensure date exists

        const recordMonth = new Date(record.date).getMonth() + 1; // getMonth() is 0-based
        return recordMonth === selectedMonth;
      });

      // Return student with filtered attendance (even if it's empty)
      return { ...student, attendance: filteredAttendance.length > 0 ? filteredAttendance : null };
    });
  };



  useEffect(() => {
    const fetch = async () => {
      const { data: section, error: sectionError } = await supabase
        .from('section')
        .select('id, class_id, section_name, adviser(first_name, middle_name, last_name)')

      if (sectionError) {
        console.error('Error fetching:', sectionError)
        return
      }

      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('section_id, attendance(date, status), sex, remarks')

      if (studentsError) {
        console.error('Error fetching:', studentsError)
        return
      }

      const filteredStudents = filterStudentsByMonth(students, Number(month))

      // console.log(groupSectionsByClass(appendStudentsToSections(section, filteredStudents)))

      setstudents(filteredStudents)
      setsections(section)
    }

    fetch()
  }, [year, month])

  const test = groupSectionsByClass(appendStudentsToSections(sections, students))

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg w-[90%] max-w-[600px] max-h-[90vh] flex flex-col overflow-y-auto shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-[#820000] mb-4 text-center">
          Select Date
        </h2>

        {/* Year & Month Dropdowns */}
        <div className="flex justify-center gap-4 mb-6">
          <select
            className="p-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-[#820000] outline-none"
            value={year}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2025">2025</option>
          </select>

          <select
            className="p-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-[#820000] outline-none"
            value={month}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Open PDF Button */}
        <button
          className="px-5 py-2 rounded-md bg-[#820000] text-white hover:bg-[#6a0000] transition-all"
          onClick={() => setOpenPDF(true)}
        >
          Open PDF
        </button>
      </div>

      {openPDF && (
        <GenerateSF4 onClose={() => setOpenPDF(false)} date={{ year, month }} array={test} />
      )}
    </div>
  );
}

export default SF4Modal
