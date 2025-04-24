'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useState, useEffect } from 'react'

const GenerateSF9 = ({ onClose, student }) => {


  console.log(student)
  const core_values = student?.values?.filter(
    (value) =>
      value.class_id === student.section_id.id
  )

  const q1values = core_values.filter((value) => value.quarter === 1)
  const q2values = core_values.filter((value) => value.quarter === 2)
  const q3values = core_values.filter((value) => value.quarter === 3)
  const q4values = core_values.filter((value) => value.quarter === 4)


  const [pdfURL, setPdfURL] = useState(null)

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
      const { width, height } = image.scale(0.33) // Resize image
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
        x: 455,
        y: 521,
        width,
        height,
      })

      // START
      page.drawText('REPORT ON ATTENDANCE', { x: 130, y: 560, size: 12, font, color: rgb(0, 0, 0) })
      page.drawText('SF9-SHS', { x: 410, y: 580, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('LRN', { x: 590, y: 576, size: 11, bold, color: rgb(0, 0, 0) })
      drawRectangle(620, 570, 145, 18)
      page.drawLine({ start: { x: 632, y: 588 }, end: { x: 632, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 644, y: 588 }, end: { x: 644, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 656, y: 588 }, end: { x: 656, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 668, y: 588 }, end: { x: 668, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 680, y: 588 }, end: { x: 680, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 692, y: 588 }, end: { x: 692, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 704, y: 588 }, end: { x: 704, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 716, y: 588 }, end: { x: 716, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 728, y: 588 }, end: { x: 728, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 740, y: 588 }, end: { x: 740, y: 570 }, thickness: .5 })
      page.drawLine({ start: { x: 753, y: 588 }, end: { x: 753, y: 570 }, thickness: .5 })

      page.drawText('Republic of the Philippines', { x: 520, y: 542, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('DEPARTMENT OF EDUCATION', { x: 505, y: 527, size: 11, font, color: rgb(0, 0, 0) })

      const LRN = student.lrn.split('')
      let startlrn = 623; // starting x position
      const spacing = 12;

      LRN.forEach((digit, index) => {
        page.drawText(digit, {
          x: startlrn + spacing * index,
          y: 575,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
      });

      page.drawText('IV-A', { x: 575, y: 512, size: 11, font, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 575, y: 510 }, end: { x: 598, y: 510 }, thickness: 1.5 })
      page.drawText('Region', { x: 570, y: 500, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText('DIVISION OF BATANGAS', { x: 521, y: 480, size: 11, font, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 521, y: 478 }, end: { x: 654, y: 478 }, thickness: 1.5 })
      page.drawText('Division', { x: 569, y: 468, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText('CALUBCUB 1ST NATIONAL HIGH SCHOOL', { x: 491, y: 448, size: 11, font, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 491, y: 446 }, end: { x: 718, y: 446 }, thickness: 1.5 })
      page.drawText('School', { x: 572, y: 436, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText('Name :', { x: 420, y: 395, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.firstname} ${student.middlename} ${student.lastname}`, { x: 463, y: 397, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 460, y: 395 }, end: { x: 753, y: 395 }, thickness: .5 })

      page.drawText('Age    :', { x: 420, y: 365, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.age}`, { x: 463, y: 367, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 460, y: 365 }, end: { x: 577, y: 365 }, thickness: .5 })

      page.drawText('Sex:', { x: 585, y: 365, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.sex}`, { x: 615, y: 367, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 610, y: 365 }, end: { x: 753, y: 365 }, thickness: .5 })

      page.drawText('Grade :', { x: 420, y: 340, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.section_id.class_id}`, { x: 463, y: 342, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 460, y: 340 }, end: { x: 577, y: 340 }, thickness: .5 })

      page.drawText('Section:', { x: 585, y: 340, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.section_id.section_name}`, { x: 628, y: 342, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 627, y: 340 }, end: { x: 753, y: 340 }, thickness: .5 })

      page.drawText('Curriculum:', { x: 420, y: 320, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('K - 12 Basic Education Curriculum', { x: 480, y: 322, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 479, y: 320 }, end: { x: 664, y: 320 }, thickness: 1.5 })

      page.drawText('School Year:', { x: 420, y: 300, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('2025 - 2026', { x: 485, y: 300, size: 11, font, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 485, y: 298 }, end: { x: 545, y: 298 }, thickness: 1.5 })

      page.drawText('Track/Strand:', { x: 420, y: 280, size: 11, bold, color: rgb(0, 0, 0) })
      let strand = ''
      if (student.section_id.section_name === "ABM") {
        strand = 'ACCOUNTANCY, BUSINESS AND MANAGEMENT (ABM)'
      } else if (student.section_id.section_name === "HUMSS") {
        strand = 'HUMANITIES AND SOCIAL SCIENCES (HUMSS)'
      } else if (student.section_id.section_name === "STEM") {
        strand = 'SCIENCE, TECHNOLOGY, ENGINEERING AND MATHEMATICS (STEM)'
      } else {
        strand = 'TVL'
      }
      page.drawText(`${strand}`, { x: 490, y: 280, size: 8, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 489, y: 278 }, end: { x: 753, y: 278 }, thickness: 1 })


      page.drawText('Dear Parent/Guardian,', { x: 420, y: 235, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('This report card shows the ability and progress your child has', { x: 450, y: 205, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('made in the different learning areas as well as his/her core values', { x: 420, y: 185, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('The school welcomes you should you desire to know more about ', { x: 450, y: 155, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText('your child’s progress.', { x: 420, y: 135, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.section_id.adviser?.first_name || ''} ${student.section_id.adviser?.middle_name || ''} ${student.section_id.adviser?.last_name || ''}`, { x: 620, y: 105, size: 11, font, color: rgb(0, 0, 0) })
      page.drawText("Adviser", { x: 653, y: 90, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText("Principal IV", { x: 490, y: 45, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 440, y: 57 }, end: { x: 590, y: 57 }, thickness: 1 })

      drawRectangle(35, 377, 345, 170)
      page.drawLine({ start: { x: 35, y: 532 }, end: { x: 380, y: 532 }, thickness: 1 })
      page.drawLine({ start: { x: 35, y: 488 }, end: { x: 380, y: 488 }, thickness: 1 })
      page.drawLine({ start: { x: 35, y: 425 }, end: { x: 380, y: 425 }, thickness: 1 })
      page.drawLine({ start: { x: 70, y: 547 }, end: { x: 70, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 93, y: 547 }, end: { x: 93, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 119, y: 547 }, end: { x: 119, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 142, y: 547 }, end: { x: 142, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 166, y: 547 }, end: { x: 166, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 190, y: 547 }, end: { x: 190, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 216, y: 547 }, end: { x: 216, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 241, y: 547 }, end: { x: 241, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 265, y: 547 }, end: { x: 265, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 289, y: 547 }, end: { x: 289, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 313, y: 547 }, end: { x: 313, y: 377 }, thickness: 1 })
      page.drawLine({ start: { x: 341, y: 547 }, end: { x: 341, y: 377 }, thickness: 1 })

      page.drawText("Jun", { x: 72, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Jul", { x: 98, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Aug", { x: 121, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Sep", { x: 145, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Oct", { x: 169, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Nov", { x: 194, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Dec", { x: 219, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Jan", { x: 244, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Feb", { x: 268, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Mar", { x: 292, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Apr", { x: 318, y: 536, size: 10, font, color: rgb(0, 0, 0) })
      page.drawText("Total", { x: 347, y: 536, size: 10, font, color: rgb(0, 0, 0) })

      page.drawText("No. of", { x: 37, y: 520, size: 10, bold, color: rgb(0, 0, 0) })
      page.drawText("School", { x: 37, y: 505, size: 10, bold, color: rgb(0, 0, 0) })
      page.drawText("Days", { x: 37, y: 492, size: 10, bold, color: rgb(0, 0, 0) })

      page.drawText("No. of", { x: 37, y: 465, size: 10, bold, color: rgb(0, 0, 0) })
      page.drawText("Days", { x: 37, y: 450, size: 10, bold, color: rgb(0, 0, 0) })
      page.drawText("Present", { x: 37, y: 435, size: 9, bold, color: rgb(0, 0, 0) })

      page.drawText("No. of", { x: 37, y: 411, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText("Days", { x: 37, y: 397, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText("Absent", { x: 37, y: 382, size: 9, bold, color: rgb(0, 0, 0) })


      page.drawText("PARENT / GUARDIAN’S SIGNATURE", { x: 37, y: 361, size: 12, font, color: rgb(0, 0, 0) })
      page.drawText("1st Quarter", { x: 40, y: 345, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("2nd Quarter", { x: 40, y: 325, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("3rd Quarter", { x: 40, y: 305, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("4th Quarter", { x: 40, y: 285, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 100, y: 344 }, end: { x: 350, y: 344 }, thickness: .5 })
      page.drawLine({ start: { x: 100, y: 324 }, end: { x: 350, y: 324 }, thickness: .5 })
      page.drawLine({ start: { x: 100, y: 304 }, end: { x: 350, y: 304 }, thickness: .5 })
      page.drawLine({ start: { x: 100, y: 284 }, end: { x: 350, y: 284 }, thickness: .5 })

      page.drawText("Certificate of Transfer", { x: 150, y: 248, size: 11, font, color: rgb(0, 0, 0) })
      page.drawText("Admitted to Grade:", { x: 40, y: 218, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("Eligibility for Admission to Grade:", { x: 40, y: 198, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("Approved:", { x: 40, y: 178, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawLine({ start: { x: 135, y: 216 }, end: { x: 165, y: 216 }, thickness: .5 })
      page.drawText("Section:", { x: 170, y: 218, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 215, y: 216 }, end: { x: 370, y: 216 }, thickness: .5 })
      page.drawLine({ start: { x: 205, y: 196 }, end: { x: 370, y: 196 }, thickness: .5 })
      page.drawLine({ start: { x: 93, y: 176 }, end: { x: 215, y: 176 }, thickness: .5 })
      page.drawLine({ start: { x: 230, y: 176 }, end: { x: 370, y: 176 }, thickness: .5 })
      page.drawText("School Head", { x: 120, y: 165, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("Adviser", { x: 290, y: 165, size: 11, bold, color: rgb(0, 0, 0) })

      page.drawText("Cancellation of Eligibility to Transfer", { x: 110, y: 115, size: 11, font, color: rgb(0, 0, 0) })
      page.drawText("Admitted in: ", { x: 40, y: 80, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawText("Date: ", { x: 40, y: 60, size: 11, bold, color: rgb(0, 0, 0) })
      page.drawLine({ start: { x: 100, y: 78 }, end: { x: 370, y: 78 }, thickness: .5 })
      page.drawLine({ start: { x: 70, y: 58 }, end: { x: 185, y: 58 }, thickness: .5 })
      page.drawLine({ start: { x: 220, y: 58 }, end: { x: 370, y: 58 }, thickness: .5 })
      page.drawText("School Head", { x: 270, y: 45, size: 11, bold, color: rgb(0, 0, 0) })


      // PAGE 2 START
      page2.drawText("LEARNER’S PROGRESS REPORT CARD", { x: 90, y: 581, size: 12, font, color: rgb(0, 0, 0) })


      // First Semester
      page2.drawText("First Semester", { x: 30, y: 565, size: 10, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, 508, 345, 50, true)
      page2.drawLine({ start: { x: 30, y: 525 }, end: { x: 375, y: 525 }, thickness: .5 })
      page2.drawLine({ start: { x: 248, y: 543 }, end: { x: 322, y: 543 }, thickness: .5 })

      page2.drawLine({ start: { x: 248, y: 558 }, end: { x: 248, y: 525 }, thickness: .5 })
      page2.drawLine({ start: { x: 322, y: 558 }, end: { x: 322, y: 525 }, thickness: .5 })
      page2.drawLine({ start: { x: 287, y: 542 }, end: { x: 287, y: 525 }, thickness: .5 })

      // Core Subjects
      // First Row of Core Subjects
      // / Step 1: Filter by strand
      const filteredGrades = student.sr_student_grades.filter(
        g => g.subject_id?.strand === student.section_id?.section_name &&
        g.subject_id?.class_id === student.section_id?.class_id
      );


      // Step 2: Setup structure
      const semester = {
        sem1: {
          CORE: [],
          APPLIED: [],
          SPECIALIZED: [],
        },
        sem2: {
          CORE: [],
          APPLIED: [],
          SPECIALIZED: [],
        },
      };

      // Step 3: Helper to group and merge quarters
      const groupBySubject = (grades, quarters) => {
        const grouped = {};

        grades
          .filter(g => quarters.includes(g.quarter))
          .forEach(g => {
            const type = g.subject_id.type;
            const subjectKey = g.subject_id.subject;

            if (!grouped[type]) grouped[type] = {};

            if (!grouped[type][subjectKey]) {
              grouped[type][subjectKey] = {
                subject_id: g.subject_id,
                quarter1: null,
                quarter2: null,
              };
            }

            if (g.quarter === 1 || g.quarter === 3) {
              grouped[type][subjectKey].quarter1 = g.grade_mark;
            } else if (g.quarter === 2 || g.quarter === 4) {
              grouped[type][subjectKey].quarter2 = g.grade_mark;
            }
          });

        return Object.fromEntries(
          Object.entries(grouped).map(([type, subjects]) => [
            type,
            Object.values(subjects),
          ])
        );
      };

      // Step 4: Assign to semester
      const sem1Grouped = groupBySubject(filteredGrades, [1, 2]);
      const sem2Grouped = groupBySubject(filteredGrades, [3, 4]);

      semester.sem1 = { ...semester.sem1, ...sem1Grouped };
      semester.sem2 = { ...semester.sem2, ...sem2Grouped };

      // START

      let y = 488
      let sem1finalgrades = []
      let sem2finalgrades = []

      for (let index = 0; index < semester.sem1.CORE.length; index++) {
        const subject = semester.sem1.CORE[index]
        const q1 = subject.quarter1
        const q2 = subject.quarter2
        const finalGrade = q1 != null && q2 != null ? ((+q1 + +q2) / 2).toFixed(2) : ''
        sem1finalgrades.push(parseFloat(finalGrade))

        page2.drawText(`${subject.subject_id.subject}`, { x: 33, y: y + 5, size: 6.5, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter1 || ''}`, { x: 263, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter2 || ''}`, { x: 299, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${finalGrade || ''}`, { x: 340, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })

        drawRectangle2(30, y, 345, 20)
        page2.drawLine({ start: { x: 248, y: y }, end: { x: 248, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 287, y: y }, end: { x: 287, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 322, y: y }, end: { x: 322, y: y + 20 }, thickness: .5 })
        y -= 20
      }



      // Applied and Specialized Subjects
      drawRectangle2(30, y, 345, 20, true)
      page2.drawText("Applied and Specialized Subjects", { x: 35, y: y + 7, size: 9, font, color: rgb(0, 0, 0) })
      y -= 20

      //START

      for (let index = 0; index < semester.sem1.APPLIED.length; index++) {
        const subject = semester.sem1.APPLIED[index]
        const q1 = subject.quarter1
        const q2 = subject.quarter2
        const finalGrade = q1 != null && q2 != null ? ((+q1 + +q2) / 2).toFixed(2) : ''
        sem1finalgrades.push(parseFloat(finalGrade))

        page2.drawText(`${subject.subject_id.subject}`, { x: 33, y: y + 5, size: 6.5, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter1 || ''}`, { x: 263, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter2 || ''}`, { x: 299, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${finalGrade || ''}`, { x: 340, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })

        drawRectangle2(30, y, 345, 20)
        page2.drawLine({ start: { x: 248, y: y }, end: { x: 248, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 287, y: y }, end: { x: 287, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 322, y: y }, end: { x: 322, y: y + 20 }, thickness: .5 })
        y -= 20
      }

      for (let index = 0; index < semester.sem1.SPECIALIZED.length; index++) {
        const subject = semester.sem1.SPECIALIZED[index]
        const q1 = subject.quarter1
        const q2 = subject.quarter2
        const finalGrade = q1 != null && q2 != null ? ((+q1 + +q2) / 2).toFixed(2) : ''
        sem1finalgrades.push(parseFloat(finalGrade))

        page2.drawText(`${subject.subject_id.subject}`, { x: 33, y: y + 5, size: 6.5, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter1 || ''}`, { x: 263, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter2 || ''}`, { x: 299, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${finalGrade || ''}`, { x: 340, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })

        drawRectangle2(30, y, 345, 20)
        page2.drawLine({ start: { x: 248, y: y }, end: { x: 248, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 287, y: y }, end: { x: 287, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 322, y: y }, end: { x: 322, y: y + 20 }, thickness: .5 })
        y -= 20
      }

      let sem1average = '';

      if (sem1finalgrades.length > 0) {
        const avg = sem1finalgrades.reduce((a, b) => a + b, 0) / sem1finalgrades.length;
        sem1average = isNaN(avg) ? '' : avg.toFixed(2);
      }


      // GENERAL AVERAGE FOR THE SEMESTER
      drawRectangle2(322, y, 53, 20)
      page2.drawText(`${sem1average || ''}`, { x: 335, y: y + 6, size: 9, font, color: rgb(0, 0, 0) })

      page2.drawText("General Average for the Semester", { x: 172, y: y + 6, size: 9, font, color: rgb(0, 0, 0) })

      page2.drawText("Subjects", { x: 120, y: 540, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("Quarter", { x: 268, y: 547.5, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("1", { x: 265, y: 530, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("2", { x: 300, y: 530, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("Semester", { x: 330, y: 542, size: 8, font, color: rgb(0, 0, 0) })
      page2.drawText("Final Grade", { x: 326, y: 533, size: 8, font, color: rgb(0, 0, 0) })
      page2.drawText("Core Subjects", { x: 35, y: 513, size: 9, font, color: rgb(0, 0, 0) })


      // START SEMESTER 2

      y -= 80

      page2.drawText("Second Semester", { x: 30, y: y + 75, size: 10, font, color: rgb(0, 0, 0) })
      drawRectangle2(30, y + 20, 345, 50, true)
      page2.drawLine({ start: { x: 30, y: y + 37 }, end: { x: 375, y: y + 37 }, thickness: .5 })
      page2.drawLine({ start: { x: 248, y: y + 55 }, end: { x: 322, y: y + 55 }, thickness: .5 })
      page2.drawLine({ start: { x: 248, y: y + 70 }, end: { x: 248, y: y + 37 }, thickness: .5 })
      page2.drawLine({ start: { x: 322, y: y + 70 }, end: { x: 322, y: y + 37 }, thickness: .5 })
      page2.drawLine({ start: { x: 287, y: y + 55 }, end: { x: 287, y: y + 37 }, thickness: .5 })
      
      page2.drawText("Subjects", { x: 120, y: y +50, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("Quarter", { x: 268, y: y + 59, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("3", { x: 265, y: y + 43, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("4", { x: 300, y: y + 43, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText("Semester", { x: 330, y: y + 54, size: 8, font, color: rgb(0, 0, 0) })
      page2.drawText("Final Grade", { x: 326, y: y + 46, size: 8, font, color: rgb(0, 0, 0) })
      page2.drawText("Core Subjects", { x: 35, y: y + 25, size: 9, font, color: rgb(0, 0, 0) })

      // Core Subjects
      // First Row of Core Subjects

      for (let index = 0; index < semester.sem2.CORE.length; index++) {
        const subject = semester.sem2.CORE[index]
        const q1 = subject.quarter1
        const q2 = subject.quarter2
        const finalGrade = q1 != null && q2 != null ? ((+q1 + +q2) / 2).toFixed(2) : ''
        sem2finalgrades.push(parseFloat(finalGrade))

        page2.drawText(`${subject.subject_id.subject}`, { x: 33, y: y + 5, size: 6.5, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter1 || ''}`, { x: 263, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter2 || ''}`, { x: 299, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${finalGrade || ''}`, { x: 340, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })

        drawRectangle2(30, y, 345, 20)
        page2.drawLine({ start: { x: 248, y: y }, end: { x: 248, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 287, y: y }, end: { x: 287, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 322, y: y }, end: { x: 322, y: y + 20 }, thickness: .5 })

        y -= 20
      }

      // Applied and Specialized Subjects
      drawRectangle2(30, y, 345, 20, true)
      page2.drawText("Applied and Specialized Subjects", { x: 35, y: y + 6, size: 9, font, color: rgb(0, 0, 0) })
      y -= 20
      for (let index = 0; index < semester.sem2.APPLIED.length; index++) {
        const subject = semester.sem2.APPLIED[index]
        const q1 = subject.quarter1
        const q2 = subject.quarter2
        const finalGrade = q1 != null && q2 != null ? ((+q1 + +q2) / 2).toFixed(2) : ''
        sem2finalgrades.push(parseFloat(finalGrade))

        page2.drawText(`${subject.subject_id.subject}`, { x: 33, y: y + 5, size: 6.5, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter1 || ''}`, { x: 263, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter2 || ''}`, { x: 299, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${finalGrade || ''}`, { x: 340, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })

        drawRectangle2(30, y, 345, 20)
        page2.drawLine({ start: { x: 248, y: y }, end: { x: 248, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 287, y: y }, end: { x: 287, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 322, y: y }, end: { x: 322, y: y + 20 }, thickness: .5 })

        y -= 20
      }

      for (let index = 0; index < semester.sem2.SPECIALIZED.length; index++) {
        const subject = semester.sem2.SPECIALIZED[index]
        const q1 = subject.quarter1
        const q2 = subject.quarter2
        const finalGrade = q1 != null && q2 != null ? ((+q1 + +q2) / 2).toFixed(2) : ''
        sem2finalgrades.push(parseFloat(finalGrade))

        page2.drawText(`${subject.subject_id.subject}`, { x: 33, y: y + 5, size: 6.5, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter1 || ''}`, { x: 263, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${subject.quarter2 || ''}`, { x: 299, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })
        page2.drawText(`${finalGrade || ''}`, { x: 340, y: y + 5, size: 8, bold, color: rgb(0, 0, 0) })

        drawRectangle2(30, y, 345, 20)
        page2.drawLine({ start: { x: 248, y: y }, end: { x: 248, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 287, y: y }, end: { x: 287, y: y + 20 }, thickness: .5 })
        page2.drawLine({ start: { x: 322, y: y }, end: { x: 322, y: y + 20 }, thickness: .5 })

        y -= 20
      }
      let sem2average = '';

      if (sem2finalgrades.length > 0) {
        const avg = sem2finalgrades.reduce((a, b) => a + b, 0) / sem2finalgrades.length;
        sem2average = isNaN(avg) ? '' : avg.toFixed(2);
      }

      drawRectangle2(322, y, 53, 20)  // GENERAL AVERAGE FOR THE SEMESTER
      page2.drawText("General Average for the Semester", { x: 172, y: y + 6, size: 9, font, color: rgb(0, 0, 0) })
      page2.drawText(`${sem2average || ''}`, { x: 338, y: y + 6, size: 9, font, color: rgb(0, 0, 0) })




      // Right Side
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
      // START1

      const quarters = [q1values, q2values, q3values, q4values]
      const yCoordinates = [[505, 470], [435, 405], [378, 520], [335, 300]]
      let x = 655

      for (let index = 0; index <= 3; index++) {

        for (let i = 0; i <= 3; i++) {
          let mark = quarters[index][i]?.marking || {}
          page2.drawText(`${mark[1] || ''}`, { x: x, y: yCoordinates[i][0], size: 11, font, color: rgb(0, 0, 0) })
          page2.drawText(`${mark[2] || ''}`, { x: x, y: yCoordinates[i][1], size: 11, font, color: rgb(0, 0, 0) })
        }
        x+= 26
      }


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

      page2.drawText("Learner Progress and Achievement", { x: 425, y: 145, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Descriptors", { x: 445, y: 125, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Outstanding", { x: 445, y: 105, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Very Satisfactory ", { x: 445, y: 90, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Satisfactory", { x: 445, y: 75, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Fairly Satisfactory ", { x: 445, y: 60, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Did Not Meet Expectation", { x: 445, y: 45, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Grading Scale", { x: 565, y: 125, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("90-100", { x: 565, y: 105, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("85-89 ", { x: 565, y: 90, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("80-84", { x: 565, y: 75, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("75-79", { x: 565, y: 60, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Below 75", { x: 565, y: 45, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Remarks", { x: 685, y: 125, size: 10, font, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 685, y: 105, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 685, y: 90, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 685, y: 75, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Passed", { x: 685, y: 60, size: 10, bold, color: rgb(0, 0, 0) })
      page2.drawText("Failed", { x: 685, y: 45, size: 10, bold, color: rgb(0, 0, 0) })

      page2.drawText("Iniwasto ni:", { x: 35, y: 8, size: 8, bold, color: rgb(0, 0, 0) })





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

export default GenerateSF9