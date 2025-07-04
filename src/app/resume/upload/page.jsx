"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (
        !selectedFile.type.includes("pdf") &&
        !selectedFile.type.includes("doc") &&
        !selectedFile.type.includes("docx")
      ) {
        setError("Please upload a PDF or DOC file");
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    // In a real app, you would upload to backend here
    router.push("/resume/cv");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Resume Generator
          </h1>
          <p className="text-gray-600">
            Upload your resume to create a professional CV
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50"
            onClick={() => document.getElementById("resume-upload").click()}
          >
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-700">
                {fileName || "Click to upload resume"}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {fileName
                  ? "File ready for processing"
                  : "Supports PDF, DOC, DOCX files"}
              </p>
              {error && (
                <p className="mt-3 text-sm text-red-500 bg-red-50 py-2 px-4 rounded-md">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/resume/cv")}
              className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
            >
              Use Sample
            </button>
            <button
              type="submit"
              disabled={!file}
              className={`flex-1 py-3 px-4 rounded-md text-white font-medium transition-colors ${
                file
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Generate CV
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            How it works
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Upload your existing resume in PDF or Word format</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Our system extracts your information automatically</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Edit and customize your professional CV</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Download as PDF or share directly with employers</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
