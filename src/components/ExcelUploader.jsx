'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';

export default function ExcelUploader({ onDataParsed }) {
const [fileName, setFileName] = useState(null);

const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      onDataParsed(json); // send parsed data back to parent
    };

    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: ['.xls', '.xlsx'],
});


  return (
    <div
      {...getRootProps()}
      className="p-6 border-2 border-dashed border-blue-300 rounded-2xl text-center cursor-pointer bg-white hover:bg-blue-50 transition-all"
    >
      <input {...getInputProps()} />
      <p className="text-lg text-blue-700 font-medium">
        {isDragActive
          ? 'Drop it like it’s hot 🔥'
          : 'Drag & drop your Excel file here or click to upload'}
      </p>
      {fileName && (
        <p className="mt-2 text-sm text-gray-500 italic">
          Uploaded: {fileName}
        </p>
      )}
    </div>
  );
}
