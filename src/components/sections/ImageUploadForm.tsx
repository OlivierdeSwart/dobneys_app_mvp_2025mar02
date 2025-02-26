"use client";

import { useState } from "react";

const ImageUploadForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedPath, setUploadedPath] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Uploaded image path:", data.fileUrl);
        setUploadedPath(data.fileUrl);
      } else {
        console.error("❌ Upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
    }

    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload NFT Image</h2>

      {/* Drag & Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer"
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-auto object-cover rounded-lg" />
        ) : (
          <p className="text-gray-600">Drag & drop an image here</p>
        )}
      </div>

      {/* File Input */}
      <input type="file" accept="image/*" onChange={handleFileSelect} className="mt-4" />

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`mt-4 w-full py-2 rounded-lg text-white font-semibold ${
          uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {/* Show Uploaded Path */}
      {uploadedPath && (
        <p className="mt-4 text-green-600">✅ Uploaded: <a href={uploadedPath} target="_blank" className="underline">{uploadedPath}</a></p>
      )}
    </div>
  );
};

export default ImageUploadForm;
