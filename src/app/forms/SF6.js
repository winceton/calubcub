'use client'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { useState, useEffect } from 'react'


const GenerateSF6 = ({ onClose, sections }) => {

    const [pdfURL, setPdfURL] = useState(null)


    const reorganized = {};

    for (const grade in sections) {
        const male = [];
        const female = [];

        sections[grade].forEach(section => {
            section.students.forEach(student => {
                if (student.sex === 'M') {
                    male.push(student);
                } else if (student.sex === 'F') {
                    female.push(student);
                }
            });
        });

        reorganized[grade] = { male, female };
    }

    for (const grade in reorganized) {
        ['male', 'female'].forEach(sex => {
            reorganized[grade][sex] = reorganized[grade][sex].map(student => {
                const section = student.section_id;

                if (parseInt(grade) <= 10) {
                    student.jr_student_grades = student.jr_student_grades.filter(
                        g => g.class_id === section.id
                    );
                }

                if (parseInt(grade) >= 11) {
                    student.sr_student_grades = student.sr_student_grades.filter(
                        g =>
                            g.subject_id.class_id === section.class_id &&
                            g.subject_id.strand === section.section_name
                    );
                }

                return student;
            });
        });
    }


    console.log(sections, 'SECTIONS')
    console.log(reorganized, 'TETST')

    let summary = {
        7: {
            male: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
            female: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
        },
        8: {
            male: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
            female: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
        },
        9: {
            male: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
            female: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
        },
        10: {
            male: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
            female: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
        },
        11: {
            male: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
            female: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
        },
        12: {
            male: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
            female: {
                promoted: 0,
                conditional: 0,
                retained: 0,
                didnotmeet: 0,
                fairlyS: 0,
                satisfactory: 0,
                verySatisfactory: 0,
                outstanding: 0,
                total: 0
            },
        },
    }


    for (const gradeKey in reorganized) {
        const grade = Number(gradeKey); // convert "7" to 7, etc.
        const males = reorganized[gradeKey].male;
        const females = reorganized[gradeKey].female

        for (const male of males) {
            let validGrades = []
            let average = 0
            let failingSubjects = []

            if (grade >= 11) {
                validGrades = male.sr_student_grades.filter(
                    g => g.grade_mark !== null && !isNaN(g.grade_mark)
                );
                if (validGrades.length <= 24) continue
                const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0);
                average = (total / validGrades.length).toFixed(2);

                failingSubjects = validGrades
                    .filter(g => parseFloat(g.grade_mark) < 75)
                    .map(g => g.subject_id.subject);
            } else {
                validGrades = male.jr_student_grades.filter(
                    g => g.grade_mark !== null && !isNaN(g.grade_mark)
                );

                if (validGrades.length !== 40) continue; // skip if not complete

                const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0);
                average = (total / 40).toFixed(2);

                failingSubjects = validGrades
                    .filter(g => parseFloat(g.grade_mark) < 75)
                    .map(g => g.subject_id.subject);
            }

            const failingCount = failingSubjects.length;

            // Promotion
            if (failingCount === 0) {
                summary[grade].male.promoted++;
            } else if (failingCount <= 2) {
                summary[grade].male.conditional++;
            } else {
                summary[grade].male.retained++;
            }

            // Performance level
            const avg = parseFloat(average);
            if (!isNaN(avg)) {
                if (avg <= 74) {
                    summary[grade].male.didnotmeet++;
                } else if (avg <= 79) {
                    summary[grade].male.fairlyS++;
                } else if (avg <= 84) {
                    summary[grade].male.satisfactory++;
                } else if (avg <= 89) {
                    summary[grade].male.verySatisfactory++;
                } else if (avg <= 100) {
                    summary[grade].male.outstanding++;
                }
            }

            summary[grade].male.total++;
        }

        for (const female of females) {
            let validGrades = []
            let average = 0
            let failingSubjects = []

            if (grade >= 11) {
                validGrades = female.sr_student_grades.filter(
                    g => g.grade_mark !== null && !isNaN(g.grade_mark)
                );

                if (validGrades.length <= 40) continue

                const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0);
                average = (total / validGrades.length).toFixed(2);

                failingSubjects = validGrades
                    .filter(g => parseFloat(g.grade_mark) < 75)
                    .map(g => g.subject_id.subject);
            } else {
                validGrades = female.jr_student_grades.filter(
                    g => g.grade_mark !== null && !isNaN(g.grade_mark)
                );

                if (validGrades.length !== 40) continue; // skip if not complete

                const total = validGrades.reduce((sum, g) => sum + parseFloat(g.grade_mark), 0);
                average = (total / 40).toFixed(2);

                failingSubjects = validGrades
                    .filter(g => parseFloat(g.grade_mark) < 75)
                    .map(g => g.subject_id.subject);
            }

            const failingCount = failingSubjects.length;

            // Promotion
            if (failingCount === 0) {
                summary[grade].female.promoted++;
            } else if (failingCount <= 2) {
                summary[grade].female.conditional++;
            } else {
                summary[grade].female.retained++;
            }

            // Performance level
            const avg = parseFloat(average);
            if (!isNaN(avg)) {
                if (avg <= 74) {
                    summary[grade].female.didnotmeet++;
                } else if (avg <= 79) {
                    summary[grade].female.fairlyS++;
                } else if (avg <= 84) {
                    summary[grade].female.satisfactory++;
                } else if (avg <= 89) {
                    summary[grade].female.verySatisfactory++;
                } else if (avg <= 100) {
                    summary[grade].female.outstanding++;
                }
            }

            summary[grade].female.total++;
        }
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

            let columnX = 132

            let maleTotalPromoted = 0
            let maleTotalConditional = 0
            let maleTotalRetained = 0
            let maleTotalDidNotMeet = 0
            let maleTotalFairlyS = 0
            let maleTotalSatisfactory = 0
            let maleTotalVerySatisfactory = 0
            let maleTotalOutstanding = 0
            let maleTotal = 0

            let femaleTotalPromoted = 0
            let femaleTotalConditional = 0
            let femaleTotalRetained = 0
            let femaleTotalDidNotMeet = 0
            let femaleTotalFairlyS = 0
            let femaleTotalSatisfactory = 0
            let femaleTotalVerySatisfactory = 0
            let femaleTotalOutstanding = 0
            let femaleTotal = 0

            for (let i = 7; i <= 12; i++) {
                let maledataNumber = summary[i].male
                let femaledataNumber = summary[i].female

                maleTotalPromoted += maledataNumber.promoted
                maleTotalConditional += maledataNumber.conditional
                maleTotalRetained += maledataNumber.retained
                maleTotalDidNotMeet += maledataNumber.didnotmeet
                maleTotalFairlyS += maledataNumber.fairlyS
                maleTotalSatisfactory += maledataNumber.satisfactory
                maleTotalVerySatisfactory += maledataNumber.verySatisfactory
                maleTotalOutstanding += maledataNumber.outstanding
                maleTotal += maledataNumber.total

                femaleTotalPromoted += femaledataNumber.promoted
                femaleTotalConditional += femaledataNumber.conditional
                femaleTotalRetained += femaledataNumber.retained
                femaleTotalDidNotMeet += femaledataNumber.didnotmeet
                femaleTotalFairlyS += femaledataNumber.fairlyS
                femaleTotalSatisfactory += femaledataNumber.satisfactory
                femaleTotalVerySatisfactory += femaledataNumber.verySatisfactory
                femaleTotalOutstanding += femaledataNumber.outstanding
                femaleTotal += femaledataNumber.total

                //MALE
                page.drawText(`${maledataNumber.promoted}`, { x: columnX, y: 407, size: 8, bold })
                page.drawText(`${maledataNumber.conditional}`, { x: columnX, y: 390, size: 8, bold })
                page.drawText(`${maledataNumber.retained}`, { x: columnX, y: 373, size: 8, bold })
                page.drawText(`${maledataNumber.didnotmeet}`, { x: columnX, y: 319, size: 8, bold })
                page.drawText(`${maledataNumber.fairlyS}`, { x: columnX, y: 290, size: 8, bold })
                page.drawText(`${maledataNumber.satisfactory}`, { x: columnX, y: 258, size: 8, bold })
                page.drawText(`${maledataNumber.verySatisfactory}`, { x: columnX, y: 223, size: 8, bold })
                page.drawText(`${maledataNumber.outstanding}`, { x: columnX, y: 195, size: 8, bold })
                page.drawText(`${maledataNumber.total}`, { x: columnX, y: 168, size: 8, bold })

                //FEMALE
                page.drawText(`${femaledataNumber.promoted}`, { x: columnX + 30, y: 407, size: 8, bold })
                page.drawText(`${femaledataNumber.conditional}`, { x: columnX + 30, y: 390, size: 8, bold })
                page.drawText(`${femaledataNumber.retained}`, { x: columnX + 30, y: 373, size: 8, bold })
                page.drawText(`${femaledataNumber.didnotmeet}`, { x: columnX + 30, y: 319, size: 8, bold })
                page.drawText(`${femaledataNumber.fairlyS}`, { x: columnX + 30, y: 290, size: 8, bold })
                page.drawText(`${femaledataNumber.satisfactory}`, { x: columnX + 30, y: 258, size: 8, bold })
                page.drawText(`${femaledataNumber.verySatisfactory}`, { x: columnX + 30, y: 223, size: 8, bold })
                page.drawText(`${femaledataNumber.outstanding}`, { x: columnX + 30, y: 195, size: 8, bold })
                page.drawText(`${femaledataNumber.total}`, { x: columnX + 30, y: 168, size: 8, bold })

                //TOTAL
                page.drawText(`${femaledataNumber.promoted + maledataNumber.promoted}`, { x: columnX + 60, y: 407, size: 8, bold })
                page.drawText(`${femaledataNumber.conditional + maledataNumber.conditional}`, { x: columnX + 60, y: 390, size: 8, bold })
                page.drawText(`${femaledataNumber.retained + maledataNumber.retained}`, { x: columnX + 60, y: 373, size: 8, bold })
                page.drawText(`${femaledataNumber.didnotmeet + maledataNumber.didnotmeet}`, { x: columnX + 60, y: 319, size: 8, bold })
                page.drawText(`${femaledataNumber.fairlyS + maledataNumber.fairlyS}`, { x: columnX + 60, y: 290, size: 8, bold })
                page.drawText(`${femaledataNumber.satisfactory + maledataNumber.satisfactory}`, { x: columnX + 60, y: 258, size: 8, bold })
                page.drawText(`${femaledataNumber.verySatisfactory + maledataNumber.verySatisfactory}`, { x: columnX + 60, y: 223, size: 8, bold })
                page.drawText(`${femaledataNumber.outstanding + maledataNumber.outstanding}`, { x: columnX + 60, y: 195, size: 8, bold })
                page.drawText(`${femaledataNumber.total + maledataNumber.total}`, { x: columnX + 60, y: 168, size: 8, bold })

                const x = {
                    7: 95,
                    8: 87,
                    9: 87,
                    10: 87,
                    11: 87,
                    12: 0,
                }
                columnX += x[i]
            }

            //MALE

            page.drawText(`${maleTotalPromoted}`, { x: 670, y: 407, size: 8, bold })
            page.drawText(`${maleTotalConditional}`, { x: 670, y: 390, size: 8, bold })
            page.drawText(`${maleTotalRetained}`, { x: 670, y: 373, size: 8, bold })
            page.drawText(`${maleTotalDidNotMeet}`, { x: 670, y: 319, size: 8, bold })
            page.drawText(`${maleTotalFairlyS}`, { x: 670, y: 290, size: 8, bold })
            page.drawText(`${maleTotalSatisfactory}`, { x: 670, y: 258, size: 8, bold })
            page.drawText(`${maleTotalVerySatisfactory}`, { x: 670, y: 223, size: 8, bold })
            page.drawText(`${maleTotalOutstanding}`, { x: 670, y: 195, size: 8, bold })
            page.drawText(`${maleTotal}`, { x: 670, y: 168, size: 8, bold })
            
            //FEMALE
            page.drawText(`${femaleTotalPromoted}`, { x: 700, y: 407, size: 8, bold })
            page.drawText(`${femaleTotalConditional}`, { x: 700, y: 390, size: 8, bold })
            page.drawText(`${femaleTotalRetained}`, { x: 700, y: 373, size: 8, bold })
            page.drawText(`${femaleTotalDidNotMeet}`, { x: 700, y: 319, size: 8, bold })
            page.drawText(`${femaleTotalFairlyS}`, { x: 700, y: 290, size: 8, bold })
            page.drawText(`${femaleTotalSatisfactory}`, { x: 700, y: 258, size: 8, bold })
            page.drawText(`${femaleTotalVerySatisfactory}`, { x: 700, y: 223, size: 8, bold })
            page.drawText(`${femaleTotalOutstanding}`, { x: 700, y: 195, size: 8, bold })
            page.drawText(`${femaleTotal}`, { x: 700, y: 168, size: 8, bold })

            //TOTAL
            page.drawText(`${femaleTotalPromoted + maleTotalPromoted}`, { x: 733, y: 407, size: 8, bold })
            page.drawText(`${femaleTotalConditional + maleTotalConditional}`, { x: 733, y: 390, size: 8, bold })
            page.drawText(`${femaleTotalRetained + maleTotalRetained}`, { x: 733, y: 373, size: 8, bold })
            page.drawText(`${femaleTotalDidNotMeet + maleTotalDidNotMeet}`, { x: 733, y: 319, size: 8, bold })
            page.drawText(`${femaleTotalFairlyS + maleTotalFairlyS}`, { x: 733, y: 290, size: 8, bold })
            page.drawText(`${femaleTotalSatisfactory + maleTotalSatisfactory}`, { x: 733, y: 258, size: 8, bold })
            page.drawText(`${femaleTotalVerySatisfactory + maleTotalVerySatisfactory}`, { x: 733, y: 223, size: 8, bold })
            page.drawText(`${femaleTotalOutstanding + maleTotalOutstanding}`, { x: 733, y: 195, size: 8, bold })
            page.drawText(`${femaleTotal + maleTotal}`, { x: 733, y: 168, size: 8, bold })

            // Header START
            page.drawText('School Form 6 (SF6)', { x: 355, y: 563, size: 12, font, color: rgb(0, 0, 0) })
            page.drawText('Summarized Report on Promotion and Learning Progress & Achievement', { x: 235, y: 548, size: 11, font, color: rgb(0, 0, 0) })
            page.drawText('Revised to conform with the instructions of Deped Order 8, s. 2015', { x: 260, y: 535, size: 7 })

            page.drawText('School ID', { x: 82, y: 512, size: 9, bold })
            page.drawText('301094', { x: 130, y: 512, size: 10, bold })
            drawRectangle(123, 504, 75, 0)

            page.drawText('School Name', { x: 57, y: 487, size: 9, bold })
            page.drawText('Calubcub 1st National High School', { x: 130, y: 487, size: 9, bold })
            drawRectangle(123, 479, 227, 0)

            page.drawText('Region', { x: 209, y: 512, size: 9, bold })
            page.drawText('IV - A', { x: 290, y: 512, size: 9, bold })
            drawRectangle(275, 504, 75, 0)

            page.drawText('Division', { x: 416, y: 512, size: 9, bold })
            page.drawText('Division of Batangas, San Juan East Sub - Office', { x: 452, y: 512, size: 8.5, bold })
            drawRectangle(451, 504, 200, 0)

            page.drawText('District', { x: 420, y: 487, size: 9, bold })
            drawRectangle(451, 479, 105, 0)

            page.drawText('School Year', { x: 629, y: 487, size: 9, bold })
            page.drawText('2025 - 2026', { x: 685, y: 487, size: 9, bold })
            drawRectangle(681, 479, 70, 0)

            drawRectangle(14, 160, 740, 314)
            page.drawLine({ start: { x: 122, y: 474 }, end: { x: 122, y: 160 }, thickness: 1.5 })
            page.drawLine({ start: { x: 217, y: 474 }, end: { x: 217, y: 160 }, thickness: 1.5 })
            page.drawLine({ start: { x: 307, y: 474 }, end: { x: 307, y: 160 }, thickness: 1.5 })
            page.drawLine({ start: { x: 394, y: 474 }, end: { x: 394, y: 160 }, thickness: 1.5 })
            page.drawLine({ start: { x: 478, y: 474 }, end: { x: 478, y: 160 }, thickness: 1.5 })
            page.drawLine({ start: { x: 568, y: 474 }, end: { x: 568, y: 160 }, thickness: 1.5 })
            page.drawLine({ start: { x: 661, y: 474 }, end: { x: 661, y: 160 }, thickness: 1.5 })

            page.drawLine({ start: { x: 122, y: 434 }, end: { x: 754, y: 434 }, thickness: 1.5 })
            page.drawLine({ start: { x: 14, y: 419 }, end: { x: 754, y: 419 }, thickness: 1.5 })
            page.drawLine({ start: { x: 14, y: 401 }, end: { x: 754, y: 401 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 385 }, end: { x: 754, y: 385 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 367 }, end: { x: 754, y: 367 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 336 }, end: { x: 754, y: 336 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 306 }, end: { x: 754, y: 306 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 280 }, end: { x: 754, y: 280 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 240 }, end: { x: 754, y: 240 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 212 }, end: { x: 754, y: 212 }, thickness: 0.5 })
            page.drawLine({ start: { x: 14, y: 182 }, end: { x: 754, y: 182 }, thickness: 0.5 })

            page.drawLine({ start: { x: 150, y: 434 }, end: { x: 150, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 183, y: 434 }, end: { x: 183, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 243, y: 434 }, end: { x: 243, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 276, y: 434 }, end: { x: 276, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 331, y: 434 }, end: { x: 331, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 366, y: 434 }, end: { x: 366, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 418, y: 434 }, end: { x: 418, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 452, y: 434 }, end: { x: 452, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 504, y: 434 }, end: { x: 504, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 539, y: 434 }, end: { x: 539, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 595, y: 434 }, end: { x: 595, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 627, y: 434 }, end: { x: 627, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 690, y: 434 }, end: { x: 690, y: 160 }, thickness: 0.5 })
            page.drawLine({ start: { x: 722, y: 434 }, end: { x: 722, y: 160 }, thickness: 0.5 })

            page.drawText('SUMMARY TABLE', { x: 30, y: 442, size: 7, font })
            page.drawText('GRADE 1 /GRADE 7', { x: 135, y: 452, size: 7, font })
            page.drawText('GRADE 2 / GRADE 8 ', { x: 230, y: 452, size: 7, font })
            page.drawText('GRADE 3 / GRADE 9', { x: 315, y: 452, size: 7, font })
            page.drawText('GRADE 4 / GRADE 10 ', { x: 400, y: 452, size: 7, font })
            page.drawText('GRADE 5 / GRADE 11', { x: 485, y: 452, size: 7, font })
            page.drawText('GRADE 6 / GRADE 12 ', { x: 580, y: 452, size: 7, font })
            page.drawText('TOTAL', { x: 695, y: 452, size: 7, font })

            page.drawText('MALE', { x: 125, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 152, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 188, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 125, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 152, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 188, y: 349, size: 7, bold })

            page.drawText('MALE', { x: 220, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 245, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 281, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 220, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 245, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 281, y: 349, size: 7, bold })

            page.drawText('MALE', { x: 309, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 334, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 368, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 309, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 334, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 368, y: 349, size: 7, bold })

            page.drawText('MALE', { x: 397, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 422, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 453.5, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 397, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 422, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 453.5, y: 349, size: 7, bold })

            page.drawText('MALE', { x: 482, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 507, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 541, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 482, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 507, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 541, y: 349, size: 7, bold })

            page.drawText('MALE', { x: 572, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 597, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 631, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 572, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 597, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 631, y: 349, size: 7, bold })

            page.drawText('MALE', { x: 665, y: 424, size: 7, bold })
            page.drawText('FEMALE', { x: 692, y: 424, size: 7, bold })
            page.drawText('TOTAL', { x: 726, y: 424, size: 7, bold })

            page.drawText('MALE', { x: 665, y: 349, size: 7, bold })
            page.drawText('FEMALE', { x: 692, y: 349, size: 7, bold })
            page.drawText('TOTAL', { x: 726, y: 349, size: 7, bold })




            page.drawText('PROMOTED', { x: 16, y: 407, size: 7, font })
            page.drawText('CONDITIONAL', { x: 16, y: 390, size: 7, font })
            page.drawText('RETAINED', { x: 16, y: 374, size: 7, font })
            page.drawText('LEARNING PROGRESS & ', { x: 24, y: 359, size: 7, font })
            page.drawText('ACHIEVEMENT (based on ', { x: 24, y: 349, size: 7, font })
            page.drawText("Learners' General Average)", { x: 21, y: 339, size: 7, font })

            page.drawText("Did Not Meet Expectations", { x: 23, y: 325, size: 7, font })
            page.drawText("( 74 and below)", { x: 46, y: 315, size: 7, font })

            page.drawText("Fairly Satisfactory ", { x: 33, y: 295, size: 7, font })
            page.drawText("( 75-79)", { x: 46, y: 285, size: 7, font })

            page.drawText("Satisfactory ", { x: 40, y: 265, size: 7, font })
            page.drawText("( 80-84)", { x: 46, y: 255, size: 7, font })

            page.drawText("Very Satisfactory ", { x: 33, y: 230, size: 7, font })
            page.drawText("( 85-89)", { x: 46, y: 220, size: 7, font })

            page.drawText("Outstanding", { x: 40, y: 200, size: 7, font })
            page.drawText("( 90-100)", { x: 46, y: 190, size: 7, font })

            page.drawText("TOTAL", { x: 50, y: 169, size: 7, font })

            page.drawText("Revised as of 3/10/2016 SFRT", { x: 16, y: 152, size: 6.5, font })

            page.drawText("Prepared and Submitted by: ", { x: 16, y: 132, size: 6.5, bold })
            page.drawText("Reviewed & Validated by:", { x: 240, y: 132, size: 6.5, bold })
            page.drawText("Noted by:", { x: 456, y: 132, size: 6.5, bold })

            page.drawLine({ start: { x: 120, y: 132 }, end: { x: 210, y: 132 }, thickness: 0.5 })
            page.drawLine({ start: { x: 330, y: 132 }, end: { x: 430, y: 132 }, thickness: 0.5 })
            page.drawLine({ start: { x: 500, y: 132 }, end: { x: 680, y: 132 }, thickness: 0.5 })

            page.drawText("SCHOOL HEAD", { x: 140, y: 122, size: 6.5, bold })
            page.drawText("DIVISION REPRESENTATIVE", { x: 336, y: 122, size: 6.5, bold })
            page.drawText("SCHOOLS DIVISION SUPERINTENDENT", { x: 528, y: 122, size: 6.5, bold })

            page.drawText("GUIDELINES:", { x: 16, y: 102, size: 6.5, font })
            page.drawText("1. After receiving and validating the Report for Promotion submitted by the class adviser, the School Head shall compute the grade level total and school total.", { x: 34, y: 92, size: 6.5, bold })
            page.drawText("2. This report together with the copy of Report for Promotion submitted by the class adviser shall be forwarded to the Division Office by the end of the school year.", { x: 34, y: 82, size: 6.5, bold })
            page.drawText("3. The Report on Promotion per grade level is reflected in the End of School Year Report of GESP/GSSP.", { x: 34, y: 72, size: 6.5, bold })
            page.drawText("4. Protocols of validation & submission is under the discretion of the Schools Division Superintendent.", { x: 34, y: 62, size: 6.5, bold })

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

export default GenerateSF6