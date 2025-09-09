import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";

const ResumeReview = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload a resume first!");
      return;
    }

    console.log("Uploaded file:", selectedFile);

    // >>> API call për review mund të vendoset këtu <<<
    // Për testim, thjesht vendosim një rezultat dummy
    setReviewResult({
      summary: "Your resume looks great! Consider improving your skills section."
    });
  };

  return (
    <div className="h-full p-6 flex flex-col md:flex-row gap-6 text-slate-700">

      {/* left col: upload */}
      <form
        onSubmit={onSubmitHandler}
        className="flex-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 text-[#10B981]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <p className="mt-2 text-sm font-medium text-gray-700">Upload Resume</p>
        <input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="w-full mt-2 p-2 border border-gray-300 rounded-xl cursor-pointer text-sm focus:ring-2 focus:ring-[#10B981] outline-none"
          required
        />
        <p className="text-xs text-gray-400 mt-1">Supports PDF, PNG, JPG formats</p>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg hover:opacity-95 transition-all"
        >
          <FileText className="w-5 h-5" /> Review Resume
        </button>
      </form>

      {/* right col: result */}
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-[#10B981]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>

        <div className="flex flex-1 justify-center items-center">
          {!reviewResult ? (
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p>Upload your resume and click "Review Resume" to get started</p>
            </div>
          ) : (
            <div className="text-sm text-gray-700 flex flex-col gap-3">
              <p>{reviewResult.summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeReview;
