'use client'

import { PDFDocument, rgb, StandardFonts, degrees, drawText } from 'pdf-lib'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

const GenerateSF10SHS = ({ onClose, student }) => {

  const [pdfURL, setPdfURL] = useState(null)
  const [allsubjects, setSubjects] = useState([])



  const fetchSubjects = async () => {
    const { data, error } = await supabase
      .from('sr_subject')
      .select('id, type, class_id, strand, semester, subject')
      .eq('strand', student.section_id.section_name)
    if (error) {
      console.error('Error fetching students:', error)
    } else {
      setSubjects(data)
    }
  }

  useEffect(() => {
    fetchSubjects()
    console.log(student)
  }, [])

  useEffect(() => {

    generatePDF()
  }, [allsubjects])

  const generatePDF = async () => {

    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      // const page = pdfDoc.addPage([792, 612]) // STANDARD SIZE
      const page = pdfDoc.addPage([612, 1008]) // LANDSCAPE VERSION
      const page2 = pdfDoc.addPage([612, 1008]) // LANDSCAPE VERSION
      // const page3 = pdfDoc.addPage([612, 1008]) // LANDSCAPE VERSION
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
      const { width, height } = image.scale(0.5) // Resize image

      // Draw the image
      page.drawImage(image, {
        x: 106,
        y: 943,
        width,
        height,
      })

      const drawRectangle = (x, y, w, h, fill = false, border = true) => {
        page.drawRectangle({
          x: x,
          y: y,
          width: w,
          height: h,
          color: fill ? rgb(0.75, 0.75, 0.75) : undefined,
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
          color: fill ? rgb(0.75, 0.75, 0.75) : undefined,
          borderColor: border ? rgb(0, 0, 0) : undefined,
          borderWidth: border ? 0.5 : undefined,
        })
      }

      const filteredGrades = student.sr_student_grades.filter(
        g => g.subject_id?.strand === student.section_id?.section_name
      )

      const filteredbyGradeLevel = {
        11: filteredGrades.filter(
          g => g.subject_id?.class_id === 11),
        12: filteredGrades.filter(
          g => g.subject_id?.class_id === 12)
      }

      const subjectsBySem = {
        11: {
          sem1: filteredbyGradeLevel[11].filter(
            g => g.quarter === 1 || g.quarter === 2
          ),
          sem2: filteredbyGradeLevel[11].filter(
            g => g.quarter === 3 || g.quarter === 4
          ),
        },
        12: {
          sem1: filteredbyGradeLevel[12].filter(
            g => g.quarter === 1 || g.quarter === 2
          ),
          sem2: filteredbyGradeLevel[12].filter(
            g => g.quarter === 3 || g.quarter === 4
          ),
        }
      }

      function mergeQuarterPairs(arr) {
        const map = new Map();

        arr.forEach(rec => {
          const subjKey = rec.subject_id.id;
          const isFirstHalf = rec.quarter === 1 || rec.quarter === 3;
          const isSecondHalf = rec.quarter === 2 || rec.quarter === 4;

          if (!map.has(subjKey)) {
            map.set(subjKey, {
              subject_id: rec.subject_id,
              q1grade: null,
              q2grade: null
            });
          }

          const obj = map.get(subjKey);
          if (isFirstHalf) obj.q1grade = rec.grade_mark;
          if (isSecondHalf) obj.q2grade = rec.grade_mark;
        });

        return Array.from(map.values());
      }

      const subjectsBySemMerged = {
        11: {
          sem1: mergeQuarterPairs(subjectsBySem[11].sem1),   // Q1 + Q2
          sem2: mergeQuarterPairs(subjectsBySem[11].sem2)    // Q3 + Q4
        },
        12: {
          sem1: mergeQuarterPairs(subjectsBySem[12].sem1),
          sem2: mergeQuarterPairs(subjectsBySem[12].sem2)
        }
      };

      // Function to group subjects by their type (CORE, APPLIED, SPECIALIZED)
      function groupByType(subjects) {
        return subjects.reduce((acc, subj) => {
          const type = subj.subject_id.type.toUpperCase();  // Ensure case-insensitive grouping
          if (!acc[type]) acc[type] = [];
          acc[type].push(subj);
          return acc;
        }, {});
      }

      const groupedSubjectsBySem = {
        11: {
          sem1: groupByType(subjectsBySemMerged[11].sem1),
          sem2: groupByType(subjectsBySemMerged[11].sem2)
        },
        12: {
          sem1: groupByType(subjectsBySemMerged[12].sem1),
          sem2: groupByType(subjectsBySemMerged[12].sem2)
        }
      };



      // START
      page.drawText('REPUBLIC OF THE PHILIPPINES', { x: 240, y: 985, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('DEPARTMENT OF EDUCATION', { x: 243, y: 970, size: 9, bold, color: rgb(0, 0, 0) })
      page.drawText('SENIOR HIGH SCHOOL STUDENT PERMANENT RECORD', { x: 185, y: 950, size: 9, font, color: rgb(0, 0, 0) })

      page.drawText('SF10-SHS', { x: 555, y: 980, size: 7, font, color: rgb(0, 0, 0) })


      drawRectangle(18, 925, 567, 10, true, false) // LEARNER'S INFORMATION
      page.drawText("LEARNER'S INFORMATION", { x: 250, y: 927, size: 8, font, color: rgb(0, 0, 0) })

      page.drawText("LAST NAME: ___________________________________ FIRST NAME: ___________________________________________ MIDDLE NAME:______________________________", { x: 18, y: 917, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.lastname}`, { x: 65, y: 917, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.firstname}`, { x: 248, y: 917, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.middlename}`, { x: 470, y: 917, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText("LRN: ___________________________________ Date of Birth (YYYY/MM/DD): ______________________ Sex: ___________ Date of SHS Admission (YYYY/MM/DD): __________", { x: 18, y: 907, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText(`${student.lrn}`, { x: 40, y: 907, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.birthdate}`, { x: 280, y: 907, size: 7, bold, color: rgb(0, 0, 0) })

      page.drawText(`${student.sex}`, { x: 380, y: 907, size: 7, bold, color: rgb(0, 0, 0) })

      drawRectangle(18, 891, 567, 10, true, false) // ELIGIBILITY FOR SHS ENROLMENT
      page.drawText("ELIGIBILITY FOR SHS ENROLMENT", { x: 237, y: 893, size: 8, font, color: rgb(0, 0, 0) })

      page.drawText("High School Completer*    Gen. Ave: ______              Junior High School Completer     Gen. Ave: ______", { x: 28, y: 881, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText("Date of Graduation/Completion (MM/DD/YYYY): ______________ Name of School: _________________________________ School Address: _______________________________", { x: 18, y: 871, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText("PEPT Passer**     Rating: _________                         ALS A&E Passer***  Rating: _________     Others (Pls. Specify): ________________________________________________", { x: 28, y: 861, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText("Date of Examination/Assessment (MM/DD/YYYY): ___________         Name and Address of Community Learning Center: ________________________________________________", { x: 18, y: 851, size: 7, bold, color: rgb(0, 0, 0) })
      page.drawText("*High School Completers are students who graduated from secondary school under the old curriculum                            ***ALS A&E - Alternative Learning System Accreditation and Equivalency Test for JHS", { x: 18, y: 841, size: 6, bold, color: rgb(0, 0, 0) })
      page.drawText("**PEPT - Philippine Educational Placement Test for JHS", { x: 18, y: 831, size: 6, bold, color: rgb(0, 0, 0) })

      drawRectangle(18, 818, 567, 10, true, false) // SCHOLASTIC RECORD
      page.drawText("SCHOLASTIC RECORD", { x: 255, y: 820, size: 8, font, color: rgb(0, 0, 0) })

      let y1 = 810

      for (let gradeindex = 0; gradeindex <= 1; gradeindex++) {
        const gradeLevel = gradeindex === 1 ? groupedSubjectsBySem[12] : groupedSubjectsBySem[11]

        if (gradeindex === 1) {
          currentPage = pdfDoc.getPage(1)
        }
        for (let index = 0; index <= 1; index++) {
          // if (index === 1) {
          //   let gradeLevel = groupedSubjectsBySem[12]
          // }
          // 1ST TABLE
          currentPage.drawText("SCHOOL: ______________________________________________________ SCHOOL ID: _______________ GRADE LEVEL: ___________ SY: ______________ SEM: _______", { x: 18, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("CALUBCUB 1ST NATIONAL HIGH SCHOOL", { x: 55, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("301094", { x: 320, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          if (gradeindex === 1) {
            currentPage.drawText("12", { x: 430, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          } else {
            currentPage.drawText("11", { x: 430, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          }

          currentPage.drawText("2025 - 2026", { x: 490, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          if (index === 1) {
            currentPage.drawText("2", { x: 560, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          } else {
            currentPage.drawText("1", { x: 560, y: y1, size: 7, font, color: rgb(0, 0, 0) })
          }
          currentPage.drawText("TRACK/STRAND: _____________________________________________________________________________   SECTION: ___________________________________________", { x: 18, y: y1 - 10, size: 7, font, color: rgb(0, 0, 0) })

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

          currentPage.drawText(`${strand || ''}`, { x: 80, y: y1 - 10, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText(`${student.section_id.section_name || ''}`, { x: 430, y: y1 - 10, size: 7, font, color: rgb(0, 0, 0) })


          currentPage.drawRectangle({
            x: 18,
            y: y1 - 45,
            width: 567,
            height: 31,
            color: true ? rgb(0.75, 0.75, 0.75) : undefined,
            borderColor: true ? rgb(0, 0, 0) : undefined,
            borderWidth: true ? 0.5 : undefined,
          })
          currentPage.drawLine({ start: { x: 90, y: y1 - 14 }, end: { x: 90, y: y1 - 45 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 420, y: y1 - 14 }, end: { x: 420, y: y1 - 45 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 459, y: y1 - 30 }, end: { x: 459, y: y1 - 45 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 497, y: y1 - 14 }, end: { x: 497, y: y1 - 45 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 544, y: y1 - 14 }, end: { x: 544, y: y1 - 45 }, thickness: .5 })

          currentPage.drawLine({ start: { x: 420, y: y1 - 30 }, end: { x: 497, y: y1 - 30 }, thickness: .5 })

          // SCHOLASTIC RECORD TABLE HEADER TEXTS
          currentPage.drawText("Indicate if Subject is ", { x: 20, y: y1 - 27, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("CORE, APPLIED, or", { x: 20, y: y1 - 33, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("SPECIALIZED", { x: 30, y: y1 - 40, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("SUBJECTS", { x: 235, y: y1 - 30, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("Quarter", { x: 446, y: y1 - 25, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("SEM FINAL      ACTION", { x: 502, y: y1 - 37, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("GRADE           TAKEN", { x: 507, y: y1 - 27, size: 7, font, color: rgb(0, 0, 0) })


          // START G11 SEM 1
          let gwa = 0
          const semBucket = index === 1 ? gradeLevel.sem2   // 1 → second semester
            : gradeLevel.sem1;
          // START CORE
          for (let i = 0; i < semBucket.CORE?.length; i++) {
            const sem = semBucket.CORE[i];

            currentPage.drawText(`${sem.subject_id.subject || ''}`, { x: 94, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.subject_id.type || ''}`, { x: 20, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.q1grade || ''}`, { x: 435, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.q2grade || ''}`, { x: 473, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })


            if (sem.q1grade !== null && sem.q2grade !== null) {
              currentPage.drawText(`${(sem.q2grade + sem.q1grade) / 2 || ''}`, { x: 515, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
              if (((sem.q2grade + sem.q1grade) / 2) >= 75) {
                currentPage.drawText(`Passed`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
                gwa += (sem.q2grade + sem.q1grade) / 2
              } else {
                currentPage.drawText(`Failed`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
                gwa += (sem.q2grade + sem.q1grade) / 2
              }
            }

            currentPage.drawRectangle({
              x: 18,
              y: y1 - 59,
              width: 567,
              height: 14,
              borderColor: rgb(0, 0, 0),
              borderWidth: 0.5
            })
            currentPage.drawLine({ start: { x: 90, y: y1 - 45 }, end: { x: 90, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 459, y: y1 - 45 }, end: { x: 459, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 497, y: y1 - 45 }, end: { x: 497, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 544, y: y1 - 45 }, end: { x: 544, y: y1 - 73 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 420, y: y1 - 45 }, end: { x: 420, y: y1 - 59 }, thickness: .5 })
            y1 -= 14
          }

          // START APPLIED
          for (let i = 0; i < semBucket.APPLIED?.length; i++) {
            const sem = semBucket.APPLIED[i]

            currentPage.drawText(`${sem.subject_id.subject || ''}`, { x: 94, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.subject_id.type || ''}`, { x: 20, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.q1grade || ''}`, { x: 435, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.q2grade || ''}`, { x: 473, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })


            if (sem.q1grade !== null && sem.q2grade !== null) {
              currentPage.drawText(`${(sem.q2grade + sem.q1grade) / 2 || ''}`, { x: 515, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
              if (((sem.q2grade + sem.q1grade) / 2) >= 75) {
                currentPage.drawText(`Passed`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
                gwa += (sem.q2grade + sem.q1grade) / 2
              } else {
                currentPage.drawText(`Failed`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
                gwa += (sem.q2grade + sem.q1grade) / 2
              }
            }

            currentPage.drawRectangle({
              x: 18,
              y: y1 - 59,
              width: 567,
              height: 14,
              borderColor: rgb(0, 0, 0),
              borderWidth: 0.5
            })
            currentPage.drawLine({ start: { x: 90, y: y1 - 45 }, end: { x: 90, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 459, y: y1 - 45 }, end: { x: 459, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 497, y: y1 - 45 }, end: { x: 497, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 544, y: y1 - 45 }, end: { x: 544, y: y1 - 73 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 420, y: y1 - 45 }, end: { x: 420, y: y1 - 59 }, thickness: .5 })
            y1 -= 14
          }



          // START SPECIALIZED
          for (let i = 0; i < semBucket.SPECIALIZED?.length; i++) {
            const sem = semBucket.SPECIALIZED[i]

            currentPage.drawText(`${sem.subject_id.subject || ''}`, { x: 94, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.subject_id.type || ''}`, { x: 20, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.q1grade || ''}`, { x: 435, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
            currentPage.drawText(`${sem.q2grade || ''}`, { x: 473, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })


            if (sem.q1grade !== null && sem.q2grade !== null) {
              currentPage.drawText(`${(sem.q2grade + sem.q1grade) / 2 || ''}`, { x: 515, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
              if (((sem.q2grade + sem.q1grade) / 2) >= 75) {
                currentPage.drawText(`Passed`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
                gwa += (sem.q2grade + sem.q1grade) / 2
              } else {
                currentPage.drawText(`Failed`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
                gwa += (sem.q2grade + sem.q1grade) / 2
              }
            }

            currentPage.drawRectangle({
              x: 18,
              y: y1 - 59,
              width: 567,
              height: 14,
              borderColor: rgb(0, 0, 0),
              borderWidth: 0.5
            })
            currentPage.drawLine({ start: { x: 90, y: y1 - 45 }, end: { x: 90, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 459, y: y1 - 45 }, end: { x: 459, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 497, y: y1 - 45 }, end: { x: 497, y: y1 - 59 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 544, y: y1 - 45 }, end: { x: 544, y: y1 - 73 }, thickness: .5 })
            currentPage.drawLine({ start: { x: 420, y: y1 - 45 }, end: { x: 420, y: y1 - 59 }, thickness: .5 })
            y1 -= 14
          }

          if (index === 0) {
            const divider = gradeLevel.sem1.CORE?.length + gradeLevel.sem1.APPLIED?.length + gradeLevel.sem1.SPECIALIZED?.length
            const finalgwa = (gwa / divider).toFixed(2)
            currentPage.drawText(`${finalgwa || ''}`, { x: 515, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
          } else {
            const divider = gradeLevel.sem2.CORE?.length + gradeLevel.sem2.APPLIED?.length + gradeLevel.sem2.SPECIALIZED?.length
            const finalgwa = (gwa / divider).toFixed(2)
            currentPage.drawText(`${finalgwa || ''}`, { x: 515, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
          }



          if (finalgwa => 75) {
            currentPage.drawText(`PASSED`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
          } else {
            currentPage.drawText(`FAILED`, { x: 550, y: y1 - 55, size: 7, font, color: rgb(0, 0, 0) })
          }


          y1 += 14
          // General Ave. for the Semester:
          currentPage.drawRectangle({
            x: 18,
            y: y1 - 73,
            width: 479,
            height: 14,
            color: true ? rgb(0.75, 0.75, 0.75) : undefined,
            borderColor: true ? rgb(0, 0, 0) : undefined,
            borderWidth: true ? 0.5 : undefined,
          })
          currentPage.drawRectangle({
            x: 18,
            y: y1 - 73,
            width: 567,
            height: 14,
            color: false ? rgb(0.75, 0.75, 0.75) : undefined,
            borderColor: true ? rgb(0, 0, 0) : undefined,
            borderWidth: true ? 0.5 : undefined,
          })

          currentPage.drawText("General Ave. for the Semester:", { x: 390, y: y1 - 69, size: 7, font, color: rgb(0, 0, 0) })

          currentPage.drawText("REMARKS: _______________________________________________________________________________________________________________________________________", { x: 18, y: y1 - 82, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("Prepared by:                                                                          Certified True and Correct:                                                                     Date Checked (MM/DD/YYYY):", { x: 18, y: y1 - 92, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("_____________________________________________                      __________________________________________                         ___________________________________", { x: 18, y: y1 - 112, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("Signature of Adviser over Printed Name                            Signature of Authorized Person over Printed Name, Designation", { x: 42, y: y1 - 122, size: 7, bold, color: rgb(0, 0, 0) })

          currentPage.drawText(`${student.section_id.adviser?.first_name || ''} ${student.section_id.adviser?.middle_name || ''} ${student.section_id.adviser?.last_name || ''}`, { x: 42, y: y1 - 110, size: 7, bold, color: rgb(0, 0, 0) })


          currentPage.drawText("REMEDIAL CLASSES        Conducted from (MM/DD/YYYY): _________   to (MM/DD/YYYY): __________ SCHOOL: ___________________________ SCHOOL ID: ___________", { x: 18, y: y1 - 135, size: 7, font, color: rgb(0, 0, 0) })


          currentPage.drawRectangle({
            x: 18,
            y: y1 - 170,
            width: 567,
            height: 31,
            color: true ? rgb(0.75, 0.75, 0.75) : undefined,
            borderColor: true ? rgb(0, 0, 0) : undefined,
            borderWidth: true ? 0.5 : undefined,
          })
          currentPage.drawLine({ start: { x: 90, y: y1 - 139 }, end: { x: 90, y: y1 - 170 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 420, y: y1 - 139 }, end: { x: 420, y: y1 - 170 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 459, y: y1 - 139 }, end: { x: 459, y: y1 - 170 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 497, y: y1 - 139 }, end: { x: 497, y: y1 - 170 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 544, y: y1 - 139 }, end: { x: 544, y: y1 - 170 }, thickness: .5 })

          currentPage.drawRectangle({
            x: 18,
            y: y1 - 184,
            width: 567,
            height: 14,
            color: false ? rgb(0.75, 0.75, 0.75) : undefined,
            borderColor: true ? rgb(0, 0, 0) : undefined,
            borderWidth: true ? 0.5 : undefined,
          })
          currentPage.drawLine({ start: { x: 90, y: y1 - 170 }, end: { x: 90, y: y1 - 184 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 420, y: y1 - 170 }, end: { x: 420, y: y1 - 184 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 459, y: y1 - 170 }, end: { x: 459, y: y1 - 184 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 497, y: y1 - 170 }, end: { x: 497, y: y1 - 184 }, thickness: .5 })
          currentPage.drawLine({ start: { x: 544, y: y1 - 170 }, end: { x: 544, y: y1 - 184 }, thickness: .5 })

          // REMEDIAL
          currentPage.drawText("Indicate if Subject is ", { x: 20, y: y1 - 148, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("CORE, APPLIED, or", { x: 20, y: y1 - 158, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("SPECIALIZED", { x: 30, y: y1 - 168, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("SUBJECTS", { x: 235, y: y1 - 155, size: 7, font, color: rgb(0, 0, 0) })
          currentPage.drawText("SEM FINAL", { x: 423, y: y1 - 150, size: 6, font, color: rgb(0, 0, 0) })
          currentPage.drawText("GRADE", { x: 427, y: y1 - 160, size: 6, font, color: rgb(0, 0, 0) })
          currentPage.drawText("REMEDIAL", { x: 463, y: y1 - 150, size: 6, font, color: rgb(0, 0, 0) })
          currentPage.drawText("CLASS", { x: 463, y: y1 - 158, size: 6, font, color: rgb(0, 0, 0) })
          currentPage.drawText("MARK", { x: 463, y: y1 - 166, size: 6, font, color: rgb(0, 0, 0) })
          currentPage.drawText("RECOMPUTED      ACTION", { x: 499, y: y1 - 153, size: 6, font, color: rgb(0, 0, 0) })
          currentPage.drawText("FINAL GRADE       TAKEN", { x: 500, y: y1 - 163, size: 6, font, color: rgb(0, 0, 0) })

          currentPage.drawText("Name of Teacher/Adviser: __________________________________________________________________________________   Signature: ________________________________", { x: 20, y: y1 - 196, size: 7, bold, color: rgb(0, 0, 0) })

          y1 -= 230
        }
        y1 += 850
      }
      // DULO
      // Page 2
      page2.drawText("Page 2                                                                                                                                                                                                                                                                   SF10-SHS", { x: 20, y: 994, size: 7, bold, color: rgb(0, 0, 0) })
      page2.drawLine({ start: { x: 20, y: 991 }, end: { x: 580, y: 991 }, thickness: 1 })











































      // Page 3
      // const drawCheckbox = (page, x, y) => {
      //   page.drawRectangle({
      //     x,
      //     y,
      //     width: 12,
      //     height: 12,
      //     borderColor: rgb(0, 0, 0),
      //     borderWidth: 1,
      //   });
      // };

      // const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      // let y = 900;

      // const drawLine = (yCoord) => {
      //   page3.drawLine({
      //     start: { x: 50, y: yCoord },
      //     end: { x: 545, y: yCoord },
      //     thickness: 1,
      //     color: rgb(0, 0, 0),
      //   });
      // };

      // const subjects = {
      //   core: allsubjects.filter(s => s.type === 'CORE'),
      //   applied: allsubjects.filter(s => s.type === 'APPLIED'),
      //   specialized: allsubjects.filter(s => s.type === 'SPECIALIZED')
      // };



      // // Header
      // page3.drawText("SF10-SHS", {
      //   x: 500,
      //   y,
      //   size: 10,
      //   font: fontBold,
      // });

      // y -= 20;
      // page3.drawText("ANNEX: LIST OF SUBJECTS TAKEN", {
      //   x: 50,
      //   y,
      //   size: 12,
      //   font: fontBold,
      // });

      // y -= 15;
      // page3.drawText("Please check the subjects passed by the student", {
      //   x: 50,
      //   y,
      //   size: 10,
      //   font,
      // });

      // y -= 20;
      // page3.drawText("CORE SUBJECTS", { x: 50, y, size: 10, font: fontBold });

      // y -= 15;
      // for (const subject of subjects.core) {
      //   drawCheckbox(page3, 50, y - 2);
      //   page3.drawText(`${subject.subject}`, { x: 70, y, size: 10, font });
      //   y -= 15;
      // }


      // y -= 5;
      // page3.drawText("Subject substitutions, if any:", { x: 50, y, size: 10, font });

      // y -= 20;
      // drawCheckbox(page3, 50, y - 2);
      // page3.drawLine({ start: { x: 70, y: y + 5 }, end: { x: 545, y: y + 5 }, thickness: 1 });

      // y -= 25;
      // drawLine(y);

      // y -= 10;
      // page3.drawText("APPLIED SUBJECTS", { x: 50, y, size: 10, font: fontBold });

      // y -= 15;
      // for (const subject of subjects.applied) {
      //   drawCheckbox(page3, 50, y - 2);
      //   page3.drawText(`${subject.subject}`, { x: 70, y, size: 10, font });
      //   y -= 15;
      // }

      // y -= 10;
      // page3.drawText("SPECIALIZED SUBJECTS (Please write the list of subjects below)", {
      //   x: 50,
      //   y,
      //   size: 10,
      //   font: fontBold,
      // });

      // y -= 15;
      // for (const subject of subjects.specialized) {
      //   drawCheckbox(page3, 50, y - 2);
      //   page3.drawText(`${subject.subject}`, { x: 70, y, size: 10, font });
      //   y -= 15;
      // }




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

export default GenerateSF10SHS