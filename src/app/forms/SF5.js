'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

const GenerateSF5 = ({ onClose, section }) => {

  const [pdfURL, setPdfURL] = useState(null)
  const [students, setStudents] = useState([])

  const fetchData = async () => {
    if (section.class_id <= 10) {
      const { data, error } = await supabase
        .from('students')
        .select('*, jr_student_grades(*, subject_id(*))')
        .eq('section_id', section.id)

      setStudents(data)
      if (error) {
        console.error('Error fetching students:', error)
        return
      }
    } else {
      const { data, error } = await supabase
        .from('students')
        .select('*, sr_student_grades(*, subject_id(*))')
        .eq('section_id', section.id)

      setStudents(data)
      if (error) {
        console.error('Error fetching students:', error)
        return
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    generatePDF()
  }, [students])


  const generatePDF = async () => {
    try {

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([792, 612])
      const page2 = pdfDoc.addPage([792, 612])
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      let currentPage = pdfDoc.getPage(0)


      // Fetch the image
      const imageBytes = await fetch('/logo/sf1logo.png').then(res => res.arrayBuffer())
      // Embed the imageG
      const image = await pdfDoc.embedPng(imageBytes)
      const { width, height } = image.scale(0.70) // Resize image
      const drawRectangle = (x, y, w, h) => {
        page.drawRectangle({
          x: x,
          y: y,
          width: w,
          height: h,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })
      }

      // Draw the image
      page.drawImage(image, {
        x: 16,
        y: 497,
        width,
        height,
      })

      // Info Details Start
      page.drawText("School Form 5 (SF 5) Report on Promotion and Learning Progress & Achievement", { x: 148, y: 555, size: 11, font, color: rgb(0, 0, 0) })
      page.drawText('Revised to conform with the instructions of Deped Order 8, s. 2015', { x: 260, y: 542, size: 7 })

      page.drawText('Region', { x: 81, y: 523, size: 8, bold })
      page.drawText('IV - A', { x: 120, y: 523, size: 8, bold })
      drawRectangle(107, 515, 48, 21)

      page.drawText('School ID', { x: 71, y: 497, size: 8, bold })
      page.drawText('301094', { x: 120, y: 497, size: 10, bold })
      drawRectangle(107, 489, 119, 22)

      page.drawText('School Name', { x: 58, y: 473, size: 8, bold })
      page.drawText('Calubcub 1st National High School', { x: 120, y: 473, size: 9, bold })
      drawRectangle(107, 465, 287, 20)

      page.drawText('Division', { x: 197, y: 523, size: 8, bold })
      page.drawText('Division of Batangas, San Juan East Sub - Office', { x: 230, y: 523, size: 7, bold })
      drawRectangle(226, 515, 168, 21)

      page.drawText('School Year', { x: 255, y: 497, size: 8, bold })
      page.drawText('2025 - 2026', { x: 305, y: 497, size: 8, bold })
      drawRectangle(300, 489, 94, 22)

      page.drawText('District', { x: 425, y: 523, size: 8, bold })
      drawRectangle(451, 515, 113, 21)

      page.drawText('Curriculum', { x: 411, y: 498, size: 8, bold })
      page.drawText('K to 12 Basic Education Curriculum', { x: 452, y: 498, size: 7, bold })
      drawRectangle(451, 489, 113, 22)

      page.drawText('Grade Level', { x: 406, y: 473, size: 8, bold })
      page.drawText(`${section.class_id}`, { x: 470, y: 473, size: 10, bold })
      drawRectangle(451, 465, 50, 20)

      page.drawText('Section', { x: 536, y: 473, size: 8, bold })
      page.drawText(`${section.section_name}`, { x: 570, y: 473, size: 8, bold })
      drawRectangle(564, 465, 148, 20)
      // Info Details End

      // Header Start
      drawRectangle(14, 385, 487, 77)

      // Vertical Lines for Header
      page.drawLine({ start: { x: 57, y: 462 }, end: { x: 57, y: 385 }, thickness: 1.5 })
      page.drawLine({ start: { x: 239, y: 462 }, end: { x: 239, y: 385 }, thickness: 1.5 })
      page.drawLine({ start: { x: 300, y: 462 }, end: { x: 300, y: 385 }, thickness: 1.5 })
      page.drawLine({ start: { x: 394, y: 462 }, end: { x: 394, y: 385 }, thickness: 1.5 })

      // Header Text Details
      page.drawText('LRN', { x: 29, y: 421, size: 6, font })
      page.drawText("LEARNER'S NAME", { x: 118, y: 426, size: 7, font })
      page.drawText("(Last Name, First Name, Middle Name)", { x: 97, y: 418, size: 6, font })
      page.drawText("GENERAL AVERAGE", { x: 241.5, y: 433, size: 5.5, font })
      page.drawText("(Whole numbers for", { x: 244, y: 425, size: 5.5, bold })
      page.drawText("non-honor)", { x: 256, y: 417, size: 5.5, bold })
      page.drawText("ACTION TAKEN: PROMOTED,", { x: 304, y: 426, size: 6, font })
      page.drawText("CONDITIONAL, or RETAINED", { x: 305, y: 418, size: 6, font })
      page.drawText("Did Not Meet Expectations of the ff", { x: 398, y: 433, size: 6, font })
      page.drawText("Learning Area/s as of end of", { x: 407, y: 425, size: 6, font })
      page.drawText("current School Year", { x: 418, y: 417, size: 6, font })
      // Header Text Details End

      // START
      let y = 369
      let rowCount = 0

      const females = students.filter(student => student.sex === 'F')
      const femalesCount = females.length

      const males = students.filter(student => student.sex === 'M')
      const malesCount = males.length
      let malePromoted = 0
      let maleConditional = 0
      let maleRetained = 0
      let femalePromoted = 0
      let femaleConditional = 0
      let femaleRetained = 0
      let maledidNotMeet = 0
      let malefairlySatisfactory = 0
      let malesatisfactory = 0
      let maleverySatisfactory = 0
      let maleoutstanding = 0
      let femaledidNotMeet = 0
      let femalefairlySatisfactory = 0
      let femalesatisfactory = 0
      let femaleverySatisfactory = 0
      let femaleoutstanding = 0

      for (let index = 0; index < malesCount; index++) {
        if (rowCount >= 20) {
          currentPage = pdfDoc.getPage(1)
          rowCount = 0
          y = 500

          currentPage.drawRectangle({
            x: 14,
            y: 500,
            width: 487,
            height: 77,
            borderColor: rgb(0, 0, 0),
            borderWidth: 0.5
          })

          // Vertical Lines for Header
          currentPage.drawLine({ start: { x: 57, y: 577 }, end: { x: 57, y: 500 }, thickness: 1.5 })
          currentPage.drawLine({ start: { x: 239, y: 577 }, end: { x: 239, y: 500 }, thickness: 1.5 })
          currentPage.drawLine({ start: { x: 300, y: 577 }, end: { x: 300, y: 500 }, thickness: 1.5 })
          currentPage.drawLine({ start: { x: 394, y: 577 }, end: { x: 394, y: 500 }, thickness: 1.5 })

          // Header Text Details
          currentPage.drawText('LRN', { x: 29, y: 536, size: 6, font })
          currentPage.drawText("LEARNER'S NAME", { x: 118, y: 541, size: 7, font })
          currentPage.drawText("(Last Name, First Name, Middle Name)", { x: 97, y: 533, size: 6, font })
          currentPage.drawText("GENERAL AVERAGE", { x: 241.5, y: 548, size: 5.5, font })
          currentPage.drawText("(Whole numbers for", { x: 244, y: 540, size: 5.5, bold })
          currentPage.drawText("non-honor)", { x: 256, y: 532, size: 5.5, bold })
          currentPage.drawText("ACTION TAKEN: PROMOTED,", { x: 304, y: 541, size: 6, font })
          currentPage.drawText("CONDITIONAL, or RETAINED", { x: 305, y: 533, size: 6, font })
          currentPage.drawText("Did Not Meet Expectations of the ff", { x: 398, y: 548, size: 6, font })
          currentPage.drawText("Learning Area/s as of end of", { x: 407, y: 540, size: 6, font })
          currentPage.drawText("current School Year", { x: 418, y: 532, size: 6, font })
        }

        let male = males[index]
        let average = 'Not Available'
        let action = 'N/A'
        let validGrades = []
        let failingSubjects = []

        if (section.class_id >= 11) {
          validGrades = male.sr_student_grades.filter(
            g => g.grade_mark !== null && !isNaN(g.grade_mark)
          )
          if (validGrades.length >= 24) {
            const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0)
            average = (total / validGrades.length).toFixed(2)

            failingSubjects = validGrades
              .filter(g => parseFloat(g.grade_mark) < 75)
              .map(g => g.subject_id.subject)

            const failingGrades = failingSubjects.length
            if (failingGrades === 0) {
              malePromoted += 1
              action = 'Promoted'
            } else if (failingGrades <= 2) {
              maleConditional += 1
              action = 'Conditional'
            } else {
              maleRetained += 1
              action = 'Retained'
            }

            if (average <= 74) {
              maledidNotMeet += 1
            } else if (average >= 75 && average <= 79) {
              malefairlySatisfactory += 1
            } else if (average >= 80 && average <= 84) {
              malesatisfactory += 1
            } else if (average >= 85 && average <= 89) {
              maleverySatisfactory += 1
            } else if (average >= 90 && average <= 100) {
              maleoutstanding += 1
              average = Math.round(average)
            }
          }
        } else {
          validGrades = male.jr_student_grades.filter(
            g => g.grade_mark !== null && !isNaN(g.grade_mark)
          )

          if (validGrades.length === 40) {
            const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0)
            average = (total / 40).toFixed(2)

            failingSubjects = validGrades
              .filter(g => parseFloat(g.grade_mark) < 75)
              .map(g => g.subject_id.subject)

            const failingGrades = failingSubjects.length
            if (failingGrades === 0) {
              malePromoted += 1
              action = 'Promoted'
            } else if (failingGrades <= 2) {
              maleConditional += 1
              action = 'Conditional'
            } else {
              maleRetained += 1
              action = 'Retained'
            }

            if (average <= 74) {
              maledidNotMeet += 1
            } else if (average >= 75 && average <= 79) {
              malefairlySatisfactory += 1
            } else if (average >= 80 && average <= 84) {
              malesatisfactory += 1
            } else if (average >= 85 && average <= 89) {
              maleverySatisfactory += 1
            } else if (average >= 90 && average <= 100) {
              maleoutstanding += 1
              average = Math.round(average)
            }
          }
        }


        // First Row
        currentPage.drawText(`${male.lrn}`, { x: 15, y: y + 5, size: 6, bold })
        currentPage.drawText(`${male.lastname}, ${male.firstname}, ${male.middlename}`, { x: 59, y: y + 5, size: 6, bold })
        currentPage.drawText(`${average}`, { x: 250, y: y + 5, size: 6, bold })
        currentPage.drawText(`${action}`, { x: 320, y: y + 5, size: 6, bold })
        currentPage.drawText(`${failingSubjects[0] || ''}`, { x: 400, y: y + 11, size: 4, bold })
        currentPage.drawText(`${failingSubjects[1] || ''}`, { x: 400, y: y + 6, size: 4, bold })
        currentPage.drawText(`${failingSubjects[2] || ''}`, { x: 400, y: y + 1, size: 4, bold })

        currentPage.drawRectangle({
          x: 14,
          y: y,
          width: 487,
          height: 16,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })

        // Vertical Lines for First Row
        currentPage.drawLine({ start: { x: 57, y: y + 16 }, end: { x: 57, y: y }, thickness: 1.5 })
        currentPage.drawLine({ start: { x: 239, y: y + 16 }, end: { x: 239, y: y }, thickness: 1.5 })
        currentPage.drawLine({ start: { x: 300, y: y + 16 }, end: { x: 300, y: y }, thickness: 1.5 })
        currentPage.drawLine({ start: { x: 394, y: y + 16 }, end: { x: 394, y: y }, thickness: 1.5 })

        y -= 16
        rowCount++
      }

      currentPage.drawRectangle({
        x: 14,
        y: y,
        width: 487,
        height: 16,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })

      // Vertical Lines for Second Row
      currentPage.drawLine({ start: { x: 57, y: y + 16 }, end: { x: 57, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 239, y: y + 16 }, end: { x: 239, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 300, y: y + 16 }, end: { x: 300, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 394, y: y + 16 }, end: { x: 394, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 94, y: y + 12 }, end: { x: 116, y: y + 12 }, thickness: 1 })
      currentPage.drawText("TOTAL MALE", { x: 145, y: y + 5, size: 6, bold })
      currentPage.drawText(`${malesCount}`, { x: 215, y: y + 5, size: 9, bold })

      // FEMALE START
      y -= 16
      for (let index = 0; index < femalesCount; index++) {
        if (rowCount >= 20) {
          currentPage = pdfDoc.getPage(1)
          rowCount = 0
          y = 500

          currentPage.drawRectangle({
            x: 14,
            y: 500,
            width: 487,
            height: 77,
            borderColor: rgb(0, 0, 0),
            borderWidth: 0.5
          })

          // Vertical Lines for Header
          currentPage.drawLine({ start: { x: 57, y: 577 }, end: { x: 57, y: 500 }, thickness: 1.5 })
          currentPage.drawLine({ start: { x: 239, y: 577 }, end: { x: 239, y: 500 }, thickness: 1.5 })
          currentPage.drawLine({ start: { x: 300, y: 577 }, end: { x: 300, y: 500 }, thickness: 1.5 })
          currentPage.drawLine({ start: { x: 394, y: 577 }, end: { x: 394, y: 500 }, thickness: 1.5 })

          // Header Text Details
          currentPage.drawText('LRN', { x: 29, y: 536, size: 6, font })
          currentPage.drawText("LEARNER'S NAME", { x: 118, y: 541, size: 7, font })
          currentPage.drawText("(Last Name, First Name, Middle Name)", { x: 97, y: 533, size: 6, font })
          currentPage.drawText("GENERAL AVERAGE", { x: 241.5, y: 548, size: 5.5, font })
          currentPage.drawText("(Whole numbers for", { x: 244, y: 540, size: 5.5, bold })
          currentPage.drawText("non-honor)", { x: 256, y: 532, size: 5.5, bold })
          currentPage.drawText("ACTION TAKEN: PROMOTED,", { x: 304, y: 541, size: 6, font })
          currentPage.drawText("CONDITIONAL, or RETAINED", { x: 305, y: 533, size: 6, font })
          currentPage.drawText("Did Not Meet Expectations of the ff", { x: 398, y: 548, size: 6, font })
          currentPage.drawText("Learning Area/s as of end of", { x: 407, y: 540, size: 6, font })
          currentPage.drawText("current School Year", { x: 418, y: 532, size: 6, font })
        }

        let female = females[index]
        let average = 'Not Available'
        let action = 'N/A'
        let validGrades = []
        let failingSubjects = []

        if (section.class_id >= 11) {
          validGrades = female.sr_student_grades.filter(
            g => g.grade_mark !== null && !isNaN(g.grade_mark)
          )

          if (validGrades.length >= 24) {
            const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0)
            average = (total / validGrades.length).toFixed(2)

            failingSubjects = validGrades
              .filter(g => parseFloat(g.grade_mark) < 75)
              .map(g => g.subject_id.subject)

            const failingGrades = failingSubjects.length

            if (failingGrades === 0) {
              femalePromoted += 1
              action = 'Promoted'
            } else if (failingGrades <= 2) {
              femaleConditional += 1
              action = 'Conditional'
            } else {
              femaleRetained += 1
              action = 'Retained'
            }

            if (average <= 74) {
              femaledidNotMeet += 1
            } else if (average >= 75 && average <= 79) {
              femalefairlySatisfactory += 1
            } else if (average >= 80 && average <= 84) {
              femalesatisfactory += 1
            } else if (average >= 85 && average <= 89) {
              femaleverySatisfactory += 1
            } else if (average >= 90 && average <= 100) {
              femaleoutstanding += 1
              average = Math.round(average)
            }
          }
        } else {
          validGrades = female.jr_student_grades.filter(
            g => g.grade_mark !== null && !isNaN(g.grade_mark)
          )
          if (validGrades.length === 40) {
            const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0)
            average = (total / 40).toFixed(2)

            failingSubjects = validGrades
              .filter(g => parseFloat(g.grade_mark) < 75)
              .map(g => g.subject_id.subject)

            const failingGrades = failingSubjects.length
            if (failingGrades === 0) {
              femalePromoted += 1
              action = 'Promoted'
            } else if (failingGrades <= 2) {
              femaleConditional += 1
              action = 'Conditional'
            } else {
              femaleRetained += 1
              action = 'Retained'
            }

            if (average <= 74) {
              femaledidNotMeet += 1
            } else if (average >= 75 && average <= 79) {
              femalefairlySatisfactory += 1
            } else if (average >= 80 && average <= 84) {
              femalesatisfactory += 1
            } else if (average >= 85 && average <= 89) {
              femaleverySatisfactory += 1
            } else if (average >= 90 && average <= 100) {
              femaleoutstanding += 1
              average = Math.round(average)
            }
          }
        }

        // First Row
        currentPage.drawText(`${female.lrn}`, { x: 15, y: y + 5, size: 6, bold })
        currentPage.drawText(`${female.lastname}, ${female.firstname}, ${female.middlename}`, { x: 59, y: y + 5, size: 6, bold })
        currentPage.drawText(`${average}`, { x: 250, y: y + 5, size: 6, bold })
        currentPage.drawText(`${action}`, { x: 320, y: y + 5, size: 6, bold })
        currentPage.drawText(`${failingSubjects[0] || ''}`, { x: 400, y: y + 11, size: 4, bold })
        currentPage.drawText(`${failingSubjects[1] || ''}`, { x: 400, y: y + 6, size: 4, bold })
        currentPage.drawText(`${failingSubjects[2] || ''}`, { x: 400, y: y + 1, size: 4, bold })

        currentPage.drawRectangle({
          x: 14,
          y: y,
          width: 487,
          height: 16,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })

        // Vertical Lines for First Row
        currentPage.drawLine({ start: { x: 57, y: y + 16 }, end: { x: 57, y: y }, thickness: 1.5 })
        currentPage.drawLine({ start: { x: 239, y: y + 16 }, end: { x: 239, y: y }, thickness: 1.5 })
        currentPage.drawLine({ start: { x: 300, y: y + 16 }, end: { x: 300, y: y }, thickness: 1.5 })
        currentPage.drawLine({ start: { x: 394, y: y + 16 }, end: { x: 394, y: y }, thickness: 1.5 })

        y -= 16
        rowCount++
      }

      // 4th
      currentPage.drawRectangle({
        x: 14,
        y: y,
        width: 487,
        height: 16,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })

      // Vertical Lines for Second Row
      currentPage.drawLine({ start: { x: 57, y: y + 16 }, end: { x: 57, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 239, y: y + 16 }, end: { x: 239, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 300, y: y + 16 }, end: { x: 300, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 394, y: y + 16 }, end: { x: 394, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 94, y: y + 12 }, end: { x: 116, y: y + 12 }, thickness: 1 })
      currentPage.drawText("TOTAL FEMALE", { x: 145, y: y + 5, size: 6, bold })
      currentPage.drawText(`${femalesCount}`, { x: 215, y: y + 5, size: 9, bold })

      y -= 16
      currentPage.drawRectangle({
        x: 14,
        y: y,
        width: 487,
        height: 16,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })

      // Vertical Lines for Second Row
      currentPage.drawLine({ start: { x: 57, y: y + 16 }, end: { x: 57, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 239, y: y + 16 }, end: { x: 239, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 300, y: y + 16 }, end: { x: 300, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 394, y: y + 16 }, end: { x: 394, y: y }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 94, y: y + 12 }, end: { x: 116, y: y + 12 }, thickness: 1 })
      currentPage.drawText("COMBINED", { x: 145, y: y + 5, size: 6, bold })
      currentPage.drawText(`${malesCount + femalesCount}`, { x: 215, y: y + 5, size: 9, bold })


      // Summary Table
      drawRectangle(506.5, 265, 206, 119)
      page.drawLine({ start: { x: 506.5, y: 369 }, end: { x: 712.5, y: 369 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 354 }, end: { x: 712.5, y: 354 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 325 }, end: { x: 712.5, y: 325 }, thickness: 1 })
      page.drawLine({ start: { x: 506.5, y: 294.5 }, end: { x: 712.5, y: 294.5 }, thickness: 1 })

      // Summary Table Vertical Lines
      page.drawLine({ start: { x: 564, y: 369 }, end: { x: 564, y: 265 }, thickness: 1 })
      page.drawLine({ start: { x: 595.5, y: 369 }, end: { x: 595.5, y: 265 }, thickness: 1 })
      page.drawLine({ start: { x: 628.5, y: 369 }, end: { x: 628.5, y: 265 }, thickness: 1 })

      // Summary Table Text Details
      page.drawText("SUMMARY TABLE", { x: 577, y: 375, size: 7, font })
      page.drawText("STATUS", { x: 523, y: 359.5, size: 6, font })
      page.drawText("MALE", { x: 571, y: 359.5, size: 6, font })
      page.drawText("FEMALE", { x: 600, y: 359.5, size: 6, font })
      page.drawText("TOTAL", { x: 660, y: 359.5, size: 6, font })
      page.drawText("PROMOTED", { x: 518, y: 338, size: 6, font })
      page.drawText(`${malePromoted}`, { x: 575, y: 338, size: 9, font })
      page.drawText(`${femalePromoted}`, { x: 608, y: 338, size: 9, font })
      page.drawText(`${malePromoted + femalePromoted}`, { x: 665, y: 338, size: 9, font })

      page.drawText("*Conditional", { x: 518, y: 308, size: 6, font })
      page.drawText(`${maleConditional}`, { x: 575, y: 308, size: 9, font })
      page.drawText(`${femaleConditional}`, { x: 608, y: 308, size: 9, font })
      page.drawText(`${maleConditional + femaleConditional}`, { x: 665, y: 308, size: 9, font })

      page.drawText("RETAINED", { x: 520, y: 279, size: 6, font })
      page.drawText(`${maleRetained}`, { x: 575, y: 279, size: 9, font })
      page.drawText(`${femaleRetained}`, { x: 608, y: 279, size: 9, font })
      page.drawText(`${femaleRetained + maleRetained}`, { x: 665, y: 279, size: 9, font })

      // LEARNING PROGRESS AND ACHIEVEMENT
      drawRectangle(506.5, 73, 206, 178)
      page.drawLine({ start: { x: 506.5, y: 235.5 }, end: { x: 712.5, y: 235.5 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 221 }, end: { x: 712.5, y: 221 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 192 }, end: { x: 712.5, y: 192 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 162 }, end: { x: 712.5, y: 162 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 132 }, end: { x: 712.5, y: 132 }, thickness: .5 })
      page.drawLine({ start: { x: 506.5, y: 102 }, end: { x: 712.5, y: 102 }, thickness: .5 })

      // LEARNING PROGRESS AND ACHIEVEMENT Vertical Lines
      page.drawLine({ start: { x: 564, y: 235 }, end: { x: 564, y: 73 }, thickness: 1 })
      page.drawLine({ start: { x: 595.5, y: 235 }, end: { x: 595.5, y: 73 }, thickness: 1 })
      page.drawLine({ start: { x: 628.5, y: 235 }, end: { x: 628.5, y: 73 }, thickness: 1 })

      // LEARNING PROGRESS AND ACHIEVEMENT TEXTS
      page.drawText("LEARNING PROGRESS AND ACHIEVEMENT (Based on Learners' General Average)", { x: 511, y: 242, size: 5, font })
      page.drawText("Descriptors & Grading", { x: 510, y: 229, size: 5, font })
      page.drawText("Scale", { x: 510, y: 223, size: 5, font })
      page.drawText("Did Not Meet", { x: 510, y: 213, size: 6, font })
      page.drawText("Expectations (74", { x: 510, y: 203, size: 6, font })
      page.drawText("and below)", { x: 510, y: 193, size: 6, font })
      page.drawText(`${maledidNotMeet}`, { x: 575, y: 203, size: 9, font })
      page.drawText(`${femaledidNotMeet}`, { x: 608, y: 203, size: 9, font })
      page.drawText(`${femaledidNotMeet + maledidNotMeet}`, { x: 665, y: 203, size: 9, font })

      page.drawText("Fairly Satisfactory", { x: 510, y: 180, size: 6, font })
      page.drawText("(75-79)", { x: 515, y: 173, size: 6, font })
      page.drawText(`${malefairlySatisfactory}`, { x: 575, y: 173, size: 9, font })
      page.drawText(`${femalefairlySatisfactory}`, { x: 608, y: 173, size: 9, font })
      page.drawText(`${femalefairlySatisfactory + malefairlySatisfactory}`, { x: 665, y: 173, size: 9, font })

      page.drawText("Satisfactory", { x: 510, y: 150, size: 6, font })
      page.drawText("(80-84)", { x: 515, y: 143, size: 6, font })
      page.drawText(`${malesatisfactory}`, { x: 575, y: 143, size: 9, font })
      page.drawText(`${femalesatisfactory}`, { x: 608, y: 143, size: 9, font })
      page.drawText(`${femalesatisfactory + malesatisfactory}`, { x: 665, y: 143, size: 9, font })

      page.drawText("Very Satisfactory", { x: 510, y: 117, size: 6, font })
      page.drawText("(85-89)", { x: 515, y: 110, size: 6, font })
      page.drawText(`${maleverySatisfactory}`, { x: 575, y: 110, size: 9, font })
      page.drawText(`${femaleverySatisfactory}`, { x: 608, y: 110, size: 9, font })
      page.drawText(`${femaleverySatisfactory + maleverySatisfactory}`, { x: 665, y: 110, size: 9, font })

      page.drawText("Outstanding", { x: 510, y: 95, size: 6, font })
      page.drawText("(90-100)", { x: 515, y: 88, size: 6, font })
      page.drawText(`${maleoutstanding}`, { x: 575, y: 88, size: 9, font })
      page.drawText(`${femaleoutstanding}`, { x: 608, y: 88, size: 9, font })
      page.drawText(`${femaleoutstanding + maleoutstanding}`, { x: 665, y: 88, size: 9, font })


      // 2nd Page Right Side
      page2.drawText("PREPARED BY:", { x: 510, y: 395, size: 7, font })
      page2.drawLine({ start: { x: 510, y: 375 }, end: { x: 712, y: 375 }, thickness: .5 })
      page2.drawText("Class Adviser", { x: 585, y: 365, size: 6, bold })
      page2.drawText(`${section.adviser?.last_name} ${section.adviser?.first_name} ${section.adviser?.middle_name}`, { x: 575, y: 380, size: 6, bold })
      page2.drawText("(Name and Signature)", { x: 575, y: 355, size: 6, bold })

      page2.drawText("CERTIFIED CORRECT & SUBMITTED:", { x: 510, y: 325, size: 7, font })
      page2.drawLine({ start: { x: 510, y: 305 }, end: { x: 712, y: 305 }, thickness: .5 })
      page2.drawText("School Head", { x: 585, y: 295, size: 6, font })
      page2.drawText("(Name and Signature)", { x: 575, y: 285, size: 6, bold })

      page2.drawText("REVIEWED BY", { x: 510, y: 255, size: 7, font })
      page2.drawLine({ start: { x: 510, y: 235 }, end: { x: 712, y: 235 }, thickness: .5 })
      page2.drawText("Division Representative", { x: 575, y: 215, size: 6, font })
      page2.drawText("(Name and Signature)", { x: 575, y: 205, size: 6, bold })

      page2.drawText("GUIDELINES:", { x: 510, y: 195, size: 6, font })
      page2.drawText("1. Do not inlcude Dropouts and Transferred Out (D.O.4, 2014)", { x: 510, y: 185, size: 5, font })
      page2.drawText("2. To be prepared by the Adviser. The Adviser should indicate the General Average based on", { x: 510, y: 175, size: 5, bold })
      page2.drawText("the learner's Form 138", { x: 510, y: 168, size: 5, bold })
      page2.drawText("3. On the summary table, reflect the total number of learners PROMOTED (Final Grade of at", { x: 510, y: 158, size: 5, bold })
      page2.drawText("least 75 in ALL learning areas), RETAINED (Did Not Meet Expectations in three (3) or more ", { x: 510, y: 151, size: 5, bold })
      page2.drawText("learning areas) and *CONDITIONAL (*Did Not Meet Expectations in not more than two (2) ", { x: 510, y: 144, size: 5, bold })
      page2.drawText("learning areas) and the Learning Progress and Achievement according to the individual ", { x: 510, y: 137, size: 5, bold })
      page2.drawText("General Average. All provisions on classroom assessment and the grading system in the said ", { x: 510, y: 130, size: 5, bold })
      page2.drawText("Order shall be in effect for all grade levels - Deped Order 29, s. 2015.", { x: 510, y: 123, size: 5, bold })

      page2.drawText("4. Did Not Meet Expectations of the Learning Areas. This refers to learning area/s that the", { x: 510, y: 113, size: 5, bold })
      page2.drawText("learner had failed as of end of current SY. The learner may be for remediation or retention", { x: 510, y: 106, size: 5, bold })

      page2.drawText("5. Protocols of validation & submission is under the discretion of the Schools Division ", { x: 510, y: 96, size: 5, bold })
      page2.drawText("Superintendent", { x: 510, y: 89, size: 5, bold })

      page2.drawText("School Form 5: Page ____ of ________", { x: 600, y: 69, size: 5, bold })





      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      setPdfURL(url)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }


  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex justify-center items-center z-40'
      onClick={onClose}>
      <div className='bg-white md:p-5 rounded-lg w-[100%] h-auto p-3 md:w-[90%] max-w-[1500px] md:h-[80vh] max-h-[90vh] text-center relative flex flex-col overflow-y-auto sm:w-[95%] sm:h-[70vh]'>
        <button className='absolute top-[10px] right-[10px] cursor-pointer text-base md:text-2xl border-none bg-none sm:text-lg' onClick={onClose}>✖</button>
        {true ? (
          <iframe src={pdfURL} width="100%" height="2000px" />
        ) : (
          <p>Generating PDF...</p>
        )}
      </div>
    </div>
  )

}

export default GenerateSF5