'use client'

import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

const GenerateSF9B = ({ onClose, student }) => {

  console.log(student)

  const [pdfURL, setPdfURL] = useState(null)

  const core_values = student?.values?.filter(
    (value) =>
      value.class_id === student.section_id.id
  )

  const q1values = core_values.filter((value) => value.quarter === 1)
  const q2values = core_values.filter((value) => value.quarter === 2)
  const q3values = core_values.filter((value) => value.quarter === 3)
  const q4values = core_values.filter((value) => value.quarter === 4)

  const filteredGrades = student.jr_student_grades.filter(
    g => g.class_id.id === student.section_id?.id
  );

  const groupedGrades = [[], [], [], []];

  filteredGrades.forEach(grade => {
    const quarterIndex = grade.quarter - 1;
    if (quarterIndex >= 0 && quarterIndex <= 3) {
      groupedGrades[quarterIndex].push(grade);
    }
  });

  groupedGrades.forEach(grades => {
    grades.sort((a, b) => a.subject_id - b.subject_id);
  });


  useEffect(() => {
    generatePDF()
  }, [])

  const generatePDF = async () => {

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([792, 612])
      const page2 = pdfDoc.addPage([792, 612])
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

      const rowHeight = 20 // Height of each row
      const startX = 30  // Left margin
      let startY = 400 // Starting Y position
      const rowWidth = 840 // Total table width
      let currentPage = pdfDoc.getPage(0)
      let rowCount = 0

      // Fetch the image
      const imageBytes = await fetch('/logo/sf1logo.png').then(res => res.arrayBuffer())
      // Embed the imageG
      const image = await pdfDoc.embedPng(imageBytes)
      const { width, height } = image.scale(0.62) // Resize image
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
      const drawRectangle2 = (x, y, w, h, fill = false) => {
        page2.drawRectangle({
          x: x,
          y: y,
          width: w,
          height: h,
          color: fill ? rgb(0.9, 0.9, 0.9) : undefined,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })
      }

      // Draw the image
      page.drawImage(image, {
        x: 382,
        y: 461,
        width,
        height,
      })

      function drawRotatableText({ page, text, x, y, size = 12, vertical = false }) {
        page.drawText(text, {
          x,
          y,
          size,
          color: rgb(0, 0, 0),
          rotate: vertical ? degrees(90) : undefined,
        })
      }

      const quarters = [q1values, q2values, q3values, q4values]
      const yCoordinates = [[505, 470], [435, 405], [378, 520], [335, 300]]
      let x = 655

      for (let index = 0; index <= 3; index++) {

        for (let i = 0; i <= 3; i++) {
          let mark = quarters[index][i]?.marking || {}
          page2.drawText(`${mark[1] || ''}`, { x: x, y: yCoordinates[i][0], size: 11, font, color: rgb(0, 0, 0) })
          page2.drawText(`${mark[2] || ''}`, { x: x, y: yCoordinates[i][1], size: 11, font, color: rgb(0, 0, 0) })
        }
        x += 26
      }


      // LEFT SIDE
      page.drawText('ATTENDANCE RECORD', { x: 115, y: 524, size: 12, font, color: rgb(0, 0, 0) })
      drawRectangle(22, 386, 302, 134)
      page.drawLine({ start: { x: 22, y: 479 }, end: { x: 324, y: 479 }, thickness: .5 })
      page.drawLine({ start: { x: 22, y: 451 }, end: { x: 324, y: 451 }, thickness: .5 })
      page.drawLine({ start: { x: 22, y: 422 }, end: { x: 324, y: 422 }, thickness: .5 })

      page.drawLine({ start: { x: 64, y: 520 }, end: { x: 64, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 85, y: 520 }, end: { x: 85, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 107, y: 520 }, end: { x: 107, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 129, y: 520 }, end: { x: 129, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 151, y: 520 }, end: { x: 151, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 172, y: 520 }, end: { x: 172, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 194, y: 520 }, end: { x: 194, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 216, y: 520 }, end: { x: 216, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 238, y: 520 }, end: { x: 238, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 260, y: 520 }, end: { x: 260, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 282, y: 520 }, end: { x: 282, y: 386 }, thickness: .5 })
      page.drawLine({ start: { x: 303, y: 520 }, end: { x: 303, y: 386 }, thickness: .5 })

      page.drawText('No. of', { x: 32, y: 468, size: 8, bold, color: rgb(0, 0, 0) })
      page.drawText('School Days', { x: 23, y: 455, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText('No. of Days', { x: 25, y: 440, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText('Present', { x: 30, y: 429, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText('No. of Days', { x: 25, y: 410, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText('Absent', { x: 30, y: 399, size: 7, bold, color: rgb(0, 0, 0) })

      drawRotatableText({ page, text: 'JUNE', x: 78, y: 489, size: 8, vertical: true, })
      drawRotatableText({ page, text: 'JULY', x: 98, y: 489, size: 8, vertical: true, })
      drawRotatableText({ page, text: 'AUGUST', x: 120, y: 482, size: 8, vertical: true, })
      drawRotatableText({ page, text: 'SEPTEMBER', x: 142, y: 481, size: 6, vertical: true, })
      drawRotatableText({ page, text: 'OCTOBER', x: 163, y: 482.5, size: 7, vertical: true, })
      drawRotatableText({ page, text: 'NOVEMBER', x: 184, y: 482, size: 6, vertical: true, })
      drawRotatableText({ page, text: 'DECEMBER', x: 206, y: 481, size: 6.6, vertical: true, })
      drawRotatableText({ page, text: 'JANUARY', x: 228, y: 484, size: 6.6, vertical: true, })
      drawRotatableText({ page, text: 'FEBRUARY', x: 250, y: 481.5, size: 6.6, vertical: true, })
      drawRotatableText({ page, text: 'MARCH', x: 272, y: 487, size: 7, vertical: true, })
      drawRotatableText({ page, text: 'APRIL', x: 294, y: 490, size: 7, vertical: true, })
      drawRotatableText({ page, text: 'TOTAL', x: 315, y: 490, size: 7, vertical: true, })


      page.drawText('PARENT / GUARDIAN’S SIGNATURE', { x: 90, y: 360, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText('1st Quarter', { x: 65, y: 330, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('2nd Quarter', { x: 65, y: 310, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('3rd Quarter', { x: 65, y: 290, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('4th Quarter', { x: 65, y: 270, size: 9, bold, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 125, y: 328 }, end: { x: 260, y: 328 }, thickness: 1 })
      page.drawLine({ start: { x: 125, y: 308 }, end: { x: 260, y: 308 }, thickness: 1 })
      page.drawLine({ start: { x: 125, y: 288 }, end: { x: 260, y: 288 }, thickness: 1 })
      page.drawLine({ start: { x: 125, y: 268 }, end: { x: 260, y: 268 }, thickness: 1 })

      page.drawText('Certificate of Transfer ', { x: 145, y: 250, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText('Admitted to Grade: _________  ', { x: 22, y: 210, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('Section: __________________________  ', { x: 152, y: 210, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('Eligibility for Admission to Grade:_________________________________', { x: 22, y: 195, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('Approved:', { x: 22, y: 165, size: 9, bold, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 28, y: 150 }, end: { x: 160, y: 150 }, thickness: .5 })
      page.drawLine({ start: { x: 200, y: 150 }, end: { x: 320, y: 150 }, thickness: .5 })

      page.drawText('Principal', { x: 75, y: 140, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('Teacher', { x: 245, y: 140, size: 9, bold, color: rgb(0, 0, 0) })

      page.drawText('Cancellation of Eligibility to Transfer', { x: 95, y: 110, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText('Admitted in: ___________________', { x: 22, y: 80, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('Date: _________________________ ', { x: 22, y: 65, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 200, y: 65 }, end: { x: 320, y: 65 }, thickness: .5 })
      page.drawText('Principal', { x: 245, y: 55, size: 9, bold, color: rgb(0, 0, 0) })

      page.drawText("LEARNER'S PROGRESS REPORT CARD", { x: 410, y: 345, size: 12, font, color: rgb(0, 0, 0) })
      page.drawText("Name: _____________________________________________________", { x: 365, y: 290, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText(`${student.firstname} ${student.middlename} ${student.lastname}`, { x: 400, y: 292, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText("Learner's Reference Number:__________________________________", { x: 365, y: 270, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText(`${student.lrn}`, { x: 500, y: 272, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("Age: ______________________________ Sex: ____________________", { x: 365, y: 250, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText(`${student.age}`, { x: 395, y: 252, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.sex}`, { x: 580, y: 252, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("Grade: ___________________ Section: __________________________", { x: 365, y: 230, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText(`${student.section_id.class_id}`, { x: 405, y: 232, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.section_id.section_name}`, { x: 540, y: 232, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("School Year: __________________________", { x: 365, y: 210, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText("2025 - 2026", { x: 430, y: 210, size: 9, font, color: rgb(0, 0, 0) })


      page.drawText("Dear Parent,", { x: 365, y: 170, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText("            This report card shows the ability and progress your child has", { x: 365, y: 150, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText("made in different learning areas as well as his/her core values.", { x: 365, y: 135, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText("            The school welcomes you should you desire to know more ", { x: 365, y: 120, size: 9, font, color: rgb(0, 0, 0) })
      page.drawText("about your childs progress.", { x: 365, y: 105, size: 9, font, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 370, y: 65 }, end: { x: 520, y: 65 }, thickness: .5 })
      page.drawLine({ start: { x: 540, y: 65 }, end: { x: 660, y: 65 }, thickness: .5 })
      page.drawText('Principal', { x: 426, y: 55, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('Teacher', { x: 586, y: 55, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.section_id.adviser?.first_name} ${student.section_id.adviser?.middle_name} ${student.section_id.adviser?.last_name}`, { x: 540, y: 67, size: 9, bold, color: rgb(0, 0, 0) })




      // RIGHT SIDE
      page.drawText('SF9 - JHS', { x: 366, y: 525, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText('Republic of the Philippines', { x: 475, y: 512, size: 8, bold, color: rgb(0, 0, 0) })
      page.drawText('DEPARTMENT OF EDUCATION', { x: 460, y: 497, size: 8, bold, color: rgb(0, 0, 0) })

      page.drawText('IV-A', { x: 500, y: 482, size: 8, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 500, y: 480 }, end: { x: 517, y: 480 }, thickness: 1.5 })
      page.drawText('Region', { x: 495, y: 470, size: 8, bold, color: rgb(0, 0, 0) })

      page.drawText('DIVISION OF BATANGAS', { x: 466, y: 450, size: 8, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 466, y: 448 }, end: { x: 561, y: 448 }, thickness: 1.5 })
      page.drawText('District', { x: 500, y: 438, size: 8, bold, color: rgb(0, 0, 0) })

      page.drawText('CALUBCUB 1ST NATIONAL HIGH SCHOOL', { x: 446, y: 418, size: 8, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 446, y: 416 }, end: { x: 608, y: 416 }, thickness: 1.5 })
      page.drawText('School', { x: 500, y: 406, size: 8, bold, color: rgb(0, 0, 0) })


      page2.drawText("REPORT ON LEARNING PROGRESS AND ACHIEVEMENT", { x: 50, y: 581, size: 12, font, color: rgb(0, 0, 0) })
      page2.drawText("REPORT ON LEARNER'S OBSERVES VALUES", { x: 450, y: 581, size: 12, font, color: rgb(0, 0, 0) })

      drawRectangle2(30, 528, 345, 37, true)
      page2.drawLine({ start: { x: 165, y: 550 }, end: { x: 287, y: 550 }, thickness: .5 })

      page2.drawLine({ start: { x: 165, y: 565 }, end: { x: 165, y: 308 }, thickness: .5 })

      page2.drawLine({ start: { x: 287, y: 565 }, end: { x: 287, y: 288 }, thickness: .5 })
      page2.drawLine({ start: { x: 332, y: 565 }, end: { x: 332, y: 308 }, thickness: .5 })

      page2.drawLine({ start: { x: 196, y: 550 }, end: { x: 196, y: 308 }, thickness: .5 })
      page2.drawLine({ start: { x: 226, y: 550 }, end: { x: 226, y: 308 }, thickness: .5 })
      page2.drawLine({ start: { x: 256, y: 550 }, end: { x: 256, y: 308 }, thickness: .5 })

      page2.drawText("Learning Areas", { x: 62, y: 543, size: 11, font, color: rgb(0, 0, 0) })

      page2.drawText("Quarter", { x: 210, y: 553, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("1", { x: 177, y: 535, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("2", { x: 207, y: 535, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("3", { x: 237, y: 535, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("4", { x: 267, y: 535, size: 11, font, color: rgb(0, 0, 0) })

      page2.drawText("Final", { x: 297, y: 550, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("Rating", { x: 293, y: 537, size: 11, font, color: rgb(0, 0, 0) })

      page2.drawText("Remarks", { x: 335, y: 543, size: 9, font, color: rgb(0, 0, 0) })

      drawRectangle2(30, 508, 345, 20)
      page2.drawText("Filipino", { x: 33, y: 514, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 488, 345, 20)
      page2.drawText("English", { x: 33, y: 494, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 468, 345, 20)
      page2.drawText("Mathematics", { x: 33, y: 474, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 448, 345, 20)
      page2.drawText("Science", { x: 33, y: 454, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 428, 345, 20)
      page2.drawText("Araling Panlipunan (AP)", { x: 33, y: 434, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 408, 345, 20)
      page2.drawText("Edukasyon sa Pagpapakatao (ESP)", { x: 33, y: 414, size: 7.5, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 388, 345, 20)
      page2.drawText("MAPEH", { x: 33, y: 394, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 368, 345, 20)
      page2.drawText("Music", { x: 33, y: 374, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 348, 345, 20)
      page2.drawText("Arts", { x: 33, y: 354, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 328, 345, 20)
      page2.drawText("Physical Education", { x: 33, y: 334, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 308, 345, 20)
      page2.drawText("Health", { x: 33, y: 314, size: 9, font, color: rgb(0, 0, 0) })
      drawRectangle2(165, 288, 167, 20)
      page2.drawText("General Average", { x: 190, y: 294, size: 9, font, color: rgb(0, 0, 0) })


      const mapehCount = [0, 0, 0, 0]
      const mapeh = [0, 0, 0, 0]
      const finalRating = [null, null, null, null, null, null, null, null, null, null]
      let mapehfinal = null
      let generalaverage = null

      if (filteredGrades.length === 40) {
        let x = 175;

        for (let quarterIndex = 0; quarterIndex < 4; quarterIndex++) {
          const quarter = groupedGrades[quarterIndex];
          let y = 514;

          for (let i = 0; i < 10; i++) {
            const subject = quarter[i];
            if (!subject) continue;         // <‑‑ fix #2

            page2.drawText(`${subject.grade_mark || ''}`, {
              x,
              y,
              size: 9,
              font,
              color: rgb(0, 0, 0),
            })
            if (i <= 9) {
              finalRating[i] += Number(subject.grade_mark)
              generalaverage += Number(subject.grade_mark / 4)
            }
            if (i > 5) {
              if (subject.grade_mark !== null) {
                mapehCount[quarterIndex]++
                mapeh[quarterIndex] += Number(subject.grade_mark)
              }
            }
            if (i === 5) {
              y -= 20
            }
            y -= 20;
          }
          if (mapehCount[quarterIndex] === 4) {
            mapehfinal += Math.floor(mapeh[quarterIndex] / 4)
            page2.drawText(`${Math.floor(mapeh[quarterIndex] / 4)}`, {
              x,
              y: 394,
              size: 9,
              font,
              color: rgb(0, 0, 0),
            })
          }
          x += 30.5;
        }
        let y = 514
        for (let i = 0; i < 10; i++) {
          if (finalRating[i] >= 240) {
            if (i === 6) {
              y -= 20
            }
            const finalGrade = finalRating[i] / 4
            page2.drawText(`${finalGrade || ''} `, {
              x: 300,
              y,
              size: 9,
              font,
              color: rgb(0, 0, 0),
            })

            if (finalGrade >= 75) {
              page2.drawText(`Passed`, {
                x: 335,
                y,
                size: 9,
                font,
                color: rgb(0, 0, 0),
              })
            } else if (finalGrade <= 74) {
              page2.drawText(`Failed`, {
                x: 335,
                y,
                size: 9,
                font,
                color: rgb(0, 0, 0),
              })
            }
          }
          y -= 20
        }
      }

      if (mapehfinal >= 240) {
        page2.drawText(`${mapehfinal / 4 || ''} `, {
          x: 300,
          y: 394,
          size: 9,
          font,
          color: rgb(0, 0, 0),
        })

        if (mapehfinal / 4 >= 75) {
          page2.drawText(`Passed`, {
            x: 335,
            y: 394,
            size: 9,
            font,
            color: rgb(0, 0, 0),
          })
        } else if (mapehfinal / 4 <= 74) {
          page2.drawText(`Failed`, {
            x: 335,
            y: 394,
            size: 9,
            font,
            color: rgb(0, 0, 0),
          })
        }
      }


      page2.drawText(`${(generalaverage / 10).toFixed(2)}`, {
        x: 300,
        y: 294,
        size: 9,
        font,
        color: rgb(0, 0, 0),
      })


      // Right Side CORE VALUES
      drawRectangle2(418, 528, 231, 37, true)
      drawRectangle2(649, 548, 109, 17, true)
      drawRectangle2(418, 275, 340, 290)
      page2.drawLine({ start: { x: 418, y: 528 }, end: { x: 758, y: 528 }, thickness: .5 })
      page2.drawLine({ start: { x: 418, y: 458 }, end: { x: 758, y: 458 }, thickness: .5 })
      page2.drawLine({ start: { x: 418, y: 398 }, end: { x: 758, y: 398 }, thickness: .5 })
      page2.drawLine({ start: { x: 418, y: 366 }, end: { x: 758, y: 366 }, thickness: .5 })

      page2.drawLine({ start: { x: 512, y: 565 }, end: { x: 512, y: 275 }, thickness: .5 })
      page2.drawLine({ start: { x: 649, y: 565 }, end: { x: 649, y: 275 }, thickness: .5 })

      page2.drawLine({ start: { x: 649, y: 548 }, end: { x: 758, y: 548 }, thickness: .5 })
      page2.drawLine({ start: { x: 512, y: 494 }, end: { x: 758, y: 494 }, thickness: .5 })
      page2.drawLine({ start: { x: 512, y: 424 }, end: { x: 758, y: 424 }, thickness: .5 })
      page2.drawLine({ start: { x: 512, y: 321 }, end: { x: 758, y: 321 }, thickness: .5 })

      page2.drawLine({ start: { x: 677, y: 548 }, end: { x: 677, y: 275 }, thickness: .5 })
      page2.drawLine({ start: { x: 704, y: 548 }, end: { x: 704, y: 275 }, thickness: .5 })
      page2.drawLine({ start: { x: 730, y: 548 }, end: { x: 730, y: 275 }, thickness: .5 })

      page2.drawText("Core Values", { x: 432, y: 542, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("Behavior Statements", { x: 525, y: 542, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("Quarter", { x: 682, y: 552, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("1", { x: 660, y: 534, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("2", { x: 688, y: 534, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("3", { x: 713, y: 534, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("4", { x: 740, y: 534, size: 11, font, color: rgb(0, 0, 0) })

      page2.drawText("1. Maka-Diyos", { x: 428, y: 492, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("Expresses one’s spiritual beliefs", { x: 515, y: 518, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("while respecting the spiritual", { x: 515, y: 508, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("beliefs of others", { x: 515, y: 498, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("Shows adherence to ethical", { x: 515, y: 485, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("principles by upholding truth in all", { x: 515, y: 475, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("undertakings", { x: 515, y: 465, size: 8, bold, color: rgb(0, 0, 0) })

      page2.drawText("2. Makatao", { x: 428, y: 422, size: 11, font, color: rgb(0, 0, 0) })
      page2.drawText("Is sensitive to individual, social and", { x: 515, y: 449, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("cultural differences; resists", { x: 515, y: 439, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("stereotyping people", { x: 515, y: 429, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("Demonstrates contributions", { x: 515, y: 415, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("toward solidarity ", { x: 515, y: 405, size: 8, bold, color: rgb(0, 0, 0) })

      page2.drawText("3. Makakalikasan", { x: 428, y: 380, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("Cares for the environment and ", { x: 515, y: 390, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("utilizes resources wisely,", { x: 515, y: 380, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("judiciously and economically", { x: 515, y: 370, size: 8, bold, color: rgb(0, 0, 0) })

      page2.drawText("4. Makabansa", { x: 428, y: 320, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Demonstrates pride in being a", { x: 515, y: 353, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("Filipino; exercises the rights and", { x: 515, y: 343, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("responsibilities of a Filipino citizen", { x: 515, y: 333, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("Demonstrates appropriate ", { x: 515, y: 310, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("behavior in carrying out activities", { x: 515, y: 300, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("in the school, community and ", { x: 515, y: 290, size: 8, bold, color: rgb(0, 0, 0) })
      page2.drawText("country", { x: 515, y: 280, size: 8, bold, color: rgb(0, 0, 0) })

      page2.drawText("Observed Values", { x: 425, y: 250, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Marking", { x: 468, y: 235, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("AO", { x: 479, y: 220, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("SO", { x: 479, y: 205, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("RO", { x: 479, y: 190, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("NO", { x: 479, y: 175, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Non-numerical Rating", { x: 550, y: 235, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Always Observed", { x: 550, y: 220, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Sometimes Observed", { x: 550, y: 205, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Rarely Observed", { x: 550, y: 190, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Not Observed", { x: 550, y: 175, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Descriptors", { x: 30, y: 250, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Outstanding", { x: 30, y: 235 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Very Satisfactory ", { x: 30, y: 220 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Satisfactory", { x: 30, y: 205 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Fairly Satisfactory ", { x: 30, y: 190 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Did Not Meet Expectation", { x: 30, y: 175 - 5, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Grading Scale", { x: 180, y: 250, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("90-100", { x: 195, y: 235 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("85-89 ", { x: 197, y: 220 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("80-84", { x: 197, y: 205 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("75-79", { x: 197, y: 190 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Below 75", { x: 190, y: 175 - 5, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Remarks", { x: 300, y: 250, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 304, y: 235 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 304, y: 220 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 304, y: 205 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 304, y: 190 - 5, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Failed", { x: 307, y: 175 - 5, size: 10, bold, color: rgb(0, 0, 0) })















      drawRectangle2(287, 308, 88, 80, true)

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
      <div className='bg-white md:p-5 rounded-lg w-[100%] h-auto p-3 md:w-[90%] max-w-[1500px] md:h-[80vh] max-h-[90vh] text-center relative flex flex-col overflow-y-auto sm:w-[95%] sm:h-[70vh]' onClick={(e) => e.stopPropagation()}>
        <button className='absolute top-[10px] right-[10px] cursor-pointer text-base md:text-2xl border-none bg-none sm:text-lg' onClick={onClose}>✖</button>
        {pdfURL ? (
          <iframe src={pdfURL} width="100%" height="2000px" />
        ) : (
          <p>Generating PDF...</p>
        )}
      </div>
    </div>
  )

}

export default GenerateSF9B