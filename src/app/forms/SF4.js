'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useState, useEffect } from 'react'


const GenerateSF4 = ({ onClose, date, array }) => {
  const [pdfURL, setPdfURL] = useState(null)


  const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  let selectedMonth = months[date.month]


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

      const rowHeight = 20 // Height of each row
      const startX = 30  // Left margin

      const rowWidth = 840 // Total table width
      let currentPage = pdfDoc.getPage(0)
      let rowCount = 0

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

      // Header -Start-
      page.drawText("School Form 4 (SF4) Monthly Learner's Movement and Attendance", { x: 205, y: 542, size: 11, font, color: rgb(0, 0, 0) })
      page.drawText('(This replaces Form 3 & STS Form 4-Absenteeism and Dropout Profile)', { x: 260, y: 532, size: 7 })

      page.drawText('School ID  301094', { x: 97, y: 503, size: 8, bold })
      drawRectangle(134, 500, 85, 13)

      page.drawText('School             Calubcub 1st National High School', { x: 47, y: 483, size: 8, bold })
      drawRectangle(97, 478, 277, 16)

      page.drawText('Region IV - A', { x: 225, y: 503, size: 8, bold })
      drawRectangle(251, 500, 35, 13)

      page.drawText('Division', { x: 300, y: 503, size: 8, bold })
      page.drawText('Division of Batangas, San Juan East Sub - Office', { x: 330, y: 503, size: 6.5, bold })
      drawRectangle(330, 500, 145, 13)

      page.drawText('District', { x: 478, y: 503, size: 8, bold })
      drawRectangle(504, 500, 122, 13)

      page.drawText('School Year', { x: 459, y: 483, size: 8, bold })
      page.drawText('2025 - 2026', { x: 510, y: 483, size: 8, bold })
      drawRectangle(504, 478, 75, 16)

      page.drawText('Report for the month of', { x: 589, y: 483, size: 8, bold })
      page.drawText(`${selectedMonth}`, { x: 680, y: 483, size: 8, bold })
      drawRectangle(674, 478, 75, 16)
      // Header End

      // fill up form || Columns
      drawRectangle(14, 419, 735, 56)
      page.drawLine({ start: { x: 42, y: 475 }, end: { x: 42, y: 419 }, thickness: 1.5 })
      page.drawLine({ start: { x: 92, y: 475 }, end: { x: 92, y: 419 }, thickness: 1.5 })
      page.drawLine({ start: { x: 186, y: 475 }, end: { x: 186, y: 419 }, thickness: 1.5 })
      page.drawLine({ start: { x: 233, y: 475 }, end: { x: 233, y: 419 }, thickness: 1.5 })
      page.drawLine({ start: { x: 326, y: 475 }, end: { x: 326, y: 419 }, thickness: 1.5 })
      page.drawLine({ start: { x: 468, y: 475 }, end: { x: 468, y: 419 }, thickness: 1.5 })
      page.drawLine({ start: { x: 609, y: 475 }, end: { x: 609, y: 419 }, thickness: 1.5 })

      // Horizontal Line
      page.drawLine({ start: { x: 233, y: 463.5 }, end: { x: 749, y: 463.5 }, thickness: 1.2 })
      page.drawLine({ start: { x: 186, y: 428 }, end: { x: 749, y: 428 }, thickness: 1 })

      // Vertical Lines
      page.drawLine({ start: { x: 278, y: 463.5 }, end: { x: 278, y: 419 }, thickness: 1 })
      page.drawLine({ start: { x: 373, y: 463.5 }, end: { x: 373, y: 419 }, thickness: 1 })
      page.drawLine({ start: { x: 420, y: 463.5 }, end: { x: 420, y: 419 }, thickness: 1 })
      page.drawLine({ start: { x: 515, y: 463.5 }, end: { x: 515, y: 419 }, thickness: 1 })
      page.drawLine({ start: { x: 562, y: 463.5 }, end: { x: 562, y: 419 }, thickness: 1 })
      page.drawLine({ start: { x: 657, y: 463.5 }, end: { x: 657, y: 419 }, thickness: 1 })
      page.drawLine({ start: { x: 704, y: 463.5 }, end: { x: 704, y: 419 }, thickness: 1 })

      // Smaller Vertical Lines
      page.drawLine({ start: { x: 202, y: 428 }, end: { x: 202, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 218, y: 428 }, end: { x: 218, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 249, y: 428 }, end: { x: 249, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 263, y: 428 }, end: { x: 263, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 294, y: 428 }, end: { x: 294, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 310, y: 428 }, end: { x: 310, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 342, y: 428 }, end: { x: 342, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 357, y: 428 }, end: { x: 357, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 389, y: 428 }, end: { x: 389, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 404, y: 428 }, end: { x: 404, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 436, y: 428 }, end: { x: 436, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 452, y: 428 }, end: { x: 452, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 483, y: 428 }, end: { x: 483, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 499, y: 428 }, end: { x: 499, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 531, y: 428 }, end: { x: 531, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 547, y: 428 }, end: { x: 547, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 578, y: 428 }, end: { x: 578, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 594, y: 428 }, end: { x: 594, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 625, y: 428 }, end: { x: 625, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 641, y: 428 }, end: { x: 641, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 672, y: 428 }, end: { x: 672, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 688, y: 428 }, end: { x: 688, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 718, y: 428 }, end: { x: 718, y: 419 }, thickness: .5 })
      page.drawLine({ start: { x: 732, y: 428 }, end: { x: 732, y: 419 }, thickness: .5 })
      // Header end

      // Header Texts
      page.drawText('ATTENDANCE', { x: 254, y: 466, size: 7, font })
      page.drawText('DROPPED OUT', { x: 370, y: 466, size: 7, font })
      page.drawText('TRANSFERRED OUT', { x: 503, y: 466, size: 7, font })
      page.drawText('TRANSFERRED IN', { x: 647, y: 466, size: 7, font })

      page.drawText('GRADE/', { x: 16, y: 453, size: 6 })
      page.drawText('YEAR', { x: 19, y: 446, size: 6 })
      page.drawText('LEVEL', { x: 18, y: 439, size: 6 })
      page.drawText('SECTION', { x: 53, y: 446, size: 6 })
      page.drawText('NAME OF ADVISER', { x: 110, y: 446, size: 6 })
      page.drawText('REGISTERED', { x: 190, y: 463, size: 6 })
      page.drawText('LEARNERS', { x: 193, y: 454, size: 6 })
      page.drawText('(As of End of', { x: 192, y: 447, size: 6 })
      page.drawText('the Month)', { x: 195, y: 440, size: 6 })
      page.drawText('Daily Average', { x: 237, y: 446, size: 6 })
      page.drawText('Percentage for', { x: 282, y: 448, size: 6 })
      page.drawText('the Month', { x: 288, y: 441, size: 6 })

      page.drawText('(A) Cumulative as', { x: 330, y: 448, size: 5 })
      page.drawText('of Previous Month', { x: 330, y: 441, size: 5 })
      page.drawText('(B) For the Month', { x: 377, y: 446, size: 5 })
      page.drawText('(A+B) Cumulative', { x: 424, y: 453, size: 5 })
      page.drawText('as of End of', { x: 428, y: 446, size: 6 })
      page.drawText('the Month', { x: 430, y: 439, size: 6 })

      page.drawText('(A) Cumulative as', { x: 471, y: 448, size: 5 })
      page.drawText('of Previous Month', { x: 471, y: 441, size: 5 })
      page.drawText('(B) For the Month', { x: 518, y: 446, size: 5 })
      page.drawText('(A+B) Cumulative', { x: 566, y: 453, size: 5 })
      page.drawText('as of End of', { x: 570, y: 446, size: 6 })
      page.drawText('the Month', { x: 572, y: 439, size: 6 })

      page.drawText('(A) Cumulative as', { x: 613, y: 448, size: 5 })
      page.drawText('of Previous Month', { x: 613, y: 441, size: 5 })
      page.drawText('(B) For the Month', { x: 660, y: 446, size: 5 })
      page.drawText('(A+B) Cumulative', { x: 707, y: 453, size: 5 })
      page.drawText('as of End of', { x: 711, y: 446, size: 6 })
      page.drawText('the Month', { x: 713, y: 439, size: 6 })

      const xPositions = [
        191, 208, 223, 238, 254, 268, 284, 300, 316, 332, 348, 363,
        378, 394, 410, 425, 442, 458, 474, 489, 505, 521, 537, 552,
        567, 583, 599, 615, 631, 647, 662, 678, 694, 708, 723, 738
      ]

      // Define the text pattern
      const textPattern = ['M', 'F', 'T']

      // Loop through the x positions and draw the text
      xPositions.forEach((x, index) => {
        const text = textPattern[index % textPattern.length]
        page.drawText(text, { x, y: 421, size: 6 })
      })


      // START OF MAPPING
      let y = 419 // Starting Y position
      const ydecrement = 12

      const thinLinePositions = [202, 218, 249, 263, 294, 310, 342, 357, 389, 404, 436, 452, 483, 499, 531, 547, 578, 594, 625, 641, 672, 688, 718, 732]
      const thickLinePositions = [42, 92, 186, 233, 326, 468, 609, 278, 373, 420, 515, 562, 657, 704]

      const drawVerticalLines = (positions, yStart, yEnd, thickness, startIndex = 0) => {
        positions.slice(startIndex).forEach(x => {
          currentPage.drawLine({ start: { x, y: yStart }, end: { x, y: yEnd }, thickness })
        })
      }

      let totalPerGradeLevel = {
        7: { M: 0, F: 0 },
        8: { M: 0, F: 0 },
        9: { M: 0, F: 0 },
        10: { M: 0, F: 0 },
        11: { M: 0, F: 0 },
        12: { M: 0, F: 0 },
      }

      Object.keys(array).forEach(grade => {
        array[grade].forEach(section => {

          const males = section.students.female.length
          const females = section.students.male.length

          totalPerGradeLevel[Number(grade)].M += males
          totalPerGradeLevel[Number(grade)].F += females

          // if (grade === '12') {
          //   console.log(totalPerGradeLevel)
          // }

          const lastName = section.adviser?.last_name || ''
          const firstName = section.adviser?.first_name || ''
          const middleName = section.adviser?.middle_name ? section.adviser.middle_name.charAt(0) + '.' : ''
          const fullName = `${lastName}, ${firstName} ${middleName}`.trim()
          const displayName = fullName === ',' ? 'N/A' : fullName

          page.drawText(`${displayName}`, { x: 95, y: y - 9, size: 8 })
          page.drawText(`${grade}`, { x: 23, y: y - 9, size: 8 })
          page.drawText(`${section.section_name}`, { x: 47, y: y - 9, size: 8 })
          page.drawText(`${males}`, { x: 190, y: y - 9, size: 8 })
          page.drawText(`${females}`, { x: 207, y: y - 9, size: 8 })
          page.drawText(`${females + males}`, { x: 222, y: y - 9, size: 8 })


          page.drawRectangle({
            x: 14,
            y: y - 12,
            width: 735,
            height: 12,
            borderColor: rgb(0, 0, 0),
            borderWidth: 0.5
          })
          drawVerticalLines(thickLinePositions, y, y - 12, 1)
          drawVerticalLines(thinLinePositions, y, y - 12, 0.5)
          y -= ydecrement
        })
      })

      // END OF MAPPING

      currentPage = pdfDoc.addPage([792, 612])
      y = 590
      currentPage.drawText('ELEMENTARY/SECONDARY:', { x: 16, y: y - 9, size: 7, font })
      currentPage.drawText('KINDER', { x: 80, y: y - 21, size: 7 })
      currentPage.drawText('GRADE 1/GRADE 7', { x: 64, y: y - 33, size: 7 })
      currentPage.drawText('GRADE 2/GRADE 8', { x: 64, y: y - 45, size: 7 })
      currentPage.drawText('GRADE 3/GRADE 9', { x: 64, y: y - 57, size: 7 })
      currentPage.drawText('GRADE 4/GRADE 10', { x: 64, y: y - 69, size: 7 })
      currentPage.drawText('GRADE 5/GRADE 11', { x: 64, y: y - 81, size: 7 })
      currentPage.drawText('GRADE 6/GRADE 12', { x: 64, y: y - 93, size: 7 })
      currentPage.drawText('TOTAL FOR NON-GRADED', { x: 54, y: y - 105, size: 7 })
      currentPage.drawText('TOTAL', { x: 84, y: y - 117, size: 7 })

      let overallTotal = {M: 0, F: 0}
      let gradelvlsectionstartY = 557
      Object.keys(totalPerGradeLevel).forEach(grade => {
        currentPage.drawText(`${totalPerGradeLevel[grade].M}`, { x: 190, y: gradelvlsectionstartY, size: 7 })
        currentPage.drawText(`${totalPerGradeLevel[grade].F}`, { x: 207, y: gradelvlsectionstartY, size: 7 })
        currentPage.drawText(`${totalPerGradeLevel[grade].F + totalPerGradeLevel[grade].M}`, { x: 222, y: gradelvlsectionstartY, size: 7 })

        overallTotal.M += totalPerGradeLevel[grade].M
        overallTotal.F += totalPerGradeLevel[grade].F
        
        gradelvlsectionstartY -= 12
      })

      currentPage.drawText(`${overallTotal.M}`, { x: 190, y: gradelvlsectionstartY-12, size: 7 })
      currentPage.drawText(`${overallTotal.F}`, { x: 207, y: gradelvlsectionstartY-12, size: 7 })
      currentPage.drawText(`${overallTotal.F+overallTotal.M}`, { x: 222, y: gradelvlsectionstartY-12, size: 7 })

      for (let i = 0; i < 10; i++) {
        currentPage.drawRectangle({
          x: 14,
          y: y - 12,
          width: 735,
          height: 12,
          borderColor: rgb(0, 0, 0),
          borderWidth: 0.5
        })

        drawVerticalLines(thickLinePositions, y, y - 12, 1, 2)
        drawVerticalLines(thinLinePositions, y, y - 12, 0.5)
        y -= 12
      }


      // Bottom Texts
      currentPage.drawText('GUIDELINES:', { x: 16, y: y - 12, size: 6 })
      currentPage.drawText('Prepared and Submitted by:', { x: 495, y: y - 12, size: 6, font })

      currentPage.drawText('1. This form shall be accomplished every end of the month using the summary box of SF2 submitted by the teachers/advisers to update figures for the month.', { x: 16, y: y - 22, size: 6 })
      currentPage.drawText('2. Furnish the Division Office with a copy a week after June 30, October 30 & March 31', { x: 16, y: y - 32, size: 6 })

      currentPage.drawLine({ start: { x: 562, y: y - 30 }, end: { x: 718, y: y - 30 }, thickness: .5 })
      currentPage.drawText('(Signature of School Head over Printed Name)', { x: 578, y: y - 37, size: 6 })

      currentPage.drawText('Page _____ of _____ pages', { x: 16, y: y - 48, size: 6 })

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

export default GenerateSF4