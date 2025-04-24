'use client'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useState, useEffect } from 'react'
import supabase from '../lib/supabaseClient'

const GenerateSF1 = ({ onClose, section, teacherName }) => {

  const [pdfURL, setPdfURL] = useState(null)
  const [studentUsers, setStudentsArray] = useState([])
  const [maleCount, setMaleCount] = useState(0)
  const [femaleCount, setFemaleCount] = useState(0)

  const fetchStudents = async () => {
    const userId = localStorage.getItem('user_id')
    if (!userId) return

    let { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('section_id', section.id)

    if (error) {
      console.error('Error fetching user:', error)
      return
    }

    setStudentsArray(data)

    const males = data.filter(student => student.sex === 'M').length
    const females = data.filter(student => student.sex === 'F').length

    setMaleCount(males)
    setFemaleCount(females)

  }

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (studentUsers.length > 0) {
      generatePDF()
    }
  }, [studentUsers])

  const generatePDF = async () => {

    let studentCount = studentUsers.length
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([910, 549])
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

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
      const { width, height } = image.scale(0.68) // Resize image
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
        x: 30,
        y: 468,
        width,
        height,
      })

      // Header -Start-
      page.drawText('School Form 1 (SF 1) School Register', { x: 390, y: 528, size: 7, font, color: rgb(0, 0, 0) })
      page.drawText('(This replaces Form 1, Master List & STS Form 2-Family Background and Profile)', { x: 380, y: 521, size: 4 })

      page.drawText('School ID  301094', { x: 150, y: 500, size: 9, bold })
      drawRectangle(192, 495, 40, 18)
      page.drawText('School Name  Calubcub 1st National High School', { x: 135, y: 480, size: 9, bold })
      drawRectangle(192, 473, 150, 18)
      page.drawText('Region VIII', { x: 250, y: 500, size: 9, bold })

      page.drawText('Division', { x: 350, y: 500, size: 9, bold })
      page.drawText('Division of Batangas, San Juan East Sub - Office', { x: 387, y: 501, size: 7, bold })
      drawRectangle(385, 495, 155, 18)
      page.drawText(`School Year`, { x: 383, y: 480, size: 9, bold })
      page.drawText(`2025`, { x: 470, y: 478, size: 12, bold })
      drawRectangle(435, 473, 105, 18)

      page.drawText('District', { x: 570, y: 500, size: 9, bold })
      drawRectangle(600, 495, 150, 18)
      page.drawText('Grade Level', { x: 548, y: 480, size: 9, bold })
      // get class_id of teacher
      page.drawText(`${section.classid}`, { x: 618, y: 478, size: 12, bold })

      drawRectangle(600, 473, 50, 18)

      page.drawText('Section', { x: 675, y: 480, size: 9, bold })
      page.drawText(section.name, { x: 710, y: 480, size: 9, bold })
      drawRectangle(708, 473, 110, 18)
      //Header -End-


      // fill up form || Columns
      drawRectangle(30, 420, 840, 45)
      page.drawLine({ start: { x: 35, y: 465 }, end: { x: 35, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 110, y: 465 }, end: { x: 110, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 225, y: 465 }, end: { x: 225, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 243, y: 465 }, end: { x: 243, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 283, y: 465 }, end: { x: 283, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 308, y: 465 }, end: { x: 308, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 343, y: 465 }, end: { x: 343, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 378, y: 465 }, end: { x: 378, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 415, y: 465 }, end: { x: 415, y: 420 }, thickness: 0.5 })
      // Address
      page.drawLine({ start: { x: 452, y: 453 }, end: { x: 452, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 489, y: 453 }, end: { x: 489, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 526, y: 453 }, end: { x: 526, y: 420 }, thickness: 0.5 })
      // Parents
      page.drawLine({ start: { x: 568, y: 465 }, end: { x: 568, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 632, y: 453 }, end: { x: 632, y: 420 }, thickness: 0.5 })

      page.drawLine({ start: { x: 700, y: 465 }, end: { x: 700, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 740, y: 453 }, end: { x: 740, y: 420 }, thickness: 0.5 })

      page.drawLine({ start: { x: 780, y: 465 }, end: { x: 780, y: 420 }, thickness: 0.5 })
      page.drawLine({ start: { x: 833, y: 465 }, end: { x: 833, y: 420 }, thickness: 0.5 })

      // horizontal lines
      page.drawLine({ start: { x: 780, y: 453 }, end: { x: 415, y: 453 }, thickness: 0.5 })
      page.drawLine({ start: { x: 833, y: 453 }, end: { x: 870, y: 453 }, thickness: 0.5 })

      // column headers
      page.drawText('LRN', { x: 65, y: 440, size: 7, font })
      page.drawText('NAME', { x: 155, y: 445, size: 7, font })
      page.drawText("(Last Name, First Name,\n       Middle Name)", { x: 138, y: 440, size: 5, font, lineHeight: 6.5 })
      page.drawText('SEX\n(M/F)', { x: 228.5, y: 443, size: 5, font, lineHeight: 6.5 })

      page.drawText('BIRTH DATE', { x: 245, y: 440, size: 6, font })
      page.drawText('AGE', { x: 290, y: 440, size: 6, font })
      page.drawText('MOTHER\nTONGUE', { x: 315, y: 443, size: 5, font, lineHeight: 6.5 })
      page.drawText('IP', { x: 357, y: 440, size: 7, font })
      page.drawText('RELIGION', { x: 383, y: 440, size: 6, font })

      page.drawText('ADDRESS', { x: 475, y: 456, size: 7, font })
      page.drawText('House # / \nStreet /\nSitio / Purok', { x: 418, y: 442, size: 5.5, font, lineHeight: 6.5 })
      page.drawText('Barangay', { x: 458, y: 435, size: 5.5, font, lineHeight: 6.5 })
      page.drawText('Municipality/\n       City', { x: 491, y: 438, size: 5.5, font, lineHeight: 6.5 })
      page.drawText('Province', { x: 535, y: 435, size: 5.5, font, lineHeight: 6.5 })

      page.drawText('PARENTS', { x: 620, y: 456, size: 7, font })
      page.drawText("Father's Name", { x: 580, y: 440, size: 6, font, lineHeight: 6.5 })
      page.drawText("(Last Name, First Name,\n       Middle Name)", { x: 573, y: 434, size: 5, font, lineHeight: 6.5 })
      page.drawText("Mother's Maiden Name", { x: 633, y: 440, size: 6, font, lineHeight: 6.5 })
      page.drawText("(Last Name, First Name,\n       Middle Name)", { x: 640, y: 434, size: 5, font, lineHeight: 6.5 })

      page.drawText('GUARDIAN', { x: 720, y: 456, size: 7, font })
      page.drawText('Name', { x: 713, y: 435, size: 5.5, font })
      page.drawText('Relationship', { x: 743, y: 435, size: 5.5, font })

      page.drawText('CONTACT NUMBER\n                OF \nPARENT/GUARDIAN', { x: 782, y: 447, size: 5, font, lineHeight: 6.5 })
      page.drawText('REMARKS', { x: 837, y: 457, size: 6, font })
      page.drawText('(Please refer \nto the legend\non last page)', { x: 836, y: 443, size: 5, font, lineHeight: 6.5 })

      for (let i = 0; i < studentCount; i++) {
        if (rowCount >= 20) {
          // Add a new page after 20 rows
          currentPage = pdfDoc.addPage([910, 549])
          rowCount = 0 // Reset row count for the new page
          startY = 500
        }

        let y = startY - rowCount * rowHeight

        // Draw horizontal row
        currentPage.drawRectangle({
          x: startX,
          y: y,
          width: rowWidth,
          height: rowHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })

        // Column lines
        const columnPositions = [35, 110, 225, 243, 283, 308, 343, 378, 415, 452, 489, 526, 568, 632, 700, 740, 780, 833]

        columnPositions.forEach(x => {
          currentPage.drawLine({
            start: { x, y: y + rowHeight },
            end: { x, y },
            thickness: 0.5
          })
        })

        rowCount++

        let student = studentUsers[i]

        let name = `${student.lastname}, ${student.firstname} ${student.middlename}`
        let fathersname = `${student.parents.father.lastname}, \n${student.parents.father.firstname} ${student.parents.father.middlename}`
        let mothersname = `${student.parents.mother.lastname}, \n${student.parents.mother.firstname} ${student.parents.mother.middlename}`

        currentPage.drawText((student.lrn || '').toString(), { x: 40, y: y + 6, size: 8, font })
        currentPage.drawText(name || '', { x: 115, y: y + 6, size: 6, font })
        currentPage.drawText(student.sex || '', { x: 230, y: y + 6, size: 6, font })
        currentPage.drawText(student.birthdate || '', { x: 247, y: y + 6, size: 6, font })
        currentPage.drawText((student.age || '').toString(), { x: 290, y: y + 6, size: 6, font })
        currentPage.drawText(student.mothertongue || '', { x: 310, y: y + 6, size: 6, font })
        currentPage.drawText(student.ip || '', { x: 346, y: y + 6, size: 6, font })
        currentPage.drawText(student.religion || '', { x: 379, y: y + 6, size: 4.5, font })

        currentPage.drawText(student.address?.houseStreet || '', { x: 420, y: y + 6, size: 5, font })
        currentPage.drawText(student.address?.barangay || '', { x: 453, y: y + 6, size: 5, font })
        currentPage.drawText(student.address?.municipality || '', { x: 490, y: y + 6, size: 5, font })
        currentPage.drawText(student.address?.province || '', { x: 530, y: y + 6, size: 5, font })

        currentPage.drawText(fathersname || '', { x: 570, y: y + 10, size: 5.5, font, lineHeight: 5.5 })
        currentPage.drawText(mothersname || '', { x: 635, y: y + 10, size: 5.5, font, lineHeight: 5.5 })

        currentPage.drawText(student.guardian?.name || '', { x: 701, y: y + 5, size: 6, font })
        currentPage.drawText(student.guardian?.relationship || '', { x: 745, y: y + 5, size: 6, font })

        currentPage.drawText(student.contactNumber || '', { x: 785, y: y + 5, size: 6, font })
        currentPage.drawText(student.remarks.sf1 || '', { x: 838, y: y + 5, size: 6, font })
      }

      if (studentCount > 15 && studentCount <= 20) {
        currentPage = pdfDoc.addPage([910, 549])
      }

      //Footer -Start-
      currentPage.drawText('List and Code of Indicators under Remarks column', { x: 180, y: 105, size: 9, font })
      currentPage.drawRectangle({
        x: 30,
        y: 30,
        width: 500,
        height: 70,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })
      currentPage.drawText('Indicator', { x: 32, y: 90, size: 9, font })
      currentPage.drawLine({ start: { x: 100, y: 100 }, end: { x: 100, y: 30 }, thickness: 0.5 })
      currentPage.drawText('Code', { x: 103, y: 90, size: 9, font })
      currentPage.drawLine({ start: { x: 130, y: 100 }, end: { x: 130, y: 30 }, thickness: 0.5 })
      currentPage.drawText('Required Information', { x: 140, y: 90, size: 9, font })
      currentPage.drawLine({ start: { x: 305, y: 100 }, end: { x: 305, y: 30 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 330, y: 100 }, end: { x: 330, y: 30 }, thickness: 0.5 })
      currentPage.drawText('Code', { x: 335, y: 90, size: 9, font })
      currentPage.drawLine({ start: { x: 365, y: 100 }, end: { x: 365, y: 30 }, thickness: 0.5 })
      currentPage.drawText('Required Information', { x: 370, y: 90, size: 9, font })
      currentPage.drawLine({ start: { x: 30, y: 88 }, end: { x: 530, y: 88 }, thickness: 0.5 })
      currentPage.drawText('Transferred Out', { x: 32, y: 77, size: 8, font })
      currentPage.drawText('T/O', { x: 105, y: 77, size: 8, font })
      currentPage.drawText('Name of Public (P) Private (PR) School & Effectivity Date', { x: 132, y: 77, size: 6.3, font })
      currentPage.drawText('CCT', { x: 337, y: 77, size: 8, font })
      currentPage.drawText('CCT Control/reference number & Effectivity Date', { x: 370, y: 77, size: 6.5, font })

      currentPage.drawText('Transferred In', { x: 32, y: 63, size: 8, font })
      currentPage.drawText('T/I', { x: 105, y: 63, size: 8, font })
      currentPage.drawText('Name of Public (P) Private (PR) School & Effectivity Date', { x: 132, y: 63, size: 6.3, font })
      currentPage.drawText('B/A', { x: 337, y: 63, size: 8, font })
      currentPage.drawText('Name of school last attended & Year', { x: 370, y: 63, size: 8, font })

      currentPage.drawText('Dropped', { x: 32, y: 48, size: 8, font })
      currentPage.drawText('DRP', { x: 105, y: 48, size: 8, font })
      currentPage.drawText('Reason and Effectivity Date', { x: 132, y: 48, size: 8, font })
      currentPage.drawText('LWD', { x: 337, y: 48, size: 8, font })
      currentPage.drawText('Specify', { x: 370, y: 48, size: 8, font })

      currentPage.drawText('Late Enrollment', { x: 32, y: 33, size: 8, font })
      currentPage.drawText('LE', { x: 105, y: 33, size: 8, font })
      currentPage.drawText('Reason (Enrollment beyond 1st Friday of June)', { x: 132, y: 33, size: 7, font })
      currentPage.drawText('ACL', { x: 337, y: 33, size: 8, font })
      currentPage.drawText('Specify Level and Effective Data', { x: 370, y: 33, size: 8, font })

      currentPage.drawRectangle({
        x: 533,
        y: 30,
        width: 100,
        height: 70,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5
      })
      currentPage.drawLine({ start: { x: 566, y: 100 }, end: { x: 566, y: 30 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 599, y: 100 }, end: { x: 599, y: 30 }, thickness: 0.5 })

      currentPage.drawLine({ start: { x: 533, y: 88 }, end: { x: 633, y: 88 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 533, y: 70 }, end: { x: 633, y: 70 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 533, y: 50 }, end: { x: 633, y: 50 }, thickness: 0.5 })
      currentPage.drawText('Registered', { x: 537, y: 92, size: 5, font })
      currentPage.drawText('MALE', { x: 540, y: 77, size: 6, font })
      currentPage.drawText(`${maleCount}`, { x: 578, y: 77, size: 7, font })
      currentPage.drawText('FEMALE', { x: 537, y: 58, size: 6, font })
      currentPage.drawText(`${femaleCount}`, { x: 578, y: 58, size: 7, font })
      currentPage.drawText('TOTAL', { x: 539, y: 38, size: 6, font })
      currentPage.drawText(`${femaleCount + maleCount}`, { x: 578, y: 38, size: 7, font })
      currentPage.drawText('BoSY', { x: 572, y: 91, size: 7, font })
      currentPage.drawText('EoSY', { x: 605, y: 91, size: 7, font })


      currentPage.drawLine({ start: { x: 640, y: 30 }, end: { x: 740, y: 30 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 640, y: 70 }, end: { x: 740, y: 70 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 770, y: 30 }, end: { x: 870, y: 30 }, thickness: 0.5 })
      currentPage.drawLine({ start: { x: 770, y: 70 }, end: { x: 870, y: 70 }, thickness: 0.5 })
      currentPage.drawText('BoSY Date:            EoSY Date:', { x: 640, y: 32, size: 7, bold })
      currentPage.drawText('BoSY Date:            EoSY Date:', { x: 770, y: 32, size: 7, bold })
      currentPage.drawText(teacherName.toUpperCase(), { x: 645, y: 72, size: 6, bold })
      currentPage.drawText('(Signature of Adviser over Printed Name)', { x: 645, y: 65, size: 5, bold })
      currentPage.drawText('(Signature of School Head over Printed Name)', { x: 770, y: 65, size: 5, bold })
      currentPage.drawText('Prepared By:', { x: 640, y: 100, size: 9, bold })
      currentPage.drawText('Certified Correct:', { x: 770, y: 100, size: 9, bold })

      // Footer -End-




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
        <button className='absolute top-[1px] right-[10px] cursor-pointer text-base md:text-2xl border-none bg-none sm:text-lg' onClick={onClose}>✖</button>
        {pdfURL ? (
          <iframe src={pdfURL} width="100%" height="2000px" />
        ) : (
          <p>Generating PDF...</p>
        )}
      </div>
    </div>
  )
}

export default GenerateSF1