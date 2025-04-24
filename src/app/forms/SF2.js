'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import React, { useState, useEffect } from 'react'

const GenerateSF2 = ({ onClose, students, section, date }) => {
  
  const [pdfURL, setPdfURL] = useState(null)
  const section_name = section[0]?.section_name
  const grade_level = section[0]?.class_id
  const adviser = `${section[0]?.adviser?.first_name} ${section[0]?.adviser?.last_name}`
  const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  let selectedMonth = months[date.month]

  const absentCoordinates = [
    [176, 191], [191, 206], [206, 221], [221, 236], [236, 251],
    [251, 266], [266, 281], [281, 296], [296, 311], [311, 328],
    [328, 341], [341, 356], [356, 371], [371, 386], [386, 404],
    [404, 416], [416, 431], [431, 446], [446, 461], [461, 480],
    [480, 495], [495, 510], [510, 525], [525, 540], [540, 555]
  ]

  const tardyCoordinates = [
    177, 192, 207, 222, 237, 252, 267, 282, 297, 312,
    329, 342, 357, 372, 387, 405, 417, 432, 447, 462,
    481, 496, 511, 526, 541
  ]

  const cuttingCoordinates = [
    177, 192, 207, 222, 237, 252, 267, 282, 297, 312,
    328, 342, 357, 372, 387, 403, 417, 432, 447, 462,
    480, 495, 510, 525, 540
  ]

  const getWeekdaysInMonth = (year, month) => {
    const weekdays = []
    const daysInMonth = new Date(year, month, 0).getDate() // Get total days in month

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day) // Month is 0-indexed
      const dayOfWeek = date.getDay() // 0 = Sunday, 6 = Saturday

      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        weekdays.push({ date: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`, dayOfWeek })
      }
    }
    return weekdays
  }

  const updateStudentAttendance = (students, year, month) => {
    const weekdays = getWeekdaysInMonth(year, month).map(w => w.date) // Extract only dates

    return students.map(student => {
      const existingDates = new Set(student.attendance.map(a => a.date)) // Store existing attendance dates

      // Add only missing weekday dates with status "P"
      const updatedAttendance = [
        ...student.attendance,
        ...weekdays.filter(date => !existingDates.has(date)).map(date => ({ date, status: "Q" }))
      ]

      // Sort by date in ascending order
      updatedAttendance.sort((a, b) => new Date(a.date) - new Date(b.date))

      return { ...student, attendance: updatedAttendance }
    })
  }

  const filterBySex = (arr) => {
    const sortByFullName = (a, b) => {
      return (
        (a.lastname || "").localeCompare(b.lastname || "", "en", { sensitivity: "base" }) ||
        (a.firstname || "").localeCompare(b.firstname || "", "en", { sensitivity: "base" }) ||
        (a.middlename || "").localeCompare(b.middlename || "", "en", { sensitivity: "base" })
      )
    }

    const males = arr
      .filter(student => student.sex === "M")
      .sort(sortByFullName)

    const females = arr
      .filter(student => student.sex === "F")
      .sort(sortByFullName)

    return { males, females }
  }

  const drawCuttingTriangle = (x, y, page) => {
    page.drawLine({ start: { x: x + 13, y: y - 3 }, end: { x, y: y - 3 }, thickness: 1.5 })
    page.drawLine({ start: { x: x + 13, y: y - 4 }, end: { x: x + 13, y: y + 10 }, thickness: 1.5 })
    page.drawLine({ start: { x: x + 13, y: y + 8 }, end: { x: x + 2, y: y - 3 }, thickness: 1.5 })
    page.drawLine({ start: { x: x + 13, y: y + 6 }, end: { x: x + 4, y: y - 3 }, thickness: 3.5 })
    page.drawLine({ start: { x: x + 10, y: y + 5 }, end: { x: x + 10, y: y - 3 }, thickness: 5.2 })
  }

  const drawTardyTriangle = (x, y, page) => {
    page.drawLine({ start: { x, y: y + 11 }, end: { x, y: y - 3 }, thickness: 1.5 })
    page.drawLine({ start: { x, y: y + 10 }, end: { x: x + 13, y: y + 10 }, thickness: 1.5 })
    page.drawLine({ start: { x: x + 11, y: y + 10 }, end: { x, y: y - 1 }, thickness: 1.5 })
    page.drawLine({ start: { x: x + 9, y: y + 10 }, end: { x, y: y + 1 }, thickness: 3.5 })
    page.drawLine({ start: { x: x + 3, y: y + 11 }, end: { x: x + 3, y: y + 3 }, thickness: 5.2 })
  }

  useEffect(() => {
    generatePDF()
  }, [])

  const generatePDF = async () => {

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([792, 612])
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

      const startX = 30  // Left margin
      let startY = 400 // Starting Y position
      let currentPage = pdfDoc.getPage(0)
      let rowCount = 0
      let pageCount = 1
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

      // Header START
      page.drawText('School Form 2 (SF2) Daily Attendance Report of Learners', { x: 235, y: 548, size: 11, font, color: rgb(0, 0, 0) })
      page.drawText('(This replaces Form 1, Form 2 & STS Form 4 - Absenteeism and Dropout Profile)', { x: 260, y: 535, size: 7 })

      page.drawText('School ID  301094', { x: 82, y: 512, size: 9, bold })
      drawRectangle(123, 504, 75, 21)

      page.drawText('Name of School  Calubcub 1st National High School', { x: 57, y: 487, size: 9, bold })
      drawRectangle(123, 479, 227, 21)

      page.drawText('School Year', { x: 209, y: 512, size: 9, bold })
      page.drawText(`2025`, { x: 280, y: 511, size: 12, bold })
      drawRectangle(275, 504, 75, 21)

      page.drawText('Report for the Month of', { x: 376, y: 512, size: 9, bold })
      page.drawText(`${selectedMonth}`, { x: 476, y: 512, size: 9, bold })
      drawRectangle(471, 504, 105, 21)

      page.drawText('Grade Level', { x: 420, y: 487, size: 9, bold })
      page.drawText(String(grade_level) || '', { x: 482, y: 486, size: 12, bold })
      drawRectangle(471, 479, 32, 21)

      page.drawText('Section', { x: 519, y: 487, size: 9, bold })
      page.drawText(section_name || '', { x: 555, y: 487, size: 9, bold })
      drawRectangle(551, 479, 140, 21)


      // Header texts
      page.drawText("LEARNER'S NAME", { x: 45, y: 460, size: 10, font })
      page.drawText("(Last Name, First Name, Middle Name)", { x: 25, y: 445, size: 8, font })

      page.drawText("(1st row for date)", { x: 345, y: 467, size: 6, font })

      // fill up form || Columns
      drawRectangle(14, 438, 740, 37)
      page.drawLine({ start: { x: 176, y: 475 }, end: { x: 176, y: 438 }, thickness: 1.5 })

      // Horizontal Line for (1st row for date)
      page.drawLine({ start: { x: 176, y: 464 }, end: { x: 556, y: 464 }, thickness: 1.5 })

      // Vertical Line for weekdays
      page.drawLine({ start: { x: 252, y: 464 }, end: { x: 252, y: 438 }, thickness: 1.5 })
      page.drawLine({ start: { x: 328, y: 464 }, end: { x: 328, y: 438 }, thickness: 1.5 })
      page.drawLine({ start: { x: 404, y: 464 }, end: { x: 404, y: 438 }, thickness: 1.5 })
      page.drawLine({ start: { x: 480, y: 464 }, end: { x: 480, y: 438 }, thickness: 1.5 })
      page.drawLine({ start: { x: 556, y: 475 }, end: { x: 556, y: 438 }, thickness: 1.5 })

      // Horizontal Line for weekdays
      page.drawLine({ start: { x: 176, y: 451 }, end: { x: 556, y: 451 }, thickness: 0.5 })

      // Vertical Line for each weekday
      page.drawLine({ start: { x: 191, y: 464 }, end: { x: 191, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 206, y: 464 }, end: { x: 206, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 221, y: 464 }, end: { x: 221, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 236, y: 464 }, end: { x: 236, y: 438 }, thickness: 0.5 })

      page.drawLine({ start: { x: 266, y: 464 }, end: { x: 266, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 281, y: 464 }, end: { x: 281, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 296, y: 464 }, end: { x: 296, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 311, y: 464 }, end: { x: 311, y: 438 }, thickness: 0.5 })

      page.drawLine({ start: { x: 341, y: 464 }, end: { x: 341, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 356, y: 464 }, end: { x: 356, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 371, y: 464 }, end: { x: 371, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 386, y: 464 }, end: { x: 386, y: 438 }, thickness: 0.5 })

      page.drawLine({ start: { x: 416, y: 464 }, end: { x: 416, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 431, y: 464 }, end: { x: 431, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 446, y: 464 }, end: { x: 446, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 461, y: 464 }, end: { x: 461, y: 438 }, thickness: 0.5 })

      page.drawLine({ start: { x: 495, y: 464 }, end: { x: 495, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 510, y: 464 }, end: { x: 510, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 525, y: 464 }, end: { x: 525, y: 438 }, thickness: 0.5 })
      page.drawLine({ start: { x: 540, y: 464 }, end: { x: 540, y: 438 }, thickness: 0.5 })

      // Total for the Month
      page.drawLine({ start: { x: 580, y: 454 }, end: { x: 580, y: 438 }, thickness: 1.5 })
      page.drawLine({ start: { x: 607, y: 475 }, end: { x: 607, y: 438 }, thickness: 1.5 })

      // Horizontal Line for Total of the Month
      page.drawLine({ start: { x: 556, y: 454 }, end: { x: 607, y: 454 }, thickness: 0.5 })
      // Total for the Month
      page.drawText("Total for the", { x: 562, y: 466, size: 7, font })
      page.drawText("Month", { x: 572, y: 458, size: 7, font })

      page.drawText("ABSENT", { x: 558, y: 444, size: 5, font })

      page.drawText("TARDY", { x: 584, y: 444, size: 6, font })

      page.drawText("REMARKS (If DROPPED OUT, state reason,", { x: 620, y: 468, size: 6, font })
      page.drawText("please refer to legend number 2.", { x: 635, y: 460, size: 6, font })
      page.drawText("If TRANSFERRED IN/OUT, write the name of", { x: 620, y: 449, size: 6, font })
      page.drawText(" School.)", { x: 670, y: 442, size: 6, font })
      // Header ENDDD



      // Monday to Friday
      const daysX = [180, 196, 210, 223, 241, 255, 270, 285, 298, 317, 331, 346, 360, 373, 392, 407, 420, 435, 448, 467, 485, 500, 514, 528, 546]
      const days = ["M", "T", "W", "TH", "F"]

      // Draw days of the week (Monday to Friday)
      daysX.forEach((x, i) => {
        page.drawText(days[i % days.length], { x, y: 442, size: 7, font })
      })

      // Base X position and step
      let dateStepX = 15.21

      const weekdaysWithX = getWeekdaysInMonth(date.year, date.month)
      const firstWeekday = weekdaysWithX[0].dayOfWeek
      let dateStartX = 178 + (firstWeekday - 1) * dateStepX

      // Map weekdays with X positions
      const updatedWeekdays = weekdaysWithX.map((item, i) => ({
        ...item,
        x: dateStartX + i * dateStepX
      }))

      updatedWeekdays.forEach((item) => {
        const dayNumber = item.date.split("-")[2]
        page.drawText(dayNumber, { x: item.x, y: 455, size: 7, font })
      })

      let y = 427
      let schoolDaysCount = students[0].attendance.length
      let maleconsAbsentCount = 0
      let femaleconsAbsentCount = 0
      const test = filterBySex(updateStudentAttendance(students, date.year, date.month))
      const maleCount = test.males.length
      const femaleCount = test.females.length

      // MALE START

      let rowMaleCount = 1
      let overallMaleAbsentCount = 0
      let overallMaleTardyCount = 0
      let maleTotalStats = [
        [0, 178], [0, 193.21], [0, 208.42], [0, 223.63], [0, 238.84],
        [0, 254.05], [0, 269.26], [0, 284.47], [0, 299.68], [0, 314.89],
        [0, 330.10], [0, 345.31], [0, 360.52], [0, 375.73], [0, 390.94],
        [0, 406.15], [0, 421.36], [0, 436.57], [0, 451.78], [0, 466.99],
        [0, 482.20], [0, 497.41], [0, 512.62], [0, 527.83], [0, 543.04]
      ]

      for (let index = 0; index < test.males.length; index++) {
        if (rowCount >= 25) {
          currentPage = pdfDoc.addPage([792, 612])
          pageCount++
          rowCount = 0
          y = 550
        }

        let male = test.males[index]
        let i = firstWeekday - 1
        let absentCount = 0
        let tardyCount = 0
        let absentStreak = 0

        currentPage.drawRectangle({
          x: 14,
          y: y - 4,
          width: 740,
          height: 15,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })
        currentPage.drawLine({ start: { x: 28, y: y + 11 }, end: { x: 28, y: y - 4 }, thickness: 0.5 })
        currentPage.drawText(`${male.lastname}, ${male.firstname} ${male.middlename}`, { x: 29, y, size: 8, bold })
        currentPage.drawText(`${rowMaleCount}`, { x: 16, y, size: 8, bold })

        male.attendance.forEach(attendance => {
          if (attendance.status === 'P') {
            maleTotalStats[i][0]++
            absentStreak = 0
            i++
          } else if (attendance.status === 'A') {
            currentPage.drawLine({ start: { x: absentCoordinates[i][0], y: y + 11 }, end: { x: absentCoordinates[i][1], y: y - 4 }, thickness: 1.5 })
            absentCount++
            absentStreak++
            if (absentStreak >= 5) {
              maleconsAbsentCount++
            }
            i++
          } else if (attendance.status === 'T') {
            drawTardyTriangle(tardyCoordinates[i], y, currentPage)
            tardyCount++
            absentStreak = 0
            i++
          } else if (attendance.status === 'C') {
            drawCuttingTriangle(cuttingCoordinates[i], y, currentPage)
            absentStreak = 0
            i++
          } else {
            i++
          }
        })



        // Vertical lines for weekdays
        const verticalLines = [176, 252, 328, 404, 480, 556, 580, 607]
        verticalLines.forEach(x => {
          currentPage.drawLine({ start: { x, y: y + 11 }, end: { x, y: y - 4 }, thickness: 1.5 })
        })

        // Inner weekday separators
        const thinLines = [
          191, 206, 221, 236, 266, 281, 296, 311, 341, 356, 371, 386,
          416, 431, 446, 461, 495, 510, 525, 540
        ]
        thinLines.forEach(x => {
          currentPage.drawLine({ start: { x, y: y + 11 }, end: { x, y: y - 4 }, thickness: 0.5 })
        })

        // Checkmarks for attendance
        const checkmarks = [
          [191, 176], [206, 191], [221, 206], [236, 221], [251, 236],
          [266, 251], [281, 266], [296, 281], [311, 296], [326, 311],
          [342, 328], [356, 341], [371, 356], [386, 371], [401, 386],
          [416, 404], [431, 416], [446, 431], [461, 446], [476, 461],
          [494, 479], [509, 494], [524, 509], [540, 524], [555, 539]
        ]

        checkmarks.forEach(([startX, endX]) => {
          currentPage.drawLine({ start: { x: startX, y: y + 11 }, end: { x: endX, y: y - 4 }, thickness: 1.5 })
        })


        currentPage.drawText(`${absentCount}`, { x: 563, y: y, size: 8, font })
        currentPage.drawText(`${tardyCount}`, { x: 588, y: y, size: 8, font })
        currentPage.drawText(`${male.remarks.sf1||''}`, { x: 615, y: y, size: 8, font })

        overallMaleAbsentCount += absentCount
        overallMaleTardyCount += tardyCount

        y -= 15
        rowMaleCount++
        rowCount++
      }

      maleTotalStats.forEach(([count, x]) => {
        if (count > 0) {
          currentPage.drawText(`${count}`, { x, y, size: 8, font })
        }
      })


      // START MALE | TOTAL Per Day
      currentPage.drawRectangle({
        x: 14,
        y: y - 4,
        width: 740,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })
      currentPage.drawLine({ start: { x: 176, y: y - 4 }, end: { x: 176, y: y + 11 }, thickness: 1.5 })

      // Vertical Lines for Weekdays on second row
      currentPage.drawLine({ start: { x: 252, y: y - 4 }, end: { x: 252, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 328, y: y - 4 }, end: { x: 328, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 404, y: y - 4 }, end: { x: 404, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 480, y: y - 4 }, end: { x: 480, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 556, y: y - 4 }, end: { x: 556, y: y + 11 }, thickness: 1.5 })

      // Vertical Lines for each weekday on second row
      currentPage.drawLine({ start: { x: 191, y: y - 4 }, end: { x: 191, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 206, y: y - 4 }, end: { x: 206, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 221, y: y - 4 }, end: { x: 221, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 236, y: y - 4 }, end: { x: 236, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 266, y: y - 4 }, end: { x: 266, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 281, y: y - 4 }, end: { x: 281, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 296, y: y - 4 }, end: { x: 296, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 311, y: y - 4 }, end: { x: 311, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 341, y: y - 4 }, end: { x: 341, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 356, y: y - 4 }, end: { x: 356, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 371, y: y - 4 }, end: { x: 371, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 386, y: y - 4 }, end: { x: 386, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 416, y: y - 4 }, end: { x: 416, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 431, y: y - 4 }, end: { x: 431, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 446, y: y - 4 }, end: { x: 446, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 461, y: y - 4 }, end: { x: 461, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 495, y: y - 4 }, end: { x: 495, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 510, y: y - 4 }, end: { x: 510, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 525, y: y - 4 }, end: { x: 525, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: y - 4 }, end: { x: 540, y: y + 11 }, thickness: 0.5 })

      // Total of the Month of Second Row
      currentPage.drawLine({ start: { x: 580, y: y - 4 }, end: { x: 580, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 607, y: y - 4 }, end: { x: 607, y: y + 11 }, thickness: 1.5 })
      currentPage.drawText(`${overallMaleAbsentCount}`, { x: 563, y, size: 8, font })
      currentPage.drawText(`${overallMaleTardyCount}`, { x: 588, y, size: 8, font })

      // Second Row Text
      currentPage.drawText("MALE | TOTAL Per Day", { x: 55, y, size: 7, font })
      rowCount++
      // END MALE ROW



      // FEMALE START
      let rowFemaleCount = 1
      let overallFemaleAbsentCount = 0
      let overallFemaleTardyCount = 0
      y -= 15
      let femaleTotalStats = [
        [0, 178], [0, 193.21], [0, 208.42], [0, 223.63], [0, 238.84],
        [0, 254.05], [0, 269.26], [0, 284.47], [0, 299.68], [0, 314.89],
        [0, 330.10], [0, 345.31], [0, 360.52], [0, 375.73], [0, 390.94],
        [0, 406.15], [0, 421.36], [0, 436.57], [0, 451.78], [0, 466.99],
        [0, 482.20], [0, 497.41], [0, 512.62], [0, 527.83], [0, 543.04]
      ]

      for (let index = 0; index < test.females.length; index++) {
        if (rowCount >= 25) {
          currentPage = pdfDoc.addPage([792, 612])
          pageCount++
          rowCount -= 25
          y = 550
        }

        let female = test.females[index]
        let i = firstWeekday - 1
        let absentCount = 0
        let tardyCount = 0
        let absentStreak = 0

        currentPage.drawRectangle({
          x: 14,
          y: y - 4,
          width: 740,
          height: 15,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })
        currentPage.drawLine({ start: { x: 28, y: y + 11 }, end: { x: 28, y: y - 4 }, thickness: 0.5 })
        currentPage.drawText(`${female.lastname}, ${female.firstname} ${female.middlename}`, { x: 29, y, size: 8, bold })
        currentPage.drawText(`${rowFemaleCount}`, { x: 16, y, size: 8, bold })

        female.attendance.forEach(attendance => {
          if (attendance.status === 'P') {
            femaleTotalStats[i][0]++
            absentStreak = 0
            i++
          } else if (attendance.status === 'A') {
            currentPage.drawLine({ start: { x: absentCoordinates[i][0], y: y + 11 }, end: { x: absentCoordinates[i][1], y: y - 4 }, thickness: 1.5 })
            absentCount++
            absentStreak++
            if (absentStreak >= 5) {
              femaleconsAbsentCount++
            }
            i++
          } else if (attendance.status === 'T') {
            drawTardyTriangle(tardyCoordinates[i], y, currentPage)
            tardyCount++
            absentStreak = 0
            i++
          } else if (attendance.status === 'C') {
            drawCuttingTriangle(cuttingCoordinates[i], y, currentPage)
            absentStreak = 0
            i++
          } else {
            i++
          }
        })

        // Vertical lines for weekdays
        const verticalLines = [176, 252, 328, 404, 480, 556, 580, 607]
        verticalLines.forEach(x => {
          currentPage.drawLine({ start: { x, y: y + 11 }, end: { x, y: y - 4 }, thickness: 1.5 })
        })

        // Inner weekday separators
        const thinLines = [
          191, 206, 221, 236, 266, 281, 296, 311, 341, 356, 371, 386,
          416, 431, 446, 461, 495, 510, 525, 540
        ]
        thinLines.forEach(x => {
          currentPage.drawLine({ start: { x, y: y + 11 }, end: { x, y: y - 4 }, thickness: 0.5 })
        })

        // Checkmarks for attendance
        const checkmarks = [
          [191, 176], [206, 191], [221, 206], [236, 221], [251, 236],
          [266, 251], [281, 266], [296, 281], [311, 296], [326, 311],
          [342, 328], [356, 341], [371, 356], [386, 371], [401, 386],
          [416, 404], [431, 416], [446, 431], [461, 446], [476, 461],
          [494, 479], [509, 494], [524, 509], [540, 524], [555, 539]
        ]

        checkmarks.forEach(([startX, endX]) => {
          currentPage.drawLine({ start: { x: startX, y: y + 11 }, end: { x: endX, y: y - 4 }, thickness: 1.5 })
        })

        currentPage.drawText(`${absentCount}`, { x: 563, y: y, size: 8, font })
        currentPage.drawText(`${tardyCount}`, { x: 588, y: y, size: 8, font })
        currentPage.drawText(`${female.remarks.sf1||''}`, { x: 615, y: y, size: 8, font })
        
        overallFemaleAbsentCount += absentCount
        overallFemaleTardyCount += tardyCount

        y -= 15
        rowFemaleCount++
        rowCount++
      }

      femaleTotalStats.forEach(([count, x]) => {
        if (count > 0) {
          currentPage.drawText(`${count}`, { x, y, size: 8, font })
        }
      })

      // START FEMALE | TOTAL Per Day
      currentPage.drawRectangle({
        x: 14,
        y: y - 4,
        width: 740,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })
      currentPage.drawLine({ start: { x: 176, y: y - 4 }, end: { x: 176, y: y + 11 }, thickness: 1.5 })

      // Vertical Lines for Weekdays on second row
      currentPage.drawLine({ start: { x: 252, y: y - 4 }, end: { x: 252, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 328, y: y - 4 }, end: { x: 328, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 404, y: y - 4 }, end: { x: 404, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 480, y: y - 4 }, end: { x: 480, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 556, y: y - 4 }, end: { x: 556, y: y + 11 }, thickness: 1.5 })

      // Vertical Lines for each weekday on second row
      currentPage.drawLine({ start: { x: 191, y: y - 4 }, end: { x: 191, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 206, y: y - 4 }, end: { x: 206, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 221, y: y - 4 }, end: { x: 221, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 236, y: y - 4 }, end: { x: 236, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 266, y: y - 4 }, end: { x: 266, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 281, y: y - 4 }, end: { x: 281, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 296, y: y - 4 }, end: { x: 296, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 311, y: y - 4 }, end: { x: 311, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 341, y: y - 4 }, end: { x: 341, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 356, y: y - 4 }, end: { x: 356, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 371, y: y - 4 }, end: { x: 371, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 386, y: y - 4 }, end: { x: 386, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 416, y: y - 4 }, end: { x: 416, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 431, y: y - 4 }, end: { x: 431, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 446, y: y - 4 }, end: { x: 446, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 461, y: y - 4 }, end: { x: 461, y: y + 11 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 495, y: y - 4 }, end: { x: 495, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 510, y: y - 4 }, end: { x: 510, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 525, y: y - 4 }, end: { x: 525, y: y + 11 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: y - 4 }, end: { x: 540, y: y + 11 }, thickness: 0.5 })

      // Total of the Month of Second Row
      currentPage.drawLine({ start: { x: 580, y: y - 4 }, end: { x: 580, y: y + 11 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 607, y: y - 4 }, end: { x: 607, y: y + 11 }, thickness: 1.5 })
      currentPage.drawText(`${overallFemaleAbsentCount}`, { x: 563, y, size: 8, font })
      currentPage.drawText(`${overallFemaleTardyCount}`, { x: 588, y, size: 8, font })

      // Second Row Text
      currentPage.drawText("FEMALE | TOTAL Per Day", { x: 55, y, size: 7, font })
      rowCount++
      // END FEMALE ROW


      // Fourth Row: Combined TOTAL PER DAY
      currentPage.drawRectangle({
        x: 14,
        y: y - 19,
        width: 740,
        height: 15,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })
      currentPage.drawLine({ start: { x: 176, y: y - 4 }, end: { x: 176, y: y - 19 }, thickness: 1.5 })

      // Vertical Lines for Weekdays on fourth row
      currentPage.drawLine({ start: { x: 252, y: y - 4 }, end: { x: 252, y: y - 19 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 328, y: y - 4 }, end: { x: 328, y: y - 19 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 404, y: y - 4 }, end: { x: 404, y: y - 19 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 480, y: y - 4 }, end: { x: 480, y: y - 19 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 556, y: y - 4 }, end: { x: 556, y: y - 19 }, thickness: 1.5 })

      // Vertical Lines for each weekday on fourth row
      currentPage.drawLine({ start: { x: 191, y: y - 4 }, end: { x: 191, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 206, y: y - 4 }, end: { x: 206, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 221, y: y - 4 }, end: { x: 221, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 236, y: y - 4 }, end: { x: 236, y: y - 19 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 266, y: y - 4 }, end: { x: 266, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 281, y: y - 4 }, end: { x: 281, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 296, y: y - 4 }, end: { x: 296, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 311, y: y - 4 }, end: { x: 311, y: y - 19 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 341, y: y - 4 }, end: { x: 341, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 356, y: y - 4 }, end: { x: 356, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 371, y: y - 4 }, end: { x: 371, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 386, y: y - 4 }, end: { x: 386, y: y - 19 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 416, y: y - 4 }, end: { x: 416, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 431, y: y - 4 }, end: { x: 431, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 446, y: y - 4 }, end: { x: 446, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 461, y: y - 4 }, end: { x: 461, y: y - 19 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 495, y: y - 4 }, end: { x: 495, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 510, y: y - 4 }, end: { x: 510, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 525, y: y - 4 }, end: { x: 525, y: y - 19 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: y - 4 }, end: { x: 540, y: y - 19 }, thickness: 0.5 })

      // Total of the Month of Fourth Row
      currentPage.drawLine({ start: { x: 580, y: y - 4 }, end: { x: 580, y: y - 19 }, thickness: 1.5 })
      currentPage.drawLine({ start: { x: 607, y: y - 4 }, end: { x: 607, y: y - 19 }, thickness: 1.5 })

      const overallCombinedTardyCount = overallFemaleTardyCount + overallMaleTardyCount
      const overallCombinedAbsentCount = overallFemaleAbsentCount + overallMaleAbsentCount

      currentPage.drawText(`${overallCombinedAbsentCount}`, { x: 563, y: y - 14, size: 8, font })
      currentPage.drawText(`${overallCombinedTardyCount}`, { x: 588, y: y - 14, size: 8, font })

      // Fourth Row Texts
      currentPage.drawText("Combined TOTAL PER DAY", { x: 42, y: y - 14, size: 8, font })
      let combinedTotalStats = femaleTotalStats.map(([femaleCount, x], i) => {
        let maleCount = maleTotalStats[i][0]
        return [femaleCount + maleCount, x]
      })
      combinedTotalStats.forEach(([count, x]) => {
        if (count > 0) {
          currentPage.drawText(`${count}`, { x, y: y - 14, size: 8, font })
        }
      })

      const maleAverageDailyAttendance = ((maleCount * schoolDaysCount) - overallMaleAbsentCount) / schoolDaysCount

      const femaleAverageDailyAttendance = ((femaleCount * schoolDaysCount) - overallFemaleAbsentCount) / schoolDaysCount

      const maleattendancePercentage = (maleAverageDailyAttendance / maleCount) * 100
      const femaleattendancePercentage = (femaleAverageDailyAttendance / femaleCount) * 100
      const totalattendancePercentage = (maleAverageDailyAttendance + femaleAverageDailyAttendance) / (maleCount + femaleCount) * 100

      rowCount++
      // END

      if (y <= 390) {
        currentPage = pdfDoc.addPage([792, 612])
        pageCount++
      }


      //FOOTER STARTS

      currentPage.drawText("GUIDELINES:", { x: 15, y: 367, size: 7, font })
      currentPage.drawText("1. The attendance shall be accomplished daily. Refer to the codes for checking learners' attendance", { x: 15, y: 357, size: 7, bold })
      currentPage.drawText("2. Dates shall be written in the columns after Learner's Name.", { x: 15, y: 347, size: 7, bold })
      currentPage.drawText("3. To compute the following:", { x: 15, y: 337, size: 7, bold })

      currentPage.drawText("a. Percentage of Enrolment =", { x: 20, y: 325, size: 7, bold })
      currentPage.drawText("b. Average Daily Attendance =", { x: 20, y: 305, size: 7, bold })

      currentPage.drawText("c. Percentage of Attendance for the month =", { x: 20, y: 285, size: 7, bold })

      currentPage.drawText("Registered Learners as of end of the month", { x: 183, y: 330, size: 6, bold })
      currentPage.drawText("_____________________________________", { x: 179, y: 328, size: 6, bold })
      currentPage.drawText("Enrolment as of 1st Friday of the school year", { x: 181, y: 320, size: 6, bold })

      currentPage.drawText("x 100", { x: 310, y: 325, size: 7, bold })

      currentPage.drawText("Total Daily Attendance", { x: 209, y: 312, size: 6, bold })
      currentPage.drawText("_____________________________________", { x: 179, y: 310, size: 6, bold })
      currentPage.drawText("Number of School Days in reporting month", { x: 184, y: 302, size: 6, bold })

      currentPage.drawText("Average daily attendance", { x: 205, y: 294, size: 6, bold })
      currentPage.drawText("_____________________________________", { x: 179, y: 292, size: 6, bold })
      currentPage.drawText("Registered Learners as of end of the month", { x: 183, y: 284, size: 6, bold })

      currentPage.drawText("x 100", { x: 310, y: 289, size: 7, bold })

      currentPage.drawText("4. Every end of the month, the class adviser will submit this form to the office of the principal for recording of", { x: 15, y: 265, size: 7, bold })
      currentPage.drawText("summary table into School Form 4. Once signed by the principal, this form should be returned to the adviser", { x: 15, y: 258, size: 7, bold })

      currentPage.drawText("5. The adviser will provide neccessary interventions including but not limited to home visitation", { x: 15, y: 249, size: 7, bold })
      currentPage.drawText("to learner/s who were absent for 5 consecutive days and/or those at risk of dropping out.", { x: 15, y: 241, size: 7, bold })

      currentPage.drawText("6. Attendance performance of learners will be reflected in Form 137 and Form 138 every grading period.", { x: 15, y: 233, size: 7, bold })
      currentPage.drawText("* Beginning of School Year cut-off report is every 1st Friday of the School Year", { x: 20, y: 225, size: 7, bold })

      // Middle Box Contents
      currentPage.drawRectangle({
        x: 355,
        y: 85,
        width: 170,
        height: 290,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })
      currentPage.drawText("1. CODES FOR CHECKING ATTENDANCE", { x: 357, y: 368, size: 7, font })
      currentPage.drawText("(blank) - Present; (x)- Absent; Tardy (half shaded=", { x: 357, y: 360, size: 7, bold })
      currentPage.drawText("Upper for Late Commer, Lower for Cutting Classes)", { x: 357, y: 352, size: 7, bold })

      currentPage.drawText("2. REASONS/CAUSES FOR DROPPING OUT", { x: 357, y: 342, size: 7, font })
      currentPage.drawText("a. Domestic-Related Factors", { x: 357, y: 332, size: 7, font })
      currentPage.drawText("a.1. Had to take care of siblings", { x: 357, y: 322, size: 7, bold })
      currentPage.drawText("a.2. Early marriage/pregnancy", { x: 357, y: 312, size: 7, bold })
      currentPage.drawText("a.3. Parents' attitude toward schooling", { x: 357, y: 302, size: 7, bold })
      currentPage.drawText("a.4. Family problems", { x: 357, y: 292, size: 7, bold })

      currentPage.drawText("b. Individual-Related Factors", { x: 357, y: 282, size: 7, font })
      currentPage.drawText("b.1. Illness", { x: 357, y: 272, size: 7, bold })
      currentPage.drawText("b.2. Overage", { x: 357, y: 262, size: 7, bold })
      currentPage.drawText("b.3. Death", { x: 357, y: 252, size: 7, bold })
      currentPage.drawText("b.4. Drug Abuse", { x: 357, y: 242, size: 7, bold })
      currentPage.drawText("b.5. Poor academic performance", { x: 357, y: 232, size: 7, bold })
      currentPage.drawText("b.6. Lack of interest/Distractions", { x: 357, y: 222, size: 7, bold })
      currentPage.drawText("b.7. Hunger/Malnutrition", { x: 357, y: 212, size: 7, bold })

      currentPage.drawText("c. School-Related Factors", { x: 357, y: 202, size: 7, font })
      currentPage.drawText("c.1. Teacher Factor", { x: 357, y: 192, size: 7, bold })
      currentPage.drawText("c.2. Physical condition of classroom", { x: 357, y: 182, size: 7, bold })
      currentPage.drawText("c.3. Peer influence", { x: 357, y: 172, size: 7, bold })

      currentPage.drawText("d. Geographic/Environmental", { x: 357, y: 162, size: 7, font })
      currentPage.drawText("d.1. Distance between home and school", { x: 357, y: 152, size: 7, bold })
      currentPage.drawText("d.2. Armed conflict (incl. Tribal wars & clanfeuds)", { x: 357, y: 142, size: 7, bold })
      currentPage.drawText("d.3. Calamities/Disasters", { x: 357, y: 132, size: 7, bold })

      currentPage.drawText("e. Financial-Related", { x: 357, y: 122, size: 7, font })
      currentPage.drawText("e.1. Child labor, work", { x: 357, y: 112, size: 7, bold })

      currentPage.drawText("f. Others (Specify)", { x: 357, y: 102, size: 7, font })


      // Right Box Contents
      currentPage.drawRectangle({
        x: 540,
        y: 105,
        width: 214,
        height: 270,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })

      // Horizontal Lines for Right Box
      currentPage.drawLine({ start: { x: 540, y: 348 }, end: { x: 754, y: 348 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 324 }, end: { x: 754, y: 324 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 300 }, end: { x: 754, y: 300 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 276 }, end: { x: 754, y: 276 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 252 }, end: { x: 754, y: 252 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 228 }, end: { x: 754, y: 228 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 204 }, end: { x: 754, y: 204 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 180 }, end: { x: 754, y: 180 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 156 }, end: { x: 754, y: 156 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 540, y: 132 }, end: { x: 754, y: 132 }, thickness: 0.5 })

      // Vertical Lines for Right Box
      currentPage.drawLine({ start: { x: 607, y: 375 }, end: { x: 607, y: 348 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 672, y: 375 }, end: { x: 672, y: 105 }, thickness: 0.5 })

      // Small Vertical Lines on Summary Part of Right Box
      currentPage.drawLine({ start: { x: 692, y: 360 }, end: { x: 692, y: 105 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 712, y: 360 }, end: { x: 712, y: 105 }, thickness: 0.5 })

      // Small Horizontal Line on Summary Part of Right Box
      currentPage.drawLine({ start: { x: 672, y: 360 }, end: { x: 754, y: 360 }, thickness: 0.5 })

      // Right Box Headers
      currentPage.drawText("Month:", { x: 543, y: 365, size: 7, font })
      currentPage.drawText(`${selectedMonth}`, { x: 555, y: 355, size: 9, font })
      currentPage.drawText("No. of Days of", { x: 613, y: 365, size: 7, font })
      currentPage.drawText("Classes:", { x: 613, y: 355, size: 7, font })
      currentPage.drawText(`${schoolDaysCount}`, { x: 645, y: 353, size: 10, font })

      currentPage.drawText("Summary", { x: 696, y: 365, size: 7, font })
      currentPage.drawText("M", { x: 679, y: 351, size: 7, font })
      currentPage.drawText("F", { x: 700, y: 351, size: 7, font })
      currentPage.drawText("TOTAL", { x: 721, y: 351, size: 7, font })

      // Right Box Contents
      currentPage.drawText("* Enrollment as of (1st Friday of June)", { x: 546, y: 334, size: 7, bold })
      currentPage.drawText(`${maleCount}`, { x: 678, y: 334, size: 7, bold })
      currentPage.drawText(`${femaleCount}`, { x: 698, y: 334, size: 7, bold })
      currentPage.drawText(`${maleCount+femaleCount}`, { x: 728, y: 334, size: 7, bold })
      currentPage.drawText("Late Enrollment", { x: 553, y: 314, size: 7, bold })
      currentPage.drawText(`0`, { x: 678, y: 314, size: 7, bold })
      currentPage.drawText(`0`, { x: 698, y: 314, size: 7, bold })
      currentPage.drawText(`0`, { x: 728, y: 314, size: 7, bold })
      currentPage.drawText("during the month", { x: 604, y: 314, size: 7, font })
      currentPage.drawText("(beyond cut-off)", { x: 582, y: 306, size: 7, bold })

      currentPage.drawText("Registered Learners as of", { x: 543, y: 287, size: 6.3, bold })
      currentPage.drawText("end of the month", { x: 618, y: 287, size: 6.3, font })
      currentPage.drawText(`${maleCount}`, { x: 678, y: 287, size: 7, bold })
      currentPage.drawText(`${femaleCount}`, { x: 698, y: 287, size: 7, bold })
      currentPage.drawText(`${maleCount+femaleCount}`, { x: 728, y: 287, size: 7, bold })

      currentPage.drawText("Percentage of Enrollment as of", { x: 542, y: 263, size: 5.8, bold })
      currentPage.drawText("end of the month", { x: 623, y: 263, size: 5.8, font })

      currentPage.drawText("Average Daily Attendance", { x: 563, y: 238, size: 7, bold })
      currentPage.drawText(`${Math.ceil(maleAverageDailyAttendance)}`, { x: 678, y: 238, size: 7, bold })
      currentPage.drawText(`${Math.ceil(femaleAverageDailyAttendance)}`, { x: 698, y: 238, size: 7, bold })
      currentPage.drawText(`${Math.ceil(femaleAverageDailyAttendance) + Math.ceil(maleAverageDailyAttendance)}`, { x: 728, y: 238, size: 7, bold })

      currentPage.drawText("Percentage of Attendance for the month", { x: 544, y: 214, size: 7, bold })
      currentPage.drawText(`${Math.floor(maleattendancePercentage)}%`, { x: 675, y: 214, size: 7, bold })
      currentPage.drawText(`${Math.floor(femaleattendancePercentage)}%`, { x: 695, y: 214, size: 7, bold })
      currentPage.drawText(`${Math.floor(totalattendancePercentage)}%`, { x: 725, y: 214, size: 7, bold })

      currentPage.drawText("Number of students absent for 5 consecutive days:", { x: 544, y: 190, size: 5.5, bold })
      currentPage.drawText(`${maleconsAbsentCount}`, { x: 678, y: 190, size: 8, bold })
      currentPage.drawText(`${femaleconsAbsentCount}`, { x: 698, y: 190, size: 8, bold })
      currentPage.drawText(`${femaleconsAbsentCount + maleconsAbsentCount}`, { x: 728, y: 190, size: 8, bold })

      currentPage.drawText("Drop out", { x: 588, y: 166, size: 7, font })

      currentPage.drawText("Transferred out", { x: 578, y: 141, size: 7, font })

      currentPage.drawText("Transferred in", { x: 581, y: 117, size: 7, font })

      // Below the Right Box
      currentPage.drawText("I certify that this is a true and correct report", { x: 543, y: 90, size: 6, bold })

      currentPage.drawLine({ start: { x: 590, y: 72 }, end: { x: 720, y: 72 }, thickness: 0.5 })
      currentPage.drawText("(Signature of Teacher over Printed Name)", { x: 599, y: 65, size: 6, bold })
      currentPage.drawText(adviser, { x: 599, y: 73, size: 6, bold })


      currentPage.drawText("Attested by:", { x: 543, y: 45, size: 6, bold })

      currentPage.drawLine({ start: { x: 590, y: 35 }, end: { x: 720, y: 35 }, thickness: 0.5 })
      currentPage.drawText("(Signature of Teacher over Printed Name)", { x: 599, y: 28, size: 6, bold })
      currentPage.drawText(adviser, { x: 599, y: 36, size: 6, bold })

      // School Form 2 : Page ___ of ________
      currentPage.drawText("School Form 2 : Page ___ of ________", { x: 15, y: 35, size: 7, bold })
      currentPage.drawText(`${pageCount}`, { x: 115, y: 36, size: 9, bold })


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

export default GenerateSF2