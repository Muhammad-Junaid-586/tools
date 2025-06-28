"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FaUpload,
  FaSchool,
  FaCalendarAlt,
  FaGraduationCap,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const Upload = ({ onDataFetched }) => {
  // State for file uploads
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [excel, setExcel] = useState(null);
  const [studentsData, setStudentsData] = useState([]);

  // State for school information
  const [schoolName, setSchoolName] = useState("");
  const [session, setSession] = useState("");
  const [classLevel, setClassLevel] = useState("KG");
  const [examType, setExamType] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");

  // State for passing criteria
  const [passingCriteria, setPassingCriteria] = useState("");
  const [passingPercentage, setPassingPercentage] = useState("");
  const [failedPapers, setFailedPapers] = useState("");
  const [passedPapers, setPassedPapers] = useState("");

  // State for subjects/papers
  const [selectedPaper, setSelectedPaper] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [subjects, setSubjects] = useState([]);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Constants
  const examTypes = [
    "Monthly Test",
    "1st Term Exam",
    "Mid Term Exam",
    "Pre-Final Exam",
    "Final/Annual Exam",
  ];

  const papers = [
    "Computer Science",
    "HPE",
    "Mathematics",
    "Pashto",
    "Drawing",
    "Arabic",
    "Islamiat",
    "General Science",
    "English",
    "Muthalia-Quran Hakeem",
    "Nazra",
    "Geography",
    "History",
    "Physics",
    "Chemistry",
    "Biology",
    "Urdu",
    "Pak Study",
  ];

  const classLevels = [
    "KG",
    ...Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
  ];

  // Generate session options from 2025-2026 to 2050-2051
  const generateSessionOptions = () => {
    return Array.from({ length: 26 }, (_, i) => `${2025 + i}-${2026 + i}`);
  };

  // Handle logo upload with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogo(file);

    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle Excel file upload and parsing
  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    setExcel(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setStudentsData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // Add a new subject/paper
  const handleAddSubject = () => {
    if (
      selectedPaper &&
      totalMarks &&
      !subjects.some((subj) => subj.paper === selectedPaper)
    ) {
      const newSubject = {
        paper: selectedPaper,
        totalMarks: parseInt(totalMarks),
        passingMarks: passingMarks
          ? parseInt(passingMarks)
          : Math.ceil(parseInt(totalMarks) * 0.4), // Default to 40% if not provided
      };

      setSubjects([...subjects, newSubject]);
      setSelectedPaper("");
      setTotalMarks("");
      setPassingMarks("");
    }
  };

  // Remove a subject/paper
  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  // Format class level with ordinal suffix
  const getClassDisplayName = (level) => {
    if (level === "KG") return "KG";
    const num = parseInt(level);
    if (num === 1) return "1st";
    if (num === 2) return "2nd";
    if (num === 3) return "3rd";
    return `${num}th`;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (
      !logo ||
      !excel ||
      !schoolName ||
      !session ||
      !classLevel ||
      !examType ||
      subjects.length === 0
    ) {
      alert("Please fill all required fields and add at least one subject.");
      setIsSubmitting(false);
      return;
    }

    // Prepare student data with all additional information
    const preparedStudents = studentsData.map((student) => ({
      ...student,
      "School Name": schoolName,
      Session: session,
      "Class Level": getClassDisplayName(classLevel),
      "Exam Type": examType,
      "Declaration Date": declarationDate,
      Logo: logoPreview,
      "Passing Criteria": passingCriteria,
      "Passing Percentage": passingPercentage,
      "Failed Papers": failedPapers,
      "Passed Papers": passedPapers,
      Subjects: subjects,
    }));

    // Pass data to parent component
    onDataFetched(preparedStudents);

    // Navigate to DMC page
    // router.push("/dmc");
    localStorage.setItem("studentsData", JSON.stringify(preparedStudents));
    router.push("/dmc");

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <h1 className="text-2xl font-bold">DMC Generator</h1>
          <p className="opacity-90">
            Upload your data to generate student DMCs
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Upload Files
            </h2>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaFileImage className="mr-2 text-blue-600" />
                School Logo <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-blue-500 transition-colors">
                  <FaUpload className="text-gray-400 text-2xl mb-2" />
                  <p className="text-sm text-gray-500">Click to upload logo</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    required
                  />
                </label>
                {logoPreview && (
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                    <Image
                      src={logoPreview}
                      alt="Logo Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Excel Upload */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FaFileExcel className="mr-2 text-green-600" />
                Student Data (Excel){" "}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-blue-500 transition-colors">
                <FaUpload className="text-gray-400 text-2xl mb-2" />
                <p className="text-sm text-gray-500">
                  Click to upload Excel file
                </p>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleExcelChange}
                  className="hidden"
                  required
                />
              </label>
              {excel && (
                <p className="text-sm text-green-600 flex items-center">
                  <FaFileAlt className="mr-1" /> {excel.name}
                </p>
              )}
            </div>
          </div>

          {/* School Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              School Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* School Name */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaSchool className="mr-2 text-blue-600" />
                  School Name <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter school name"
                />
              </div>

              {/* Session */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Session <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Session</option>
                  {generateSessionOptions().map((session, index) => (
                    <option key={index} value={session}>
                      {session}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Level */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Class Level <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {classLevels.map((level) => (
                    <option key={level} value={level}>
                      {getClassDisplayName(level)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exam Type */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaFileAlt className="mr-2 text-blue-600" />
                  Exam Type <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Exam Type</option>
                  {examTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Declaration Date */}
              <div className="space-y-1">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Declaration Date
                </label>
                <input
                  type="date"
                  value={declarationDate}
                  onChange={(e) => setDeclarationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Passing Criteria Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Passing Criteria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Criteria Type
                </label>
                <select
                  value={passingCriteria}
                  onChange={(e) => setPassingCriteria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Criteria</option>
                  <option value="Percentage">Percentage</option>
                  <option value="No of Papers Failed">
                    No of Papers Failed
                  </option>
                  <option value="No of Papers Passed">
                    No of Papers Passed
                  </option>
                </select>
              </div>

              {passingCriteria === "Percentage" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Passing Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={passingPercentage}
                      onChange={(e) => setPassingPercentage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                      placeholder="e.g. 40"
                    />
                    <span className="absolute left-3 top-2 text-gray-400">
                      %
                    </span>
                  </div>
                </div>
              )}

              {passingCriteria === "No of Papers Failed" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Maximum Allowed Failed Papers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={failedPapers}
                    onChange={(e) => setFailedPapers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2"
                  />
                </div>
              )}

              {passingCriteria === "No of Papers Passed" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Minimum Required Passed Papers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={passedPapers}
                    onChange={(e) => setPassedPapers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 5"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Subjects/Papers Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              Subjects/Papers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Paper Selection */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Paper
                </label>
                <select
                  value={selectedPaper}
                  onChange={(e) => setSelectedPaper(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Paper</option>
                  {papers.map((paper) => (
                    <option key={paper} value={paper}>
                      {paper}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Marks */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Total Marks
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Total marks"
                />
              </div>

              {/* Passing Marks (if criteria is based on papers) */}
              {(passingCriteria === "No of Papers Failed" ||
                passingCriteria === "No of Papers Passed") && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Passing marks"
                  />
                </div>
              )}

              {/* Add Button */}
              <div className="space-y-1 flex items-end">
                <button
                  type="button"
                  onClick={handleAddSubject}
                  disabled={!selectedPaper || !totalMarks}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaPlus /> Add
                </button>
              </div>
            </div>

            {/* Added Subjects List */}
            {subjects.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">
                  Added Subjects
                </label>
                <div className="mt-2 border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paper
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Marks
                        </th>
                        {(passingCriteria === "No of Papers Failed" ||
                          passingCriteria === "No of Papers Passed") && (
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Passing Marks
                          </th>
                        )}
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subjects.map((subject, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subject.paper}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {subject.totalMarks}
                          </td>
                          {(passingCriteria === "No of Papers Failed" ||
                            passingCriteria === "No of Papers Passed") && (
                            <td className="px-4 py-2 whitespace-nowrap">
                              {subject.passingMarks}
                            </td>
                          )}
                          <td className="px-4 py-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleRemoveSubject(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !logo ||
                !excel ||
                !schoolName ||
                !session ||
                !classLevel ||
                !examType ||
                subjects.length === 0
              }
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-md font-medium hover:from-blue-700 hover:to-blue-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md ${
                isSubmitting ||
                !logo ||
                !excel ||
                !schoolName ||
                !session ||
                !classLevel ||
                !examType ||
                subjects.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? "Processing..." : "Generate DMCs"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
