"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setLogo,
  setStudentsData,
  setSchoolName,
  setSession,
  setClassLevel,
  setExamType,
  setDeclarationDate,
  setPassingCriteria,
  setPassingPercentage,
  setFailedPapers,
  setPassedPapers,
  addSubject,
  removeSubject,
  setFormData,
} from "../dataStore/dmcSlice";
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
  const dispatch = useDispatch();
  const dmcState = useSelector((state) => state.dmc);
  const router = useRouter();

  // Local state for file uploads
  const [logoFile, setLogoFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for new subject form
  const [newSubject, setNewSubject] = useState({
    paper: "",
    totalMarks: "",
    passingMarks: "",
  });

  // Get data from Redux store
  const { schoolInfo, passingCriteria, subjects, students } = dmcState;

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

  const generateSessionOptions = () => {
    return Array.from({ length: 26 }, (_, i) => `${2025 + i}-${2026 + i}`);
  };

  // Handle logo upload with preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      dispatch(setLogo(reader.result));
    };
    reader.readAsDataURL(file);
  };

  // Handle Excel file upload and parsing
  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      dispatch(setStudentsData(jsonData));
    };
    reader.readAsBinaryString(file);
  };

  // Handle input changes for new subject
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new subject/paper
  const handleAddSubject = () => {
    const { paper, totalMarks, passingMarks } = newSubject;

    if (paper && totalMarks && !subjects.some((subj) => subj.paper === paper)) {
      const subjectToAdd = {
        paper,
        totalMarks: parseInt(totalMarks),
        passingMarks: passingMarks
          ? parseInt(passingMarks)
          : Math.ceil(parseInt(totalMarks) * 0.4),
      };

      dispatch(addSubject(subjectToAdd));

      // Clear inputs
      setNewSubject({
        paper: "",
        totalMarks: "",
        passingMarks: "",
      });
    }
  };

  // Remove a subject/paper
  const handleRemoveSubject = (index) => {
    dispatch(removeSubject(index));
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
      !schoolInfo.logo ||
      students.length === 0 ||
      !schoolInfo.schoolName ||
      !schoolInfo.session ||
      !schoolInfo.classLevel ||
      !schoolInfo.examType ||
      subjects.length === 0
    ) {
      alert("Please fill all required fields and add at least one subject.");
      setIsSubmitting(false);
      return;
    }

    // Prepare student data with all additional information
    const preparedStudents = students.map((student) => ({
      ...student,
      "School Name": schoolInfo.schoolName,
      Session: schoolInfo.session,
      "Class Level": getClassDisplayName(schoolInfo.classLevel),
      "Exam Type": schoolInfo.examType,
      "Declaration Date": schoolInfo.declarationDate,
      Logo: schoolInfo.logo,
      "Passing Criteria": passingCriteria.criteria,
      "Passing Percentage": passingCriteria.percentage,
      "Failed Papers": passingCriteria.failedPapers,
      "Passed Papers": passingCriteria.passedPapers,
      Subjects: subjects,
    }));

    // Update Redux store with final form data
    dispatch(
      setFormData({
        students: preparedStudents,
      })
    );

    // Pass data to parent component if needed
    if (onDataFetched) {
      onDataFetched(preparedStudents);
    }

    const selectedDesign = localStorage.getItem("selectedDesign");
    // Navigate to DMC page
    if (selectedDesign === "NewDmc") {
      router.push("/dmc");
    } else {
      router.push("/singleDmcDesignTwo");
    }
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
                {schoolInfo.logo && (
                  <div className="relative w-20 h-20 border rounded-md overflow-hidden">
                    <Image
                      src={schoolInfo.logo}
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
              {excelFile && (
                <p className="text-sm text-green-600 flex items-center">
                  <FaFileAlt className="mr-1" /> {excelFile.name}
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
                  value={schoolInfo.schoolName}
                  onChange={(e) => dispatch(setSchoolName(e.target.value))}
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
                  value={schoolInfo.session}
                  onChange={(e) => dispatch(setSession(e.target.value))}
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
                  value={schoolInfo.classLevel}
                  onChange={(e) => dispatch(setClassLevel(e.target.value))}
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
                  value={schoolInfo.examType}
                  onChange={(e) => dispatch(setExamType(e.target.value))}
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
                  value={schoolInfo.declarationDate}
                  onChange={(e) => dispatch(setDeclarationDate(e.target.value))}
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
                  value={passingCriteria.criteria}
                  onChange={(e) => dispatch(setPassingCriteria(e.target.value))}
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

              {passingCriteria.criteria === "Percentage" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Passing Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={passingCriteria.percentage}
                      onChange={(e) =>
                        dispatch(setPassingPercentage(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                      placeholder="e.g. 40"
                    />
                    <span className="absolute left-3 top-2 text-gray-400">
                      %
                    </span>
                  </div>
                </div>
              )}

              {passingCriteria.criteria === "No of Papers Failed" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Maximum Allowed Failed Papers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={passingCriteria.failedPapers}
                    onChange={(e) => dispatch(setFailedPapers(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2"
                  />
                </div>
              )}

              {passingCriteria.criteria === "No of Papers Passed" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Minimum Required Passed Papers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={passingCriteria.passedPapers}
                    onChange={(e) => dispatch(setPassedPapers(e.target.value))}
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
                  name="paper"
                  value={newSubject.paper}
                  onChange={handleInputChange}
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
                  name="totalMarks"
                  type="number"
                  min="0"
                  value={newSubject.totalMarks}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Total marks"
                />
              </div>

              {/* Passing Marks (if criteria is based on papers) */}
              {(passingCriteria.criteria === "No of Papers Failed" ||
                passingCriteria.criteria === "No of Papers Passed") && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Passing Marks
                  </label>
                  <input
                    name="passingMarks"
                    type="number"
                    min="0"
                    value={newSubject.passingMarks}
                    onChange={handleInputChange}
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
                        {(passingCriteria.criteria === "No of Papers Failed" ||
                          passingCriteria.criteria ===
                            "No of Papers Passed") && (
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
                          {(passingCriteria.criteria ===
                            "No of Papers Failed" ||
                            passingCriteria.criteria ===
                              "No of Papers Passed") && (
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
                !schoolInfo.logo ||
                students.length === 0 ||
                !schoolInfo.schoolName ||
                !schoolInfo.session ||
                !schoolInfo.classLevel ||
                !schoolInfo.examType ||
                subjects.length === 0
              }
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-md font-medium hover:from-blue-700 hover:to-blue-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md ${
                isSubmitting ||
                !schoolInfo.logo ||
                students.length === 0 ||
                !schoolInfo.schoolName ||
                !schoolInfo.session ||
                !schoolInfo.classLevel ||
                !schoolInfo.examType ||
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
