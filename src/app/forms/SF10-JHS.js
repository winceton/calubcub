'use client'

import { PDFDocument, rgb, StandardFonts, degrees, drawText } from 'pdf-lib'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

const GenerateSF10JHS = ({ onClose, student }) => {

  const [pdfURL, setPdfURL] = useState(null)

  const core_values = student?.values?.filter(
    (value) =>
      value.class_id === student.section_id.id
  )

  const q1values = core_values.filter((value) => value.quarter === 1)
  const q2values = core_values.filter((value) => value.quarter === 2)
  const q3values = core_values.filter((value) => value.quarter === 3)
  const q4values = core_values.filter((value) => value.quarter === 4)

  const gradeLevel = {
    7: [[], [], [], []],
    8: [[], [], [], []],
    9: [[], [], [], []],
    10: [[], [], [], []]
  };

  student.jr_student_grades.forEach(grade => {
    const lvl = grade.class_id?.class_id;   // 7‑10
    const q = grade.quarter - 1;          // 0‑3

    if (gradeLevel[lvl] && q >= 0 && q <= 3) {
      gradeLevel[lvl][q].push(grade);
    }
  });
  Object.values(gradeLevel).forEach(qArr =>
    qArr.forEach(arr => arr.sort((a, b) => a.subject_id - b.subject_id))
  );

  useEffect(() => {
    generatePDF()
  }, [])

  const generatePDF = async () => {

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      // const page = pdfDoc.addPage([792, 612]) // STANDARD SIZE
      const page = pdfDoc.addPage([612, 792]) // LANDSCAPE VERSION
      const page2 = pdfDoc.addPage([612, 817]) // LANDSCAPE VERSION
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
      const { width, height } = image.scale(0.4) // Resize image

      // Draw the image
      page.drawImage(image, {
        x: 23,
        y: 725,
        width,
        height,
      })

      const drawRectangle = (x, y, w, h, fill = false, border = true) => {
        page.drawRectangle({
          x: x,
          y: y,
          width: w,
          height: h,
          color: fill ? rgb(0.85, 0.85, 0.75) : undefined,
          borderColor: border ? rgb(0, 0, 0) : undefined,
          borderWidth: border ? 0.5 : undefined,
        })
      }

      const drawRectangle2 = (x, y, w, h, fill = false, border = true) => {
        page2.drawRectangle({
          x: x,
          y: y,
          width: w,
          height: h,
          color: fill ? rgb(0.85, 0.85, 0.75) : undefined,
          borderColor: border ? rgb(0, 0, 0) : undefined,
          borderWidth: border ? 0.5 : undefined,
        })
      }

      // START
      page.drawText('SF 10 -JHS', { x: 23, y: 765, size: 5, bold, color: rgb(0, 0, 0) })
      page.drawText('Republic of the Philippines', { x: 210, y: 765, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText('Department of Education', { x: 210, y: 755, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Learner's Permanent Academic Record for Junior High School (SF10-JHS)", { x: 110, y: 735, size: 8, font, color: rgb(0, 0, 0) })
      page.drawText("(Formerly Form 137", { x: 225, y: 725, size: 5, bold, color: rgb(0, 0, 0) })

      drawRectangle(23, 710, 439, 12, true, false, false) // LEARNERS INFORMATION
      page.drawText("LEARNER'S INFORMATION", { x: 197, y: 713, size: 8, font, color: rgb(0, 0, 0) })

      page.drawText("LAST NAME: ________________________     FIRST NAME: ____________________     NAME EXTN. (Jr,I,II): _______    MIDDLE NAME: ___________________", { x: 23, y: 703, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.lastname}`, { x: 63, y: 703, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText(`${student.firstname}`, { x: 190, y: 703, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText(`${student.lastname}`, { x: 400, y: 703, size: 6, font, color: rgb(0, 0, 0) })

      page.drawText("Learner Reference Number (LRN): ______________               Birthdate (yyyy/mm/dd/): _____________________               Sex: _____________________________", { x: 23, y: 693, size: 6, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.lrn}`, { x: 120, y: 693, size: 6, font, color: rgb(0, 0, 0) })

      page.drawText(`${student.birthdate}`, { x: 270, y: 693, size: 6, font, color: rgb(0, 0, 0) })

      page.drawText(`${student.sex}`, { x: 370, y: 693, size: 6, font, color: rgb(0, 0, 0) })

      drawRectangle(23, 675, 439, 12, true, false, false) // ELIGIBILITY FOR JHS ENROLMENT
      page.drawText("ELIGIBILITY FOR JHS ENROLMENT", { x: 185, y: 678, size: 8, font, color: rgb(0, 0, 0) })

      drawRectangle(23, 653, 439, 18)
      page.drawText("Elementary School Completer                           General Average: ________                            Citation: (If Any)__________________________________", { x: 53, y: 663, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Name of Elementary School:                                                                   School ID:                  Adress of School:", { x: 53, y: 655, size: 6, bold, color: rgb(0, 0, 0) })

      page.drawText("Other Credential Presented", { x: 23, y: 645, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("PEPT Passer        Rating: _________                 ALS A & E Passer       Rating: _____________            Others (Pls. Specify): ___________  ", { x: 43, y: 635, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Date of Examination/Assessment (mm/dd/yyyy): ____________ Name and Address of Testing Center: ____________________________________", { x: 43, y: 625, size: 6, bold, color: rgb(0, 0, 0) })


      drawRectangle(23, 602, 439, 12, true, false, false) // SCHOLASTIC RECORD
      page.drawText("SCHOLASTIC RECORD", { x: 207, y: 605, size: 8, font, color: rgb(0, 0, 0) })

      // SCHOLASTIC RECORD TABLE
      drawRectangle(23, 362, 439, 238)

      let overallY = 551

      for (let gradeIndex = 7; gradeIndex <= 10; gradeIndex++) {
        if (gradeIndex >= 9) {
          currentPage = pdfDoc.getPage(1)
          overallY = 756

          if (gradeIndex === 10) {
            overallY -= 245
          }
        }

        currentPage.drawText("CALUBCUB 1ST NATIONAL HIGH SCHOOL", { x: 47, y: overallY + 42, size: 4.3, bold, color: rgb(0, 0, 0) })
        currentPage.drawText("301094", { x: 167, y: overallY + 42, size: 6, bold, color: rgb(0, 0, 0) })
        currentPage.drawText("Batangas, San Juan East Sub - Office", { x: 330, y: overallY + 42, size: 4.3, bold, color: rgb(0, 0, 0) })
        currentPage.drawText("IV - A", { x: 430, y: overallY + 42, size: 4.3, bold, color: rgb(0, 0, 0) })

        currentPage.drawText(`${gradeIndex}`, { x: 82, y: overallY + 29, size: 6, bold, color: rgb(0, 0, 0) })

        let groupedGrades = gradeLevel[gradeIndex]
        let filteredGrades = gradeLevel[gradeIndex][0].length + gradeLevel[gradeIndex][1].length + gradeLevel[gradeIndex][2].length + gradeLevel[gradeIndex][3].length

        currentPage.drawText(`${groupedGrades[0][0]?.class_id?.section_name}`, { x: 115, y: overallY + 29, size: 6, bold, color: rgb(0, 0, 0) })

        currentPage.drawText(`2025 - 2026`, { x: 200, y: overallY + 29, size: 5, bold, color: rgb(0, 0, 0) })

        const mapehCount = [0, 0, 0, 0]
        const mapeh = [0, 0, 0, 0]
        const finalRating = [null, null, null, null, null, null, null, null, null, null]
        let mapehfinal = null
        let generalaverage = null

        if (filteredGrades === 40) {
          let x = 187;

          for (let quarterIndex = 0; quarterIndex < 4; quarterIndex++) {
            const quarter = groupedGrades[quarterIndex];
            let y = overallY;

            for (let i = 0; i < 10; i++) {
              const subject = quarter[i];
              if (!subject) continue;         // <‑‑ fix #2

              currentPage.drawText(`${subject.grade_mark || ''}`, {
                x,
                y,
                size: 6,
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
              y -= 10;
            }
            if (mapehCount[quarterIndex] === 4) {
              mapehfinal += Math.floor(mapeh[quarterIndex] / 4)
              currentPage.drawText(`${Math.floor(mapeh[quarterIndex] / 4)}`, {
                x,
                y: y + 50,
                size: 6,
                font,
                color: rgb(0, 0, 0),
              })
            }
            x += 30.5;
          }
          let y = overallY
          for (let i = 0; i < 10; i++) {
            if (finalRating[i] >= 240) {
              if (i === 6) {
                y -= 20
              }
              const finalGrade = finalRating[i] / 4
              currentPage.drawText(`${finalGrade || ''}`, {
                x: 315,
                y: y,
                size: 6,
                font,
                color: rgb(0, 0, 0),
              })

              if (finalGrade >= 75) {
                currentPage.drawText(`Passed`, {
                  x: 390,
                  y,
                  size: 6,
                  font,
                  color: rgb(0, 0, 0),
                })
              } else if (finalGrade < 75) {
                currentPage.drawText(`Failed`, {
                  x: 391,
                  y,
                  size: 6,
                  font,
                  color: rgb(0, 0, 0),
                })
              }
            }
            y -= 10
          }
        }

        if (mapehfinal >= 240) {
          currentPage.drawText(`${mapehfinal / 4 || ''}`, {
            x: 315,
            y: overallY - 70,
            size: 6,
            font,
            color: rgb(0, 0, 0),
          })

          if (mapehfinal / 4 >= 75) {
            currentPage.drawText(`Passed`, {
              x: 390,
              y: overallY - 70,
              size: 6,
              font,
              color: rgb(0, 0, 0),
            })
          } else if (mapehfinal / 4 <= 74) {
            currentPage.drawText(`Failed`, {
              x: 391,
              y: 394,
              size: 6,
              font,
              color: rgb(0, 0, 0),
            })
          }
        }

        currentPage.drawText(`${(generalaverage / 10).toFixed(2)}`, {
          x: 315,
          y: overallY - 138,
          size: 6,
          font,
          color: rgb(0, 0, 0),
        })

        

        overallY -= 253
      }

      page.drawText("School: __________________________ School ID: ____________ District: _______________________ Division: ______________________ Region: ________", { x: 25, y: 593, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Classified as Grade: __ Section: ______________ School Year: _________ Name of Adviser/Teacher: ____________________ Signature: ______________", { x: 25, y: 580, size: 6, bold, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 23, y: 576 }, end: { x: 462, y: 576 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 558 }, end: { x: 462, y: 558 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 549 }, end: { x: 462, y: 549 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 539 }, end: { x: 462, y: 539 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 529 }, end: { x: 462, y: 529 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 519 }, end: { x: 462, y: 519 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 509 }, end: { x: 462, y: 509 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 499 }, end: { x: 462, y: 499 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 489 }, end: { x: 462, y: 489 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 479 }, end: { x: 462, y: 479 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 469 }, end: { x: 462, y: 469 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 460 }, end: { x: 462, y: 460 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 450 }, end: { x: 462, y: 450 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 440 }, end: { x: 462, y: 440 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 430 }, end: { x: 462, y: 430 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 420 }, end: { x: 462, y: 420 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 411 }, end: { x: 462, y: 411 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 407 }, end: { x: 462, y: 407 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 399 }, end: { x: 462, y: 399 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 380 }, end: { x: 462, y: 380 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 371 }, end: { x: 462, y: 371 }, thickness: .5 })
      page.drawLine({ start: { x: 176, y: 568 }, end: { x: 300, y: 568 }, thickness: .5 })

      // Vertical Lines
      page.drawLine({ start: { x: 176, y: 576 }, end: { x: 176, y: 411 }, thickness: .5 })
      page.drawLine({ start: { x: 207, y: 568 }, end: { x: 207, y: 420 }, thickness: .5 })
      page.drawLine({ start: { x: 238, y: 568 }, end: { x: 238, y: 420 }, thickness: .5 })
      page.drawLine({ start: { x: 269, y: 568 }, end: { x: 269, y: 420 }, thickness: .5 })
      page.drawLine({ start: { x: 300, y: 576 }, end: { x: 300, y: 411 }, thickness: .5 })
      page.drawLine({ start: { x: 346, y: 576 }, end: { x: 346, y: 411 }, thickness: .5 })

      page.drawLine({ start: { x: 114, y: 407 }, end: { x: 114, y: 362 }, thickness: .5 })
      page.drawLine({ start: { x: 176, y: 399 }, end: { x: 176, y: 362 }, thickness: .5 })
      page.drawLine({ start: { x: 269, y: 399 }, end: { x: 269, y: 362 }, thickness: .5 })
      page.drawLine({ start: { x: 346, y: 399 }, end: { x: 346, y: 362 }, thickness: .5 })

      // SCHOLASTIC RECORD TABLE HEADER TEXTS
      page.drawText("LEARNING AREAS", { x: 70, y: 565, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Quarterly Rating                                        FINAL", { x: 220, y: 570, size: 5, font, color: rgb(0, 0, 0) })
      page.drawText("1                2                 3                 4               RATING", { x: 190, y: 560, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("REMARKS", { x: 387, y: 565, size: 6, font, color: rgb(0, 0, 0) })

      // SCHOLASTIC RECORD TABLE SUBJECTS
      page.drawText("Filipino", { x: 25, y: 551, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("English", { x: 25, y: 542, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Mathematics", { x: 25, y: 532, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Science", { x: 25, y: 522, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Araling Panlipunan (AP)", { x: 25, y: 511, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Edukasyon sa Pagpapakatao (EsP)", { x: 25, y: 502, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("MAPEH", { x: 25, y: 481, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Music", { x: 32, y: 471, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Arts", { x: 32, y: 462, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Physical Education", { x: 32, y: 453, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Health", { x: 32, y: 442, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("General Average", { x: 212, y: 413, size: 6, font, color: rgb(0, 0, 0) })

      page.drawText("Remedial Classes              Conducted from (mm/dd/yyyy) ____________________ to (mm/dd/yyyy) __________________", { x: 43, y: 401, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Learning Areas                       Final Rating                   Remedial Class Mark           Recomputed Final Grade                             Remarks", { x: 45, y: 388, size: 6, font, color: rgb(0, 0, 0) })


      // 2ND SCHOLASTIC RECORD TABLE
      drawRectangle(23, 108, 439, 238)

      page.drawText("School: __________________________ School ID: ____________ District: _______________________ Division: ______________________ Region: ________", { x: 25, y: 339, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Classified as Grade: __ Section: ______________ School Year: _________ Name of Adviser/Teacher: ____________________ Signature: ______________", { x: 25, y: 326, size: 6, bold, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 23, y: 322 }, end: { x: 462, y: 322 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 304 }, end: { x: 462, y: 304 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 295 }, end: { x: 462, y: 295 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 285 }, end: { x: 462, y: 285 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 275 }, end: { x: 462, y: 275 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 265 }, end: { x: 462, y: 265 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 255 }, end: { x: 462, y: 255 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 245 }, end: { x: 462, y: 245 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 235 }, end: { x: 462, y: 235 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 225 }, end: { x: 462, y: 225 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 215 }, end: { x: 462, y: 215 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 206 }, end: { x: 462, y: 206 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 196 }, end: { x: 462, y: 196 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 186 }, end: { x: 462, y: 186 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 176 }, end: { x: 462, y: 176 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 166 }, end: { x: 462, y: 166 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 157 }, end: { x: 462, y: 157 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 153 }, end: { x: 462, y: 153 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 145 }, end: { x: 462, y: 145 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 126 }, end: { x: 462, y: 126 }, thickness: .5 })
      page.drawLine({ start: { x: 23, y: 117 }, end: { x: 462, y: 117 }, thickness: .5 })
      page.drawLine({ start: { x: 176, y: 314 }, end: { x: 300, y: 314 }, thickness: .5 })

      // 2nd Vertical Lines
      page.drawLine({ start: { x: 176, y: 322 }, end: { x: 176, y: 157 }, thickness: .5 })
      page.drawLine({ start: { x: 207, y: 314 }, end: { x: 207, y: 166 }, thickness: .5 })
      page.drawLine({ start: { x: 238, y: 314 }, end: { x: 238, y: 166 }, thickness: .5 })
      page.drawLine({ start: { x: 269, y: 314 }, end: { x: 269, y: 166 }, thickness: .5 })
      page.drawLine({ start: { x: 300, y: 322 }, end: { x: 300, y: 157 }, thickness: .5 })
      page.drawLine({ start: { x: 346, y: 322 }, end: { x: 346, y: 157 }, thickness: .5 })

      page.drawLine({ start: { x: 114, y: 153 }, end: { x: 114, y: 108 }, thickness: .5 })
      page.drawLine({ start: { x: 176, y: 145 }, end: { x: 176, y: 108 }, thickness: .5 })
      page.drawLine({ start: { x: 269, y: 145 }, end: { x: 269, y: 108 }, thickness: .5 })
      page.drawLine({ start: { x: 346, y: 145 }, end: { x: 346, y: 108 }, thickness: .5 })

      // 2ND SCHOLASTIC RECORD TABLE HEADER TEXTS
      page.drawText("LEARNING AREAS", { x: 70, y: 311, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Quarterly Rating                                        FINAL", { x: 220, y: 316, size: 5, font, color: rgb(0, 0, 0) })
      page.drawText("1                2                 3                 4               RATING", { x: 190, y: 306, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("REMARKS", { x: 387, y: 311, size: 6, font, color: rgb(0, 0, 0) })

      // 2ND SCHOLASTIC RECORD TABLE SUBJECTS
      page.drawText("Filipino", { x: 25, y: 297, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("English", { x: 25, y: 288, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Mathematics", { x: 25, y: 278, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Science", { x: 25, y: 268, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Araling Panlipunan (AP)", { x: 25, y: 257, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Edukasyon sa Pagpapakatao (EsP)", { x: 25, y: 248, size: 6, font, color: rgb(0, 0, 0) })

      page.drawText("MAPEH", { x: 25, y: 227, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Music", { x: 32, y: 217, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Arts", { x: 32, y: 208, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Physical Education", { x: 32, y: 199, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Health", { x: 32, y: 188, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("General Average", { x: 212, y: 159, size: 6, font, color: rgb(0, 0, 0) })

      page.drawText("Remedial Classes              Conducted from (mm/dd/yyyy) ____________________ to (mm/dd/yyyy) __________________", { x: 43, y: 147, size: 6, font, color: rgb(0, 0, 0) })
      page.drawText("Learning Areas                       Final Rating                   Remedial Class Mark           Recomputed Final Grade                             Remarks", { x: 45, y: 134, size: 6, font, color: rgb(0, 0, 0) })


      // 3RD TABLE
      drawRectangle(23, 38, 439, 65)
      page.drawText("CERTIFICATION", { x: 215, y: 95, size: 7, font, color: rgb(0, 0, 0) })
      page.drawText("I CERTIFY that this is a true record of _________________________with LRN ______________ and that he/she is eligible for admission to Grade ____.", { x: 26, y: 77, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.firstname} ${student.middlename} ${student.lastname}`, { x: 128, y: 77, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.lrn}`, { x: 239, y: 77, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Name of School: ____________________________________ School ID: __________________ Last School Year Attended: _________________________", { x: 26, y: 67, size: 6, bold, color: rgb(0, 0, 0) })

      page.drawText("________________________        ______________________________________________", { x: 25, y: 47, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("Date                                    Name of Principal/School Head over Printed Name                                                  (Affix School Seal here)", { x: 55, y: 40, size: 6, bold, color: rgb(0, 0, 0) })






































      // 2nd page
      drawRectangle2(23, 567, 439, 238)
      page2.drawText("School: __________________________ School ID: ____________ District: _______________________ Division: ______________________ Region: ________", { x: 25, y: 798, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText("Classified as Grade: __ Section: ______________ School Year: _________ Name of Adviser/Teacher: ____________________ Signature: ______________", { x: 25, y: 785, size: 6, bold, color: rgb(0, 0, 0) })

      page2.drawLine({ start: { x: 23, y: 781 }, end: { x: 462, y: 781 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 763 }, end: { x: 462, y: 763 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 754 }, end: { x: 462, y: 754 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 744 }, end: { x: 462, y: 744 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 734 }, end: { x: 462, y: 734 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 724 }, end: { x: 462, y: 724 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 714 }, end: { x: 462, y: 714 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 704 }, end: { x: 462, y: 704 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 694 }, end: { x: 462, y: 694 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 684 }, end: { x: 462, y: 684 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 674 }, end: { x: 462, y: 674 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 665 }, end: { x: 462, y: 665 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 655 }, end: { x: 462, y: 655 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 645 }, end: { x: 462, y: 645 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 635 }, end: { x: 462, y: 635 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 625 }, end: { x: 462, y: 625 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 616 }, end: { x: 462, y: 616 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 612 }, end: { x: 462, y: 612 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 604 }, end: { x: 462, y: 604 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 585 }, end: { x: 462, y: 585 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 576 }, end: { x: 462, y: 576 }, thickness: .5 })
      page2.drawLine({ start: { x: 176, y: 773 }, end: { x: 300, y: 773 }, thickness: .5 })

      // Vertical Lines
      page2.drawLine({ start: { x: 176, y: 781 }, end: { x: 176, y: 616 }, thickness: .5 })
      page2.drawLine({ start: { x: 207, y: 773 }, end: { x: 207, y: 625 }, thickness: .5 })
      page2.drawLine({ start: { x: 238, y: 773 }, end: { x: 238, y: 625 }, thickness: .5 })
      page2.drawLine({ start: { x: 269, y: 773 }, end: { x: 269, y: 625 }, thickness: .5 })
      page2.drawLine({ start: { x: 300, y: 781 }, end: { x: 300, y: 616 }, thickness: .5 })
      page2.drawLine({ start: { x: 346, y: 781 }, end: { x: 346, y: 616 }, thickness: .5 })

      page2.drawLine({ start: { x: 114, y: 612 }, end: { x: 114, y: 567 }, thickness: .5 })
      page2.drawLine({ start: { x: 176, y: 604 }, end: { x: 176, y: 567 }, thickness: .5 })
      page2.drawLine({ start: { x: 269, y: 604 }, end: { x: 269, y: 567 }, thickness: .5 })
      page2.drawLine({ start: { x: 346, y: 604 }, end: { x: 346, y: 567 }, thickness: .5 })

      // SCHOLASTIC RECORD TABLE HEADER TEXTS
      page2.drawText("LEARNING ", { x: 70, y: 770, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Quarterly Rating                                        FINAL", { x: 220, y: 775, size: 5, font, color: rgb(0, 0, 0) })
      page2.drawText("1                2                 3                 4               RATING", { x: 190, y: 765, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("REMARKS", { x: 387, y: 770, size: 6, font, color: rgb(0, 0, 0) })

      // SCHOLASTIC RECORD TABLE SUBJECTS
      page2.drawText("Filipino", { x: 25, y: 756, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("English", { x: 25, y: 747, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Mathematics", { x: 25, y: 737, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Science", { x: 25, y: 727, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Araling Panlipunan (AP)", { x: 25, y: 716, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Edukasyon sa Pagpapakatao (EsP)", { x: 25, y: 707, size: 6, font, color: rgb(0, 0, 0) })

      page2.drawText("MAPEH", { x: 25, y: 686, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Music", { x: 32, y: 676, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Arts", { x: 32, y: 667, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Physical Education", { x: 32, y: 658, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Health", { x: 32, y: 647, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("General Average", { x: 212, y: 618, size: 6, font, color: rgb(0, 0, 0) })

      page2.drawText("Remedial Classes              Conducted from (mm/dd/yyyy) ____________________ to (mm/dd/yyyy) __________________", { x: 43, y: 606, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Subject                       Final Rating                   Remedial Class Mark           Recomputed Final Grade                             Remarks", { x: 45, y: 593, size: 6, font, color: rgb(0, 0, 0) })

































      // SCHOLASTIC RECORD TABLE
      drawRectangle2(23, 322, 439, 238)
      page2.drawText("School: __________________________ School ID: ____________ District: _______________________ Division: ______________________ Region: ________", { x: 25, y: 553, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText("Classified as Grade: __ Section: ______________ School Year: _________ Name of Adviser/Teacher: ____________________ Signature: ______________", { x: 25, y: 540, size: 6, bold, color: rgb(0, 0, 0) })

      page2.drawLine({ start: { x: 23, y: 536 }, end: { x: 462, y: 536 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 518 }, end: { x: 462, y: 518 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 509 }, end: { x: 462, y: 509 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 499 }, end: { x: 462, y: 499 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 489 }, end: { x: 462, y: 489 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 479 }, end: { x: 462, y: 479 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 469 }, end: { x: 462, y: 469 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 459 }, end: { x: 462, y: 459 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 449 }, end: { x: 462, y: 449 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 439 }, end: { x: 462, y: 439 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 429 }, end: { x: 462, y: 429 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 420 }, end: { x: 462, y: 420 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 410 }, end: { x: 462, y: 410 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 400 }, end: { x: 462, y: 400 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 390 }, end: { x: 462, y: 390 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 380 }, end: { x: 462, y: 380 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 371 }, end: { x: 462, y: 371 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 367 }, end: { x: 462, y: 367 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 359 }, end: { x: 462, y: 359 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 340 }, end: { x: 462, y: 340 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 331 }, end: { x: 462, y: 331 }, thickness: .5 })
      page2.drawLine({ start: { x: 176, y: 528 }, end: { x: 300, y: 528 }, thickness: .5 })

      // Vertical Lines
      page2.drawLine({ start: { x: 176, y: 536 }, end: { x: 176, y: 371 }, thickness: .5 })
      page2.drawLine({ start: { x: 207, y: 528 }, end: { x: 207, y: 380 }, thickness: .5 })
      page2.drawLine({ start: { x: 238, y: 528 }, end: { x: 238, y: 380 }, thickness: .5 })
      page2.drawLine({ start: { x: 269, y: 528 }, end: { x: 269, y: 380 }, thickness: .5 })
      page2.drawLine({ start: { x: 300, y: 536 }, end: { x: 300, y: 371 }, thickness: .5 })
      page2.drawLine({ start: { x: 346, y: 536 }, end: { x: 346, y: 371 }, thickness: .5 })

      page2.drawLine({ start: { x: 114, y: 367 }, end: { x: 114, y: 322 }, thickness: .5 })
      page2.drawLine({ start: { x: 176, y: 359 }, end: { x: 176, y: 322 }, thickness: .5 })
      page2.drawLine({ start: { x: 269, y: 359 }, end: { x: 269, y: 322 }, thickness: .5 })
      page2.drawLine({ start: { x: 346, y: 359 }, end: { x: 346, y: 322 }, thickness: .5 })

      // SCHOLASTIC RECORD TABLE HEADER TEXTS
      page2.drawText("LEARNING ", { x: 70, y: 525, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Quarterly Rating                                        FINAL", { x: 220, y: 530, size: 5, font, color: rgb(0, 0, 0) })
      page2.drawText("1                2                 3                 4               RATING", { x: 190, y: 520, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("REMARKS", { x: 387, y: 525, size: 6, font, color: rgb(0, 0, 0) })

      // SCHOLASTIC RECORD TABLE SUBJECTS
      page2.drawText("Filipino", { x: 25, y: 511, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("English", { x: 25, y: 502, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Mathematics", { x: 25, y: 492, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Science", { x: 25, y: 482, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Araling Panlipunan (AP)", { x: 25, y: 471, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Edukasyon sa Pagpapakatao (EsP)", { x: 25, y: 462, size: 6, font, color: rgb(0, 0, 0) })

      page2.drawText("MAPEH", { x: 25, y: 441, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Music", { x: 32, y: 431, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Arts", { x: 32, y: 422, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Physical Education", { x: 32, y: 413, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Health", { x: 32, y: 402, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("General Average", { x: 212, y: 373, size: 6, font, color: rgb(0, 0, 0) })

      page2.drawText("Remedial Classes              Conducted from (mm/dd/yyyy) ____________________ to (mm/dd/yyyy) __________________", { x: 43, y: 361, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Learning Areas                       Final Rating                   Remedial Class Mark           Recomputed Final Grade                             Remarks", { x: 45, y: 348, size: 6, font, color: rgb(0, 0, 0) })



      // 2ND SCHOLASTIC RECORD TABLE
      drawRectangle2(23, 78, 439, 238)

      page2.drawText("School: __________________________ School ID: ____________ District: _______________________ Division: ______________________ Region: ________", { x: 25, y: 309, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText("Classified as Grade: __ Section: ______________ School Year: _________ Name of Adviser/Teacher: ____________________ Signature: ______________", { x: 25, y: 296, size: 6, bold, color: rgb(0, 0, 0) })

      page2.drawLine({ start: { x: 23, y: 292 }, end: { x: 462, y: 292 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 274 }, end: { x: 462, y: 274 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 265 }, end: { x: 462, y: 265 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 255 }, end: { x: 462, y: 255 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 245 }, end: { x: 462, y: 245 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 235 }, end: { x: 462, y: 235 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 225 }, end: { x: 462, y: 225 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 215 }, end: { x: 462, y: 215 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 205 }, end: { x: 462, y: 205 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 195 }, end: { x: 462, y: 195 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 185 }, end: { x: 462, y: 185 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 176 }, end: { x: 462, y: 176 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 166 }, end: { x: 462, y: 166 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 156 }, end: { x: 462, y: 156 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 146 }, end: { x: 462, y: 146 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 136 }, end: { x: 462, y: 136 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 127 }, end: { x: 462, y: 127 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 123 }, end: { x: 462, y: 123 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 115 }, end: { x: 462, y: 115 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 96 }, end: { x: 462, y: 96 }, thickness: .5 })
      page2.drawLine({ start: { x: 23, y: 87 }, end: { x: 462, y: 87 }, thickness: .5 })
      page2.drawLine({ start: { x: 176, y: 284 }, end: { x: 300, y: 284 }, thickness: .5 })

      // 2nd Vertical Lines
      page2.drawLine({ start: { x: 176, y: 292 }, end: { x: 176, y: 127 }, thickness: .5 })
      page2.drawLine({ start: { x: 207, y: 284 }, end: { x: 207, y: 136 }, thickness: .5 })
      page2.drawLine({ start: { x: 238, y: 284 }, end: { x: 238, y: 136 }, thickness: .5 })
      page2.drawLine({ start: { x: 269, y: 284 }, end: { x: 269, y: 136 }, thickness: .5 })
      page2.drawLine({ start: { x: 300, y: 292 }, end: { x: 300, y: 127 }, thickness: .5 })
      page2.drawLine({ start: { x: 346, y: 292 }, end: { x: 346, y: 127 }, thickness: .5 })

      page2.drawLine({ start: { x: 114, y: 123 }, end: { x: 114, y: 78 }, thickness: .5 })
      page2.drawLine({ start: { x: 176, y: 115 }, end: { x: 176, y: 78 }, thickness: .5 })
      page2.drawLine({ start: { x: 269, y: 115 }, end: { x: 269, y: 78 }, thickness: .5 })
      page2.drawLine({ start: { x: 346, y: 115 }, end: { x: 346, y: 78 }, thickness: .5 })

      // 2ND SCHOLASTIC RECORD TABLE HEADER TEXTS
      page2.drawText("LEARNING AREAS", { x: 70, y: 281, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Quarterly Rating                                        FINAL", { x: 220, y: 286, size: 5, font, color: rgb(0, 0, 0) })
      page2.drawText("1                2                 3                 4               RATING", { x: 190, y: 276, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("REMARKS", { x: 387, y: 281, size: 6, font, color: rgb(0, 0, 0) })

      // 2ND SCHOLASTIC RECORD TABLE SUBJECTS
      page2.drawText("Filipino", { x: 25, y: 267, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("English", { x: 25, y: 258, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Mathematics", { x: 25, y: 248, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Science", { x: 25, y: 238, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Araling Panlipunan (AP)", { x: 25, y: 227, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Edukasyon sa Pagpapakatao (EsP)", { x: 25, y: 218, size: 6, font, color: rgb(0, 0, 0) })

      page2.drawText("MAPEH", { x: 25, y: 197, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Music", { x: 32, y: 187, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Arts", { x: 32, y: 178, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Physical Education", { x: 32, y: 169, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Health", { x: 32, y: 158, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("General Average", { x: 212, y: 129, size: 6, font, color: rgb(0, 0, 0) })

      page2.drawText("Remedial Classes              Conducted from (mm/dd/yyyy) ____________________ to (mm/dd/yyyy) __________________", { x: 43, y: 117, size: 6, font, color: rgb(0, 0, 0) })
      page2.drawText("Learning Areas                       Final Rating                   Remedial Class Mark           Recomputed Final Grade                             Remarks", { x: 45, y: 104, size: 6, font, color: rgb(0, 0, 0) })


      // 3RD TABLE
      drawRectangle2(23, 8, 439, 65)
      page2.drawText("CERTIFICATION", { x: 215, y: 65, size: 7, font, color: rgb(0, 0, 0) })
      page2.drawText("I CERTIFY that this is a true record of _________________________with LRN ______________ and that he/she is eligible for admission to Grade ____.", { x: 26, y: 47, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText(`${student.firstname} ${student.middlename} ${student.lastname}`, { x: 128, y: 47, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText(`${student.lrn}`, { x: 239, y: 47, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText("Name of School: ____________________________________ School ID: __________________ Last School Year Attended: _________________________", { x: 26, y: 37, size: 6, bold, color: rgb(0, 0, 0) })

      page2.drawText("________________________        ______________________________________________", { x: 25, y: 17, size: 6, bold, color: rgb(0, 0, 0) })
      page2.drawText("Date                                    Name of Principal/School Head over Printed Name                                                  (Affix School Seal here)", { x: 55, y: 10, size: 6, bold, color: rgb(0, 0, 0) })


























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

export default GenerateSF10JHS