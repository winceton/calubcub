'use client';

import React, { useState } from 'react';

const Page = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/accountManagement/ocr', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setOcrResult(data.text || data.error);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">
          Upload
        </button>
      </form>

      {ocrResult && (
        <div className="mt-4 bg-gray-100 p-2 rounded">
          <h2 className="font-bold">Extracted Text:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
    </div>
  );
};

export default Page;
