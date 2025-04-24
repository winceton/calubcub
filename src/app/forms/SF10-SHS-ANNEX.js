'use client'

import React from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const PdfReplica = () => {
  const drawCheckbox = (page, x, y) => {
    page.drawRectangle({
      x,
      y,
      width: 12,
      height: 12,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
  };

  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = 800;

    const drawLine = (yCoord) => {
      page.drawLine({
        start: { x: 50, y: yCoord },
        end: { x: 545, y: yCoord },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    };

    const subjects = {
      core: [
        "Oral Communication",
        "Reading and Writing",
        "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
        "Pagbasa at Pagsusuri ng Iba't Ibang Teksto Tungo sa Pananaliksik",
        "21st Century Literature from the Philippines and the World",
        "Contemporary Philippine Arts from the Regions",
        "Media and Information Literacy",
        "General Mathematics",
        "Statistics and Probability",
        "Earth and Life Science*",
        "Physical Science*",
        "Personal Development/Pansariling Kaunlaran",
        "Understanding Culture, Society and Politics",
        "Introduction to the Philosophy of the Human Person/Pambungad sa Pilosopiya ng Tao",
        "Physical Education and Health (spread out in 4 semesters)",
      ],
      stemNote: "*STEM students will take these instead:",
      stemSub: ["Earth Science", "Disaster Readiness and Risk Reduction"],
      applied: [
        "English for Academic and Professional Purposes",
        "Practical Research 1",
        "Practical Research 2",
        "Filipino sa Piling Larang",
        "Empowerment Technologies",
        "Entrepreneurship",
        "Inquiries, Investigations and Immersion",
      ],
    };

    // Header
    page.drawText("SF10-SHS", {
      x: 500,
      y,
      size: 10,
      font: fontBold,
    });

    y -= 20;
    page.drawText("ANNEX: LIST OF SUBJECTS TAKEN", {
      x: 50,
      y,
      size: 12,
      font: fontBold,
    });

    y -= 15;
    page.drawText("Please check the subjects passed by the student", {
      x: 50,
      y,
      size: 10,
      font,
    });

    y -= 20;
    page.drawText("CORE SUBJECTS", { x: 50, y, size: 10, font: fontBold });

    y -= 15;
    for (const subject of subjects.core) {
      drawCheckbox(page, 50, y - 2);
      page.drawText(subject, { x: 70, y, size: 10, font });
      y -= 15;
    }

    page.drawText(subjects.stemNote, { x: 70, y, size: 10, font, color: rgb(0, 0, 1) });
    y -= 15;
    for (const sub of subjects.stemSub) {
      drawCheckbox(page, 50, y - 2);
      page.drawText(sub, { x: 70, y, size: 10, font });
      y -= 15;
    }

    y -= 5;
    page.drawText("Subject substitutions, if any:", { x: 50, y, size: 10, font });

    y -= 20;
    drawCheckbox(page, 50, y - 2);
    page.drawLine({ start: { x: 70, y: y + 5 }, end: { x: 545, y: y + 5 }, thickness: 1 });

    y -= 25;
    drawLine(y);

    y -= 10;
    page.drawText("APPLIED SUBJECTS", { x: 50, y, size: 10, font: fontBold });

    y -= 15;
    for (const subject of subjects.applied) {
      drawCheckbox(page, 50, y - 2);
      page.drawText(subject, { x: 70, y, size: 10, font });
      y -= 15;
    }

    y -= 10;
    page.drawText("SPECIALIZED SUBJECTS (Please write the list of subjects below)", {
      x: 50,
      y,
      size: 10,
      font: fontBold,
    });

    y -= 15;
    for (let i = 0; i < 7; i++) {
      drawCheckbox(page, 50, y - 2);
      drawLine(y - 5);
      y -= 20;
    }

    page.drawText("OTHER SUBJECTS (Please write the list of subjects below)", {
      x: 50,
      y,
      size: 10,
      font: fontBold,
    });

    y -= 15;
    for (let i = 0; i < 3; i++) {
      drawCheckbox(page, 50, y - 2);
      drawLine(y - 5);
      y -= 20;
    }

    // Save + View
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    window.open(url);
  };

  return (
    <div className="p-4">
      <button
        onClick={generatePdf}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        View PDF Replica
      </button>
    </div>
  );
};

export default PdfReplica;
