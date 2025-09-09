import { Image, Scissors, Upload, Download } from "lucide-react";
import React, { useState } from "react";

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    console.log("File:", selectedFile);
    // për testim vendosim preview si rezultat
    setResultImage(URL.createObjectURL(selectedFile));
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "image_no_bg.png";
    link.click();
  };

  return (
    <div className="h-full p-6 flex flex-col md:flex-row gap-6 text-slate-700">
      
      {/* left col: input */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-4">
          <Scissors className="w-6 text-[#F59E0B]" />
          <h1 className="text-xl font-semibold">Remove Background</h1>
        </div>

        {/* Upload Box */}
        <label
          htmlFor="fileInput"
          className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all mb-6"
        >
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full h-full object-contain p-2 rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center text-gray-500">
              <Upload className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs text-gray-400">(JPG, PNG, WEBP)</p>
            </div>
          )}
        </label>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="hidden"
        />

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 text-sm rounded-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all"
        >
          <Scissors className="w-4 h-4" /> Remove Background
        </button>
      </form>

      {/* right col: result */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <Image className="w-5 h-5 text-[#F59E0B]" />
          <h1 className="text-xl font-semibold">Result</h1>
        </div>

        <div className="flex flex-1 justify-center items-center">
          {resultImage ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <img
                src={resultImage}
                alt="Result"
                className="w-full max-h-72 object-contain border rounded-lg shadow-sm"
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm rounded-lg shadow-md transition"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ) : (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-9 h-9" />
              <p>Upload an image and click "Remove Background"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
