import { NextResponse } from 'next/server';
import { writeFile, readFile, unlink, mkdir } from 'fs/promises';
import fs from 'fs'; // Import fs to check if the directory exists
import { exec } from 'child_process';
import path from 'path';
import os from 'os';
import sharp from 'sharp'; // Import the sharp library

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const tempDir = os.tmpdir();
  const tempPath = path.join(tempDir, `${Date.now()}-${file.name}`);
  
  // Temporary output path in the system's temp directory
  const outputPath = path.join(tempDir, `${Date.now()}-output`);

  try {
    // Ensure the temp directory exists (os.tmpdir() is usually fine, but we can ensure it's present)
    if (!fs.existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    // Save the uploaded file temporarily
    await writeFile(tempPath, buffer);

    // Preprocess the image using Sharp
    const preprocessedImagePath = `${tempPath}-preprocessed.png`;
    await sharp(tempPath)
      .grayscale() // Convert to grayscale
      .threshold(128) // Apply threshold to make it black and white
      .toFile(preprocessedImagePath); // Save the processed image

    // Run Tesseract on the preprocessed image
    await new Promise((resolve, reject) => {
      // Wrap the output path in double quotes to avoid issues with spaces
      exec(`tesseract "${preprocessedImagePath}" "${outputPath}" --psm 6`, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Read the OCR result from the output file
    const text = await readFile(`${outputPath}.txt`, 'utf-8');

    // Clean up
    await unlink(tempPath).catch(() => {});
    await unlink(preprocessedImagePath).catch(() => {});

    return NextResponse.json({ text });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
