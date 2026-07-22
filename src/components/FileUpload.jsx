import { useState } from "react";

const FileUpload = ({ onFileSelect }) => {
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file) onFileSelect(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition 
      ${dragging ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white"}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
    >
      <p className="text-gray-600">
        Drag & Drop Certificate here or click to upload
      </p>
      <input
        type="file"
        className="hidden"
        id="fileInput"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <label
        htmlFor="fileInput"
        className="mt-4 inline-block bg-indigo-700 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-indigo-800"
      >
        Choose File
      </label>
    </div>
  );
};

export default FileUpload;