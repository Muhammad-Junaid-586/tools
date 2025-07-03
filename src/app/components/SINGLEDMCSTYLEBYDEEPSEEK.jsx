"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

const getSubjectKey = (subjectName) => {
  const subjectMapping = {
    eng: ["english", "eng", "English", "Eng", "englsh"],
    math: ["mathematics", "math", "mat", "Math", "Maths", "maths"],
    urdu: ["urdu", "اردو", "ur", "Urdu", "Ur", "urdu"],
    nazra: ["nazra", "nz", "Nazra", "Nz"],
    drawing: ["drawing", "draw", "dw", "Drawing", "Draw", "dw"],
    chemistry: ["chemistry", "chem", "Chemistry", "Chem", "chemistry"],
    physics: ["physics", "phy", "Physics", "Phy", "physics"],
    biology: ["biology", "bio", "Biology", "Bio", "biology"],
    computerScience: [
      "computer science",
      "cs",
      "Computer Science",
      "Cs",
      "computer science",
    ],
    islamiat: ["islamiat", "is", "Islamiat", "Is", "islamiat"],
    pakstudy: ["pakstudy", "ps", "Pak Study", "Ps", "pakstudy"],
    generalscience: [
      "general science",
      "gs",
      "General Science",
      "Gs",
      "general science",
    ],
    history: ["history", "hist", "History", "Hist", "history"],
    arabic: ["arabic", "ar", "Arabic", "Ar", "arabic"],
  };

  const lowerSubject = subjectName.toLowerCase().trim();

  for (const [key, aliases] of Object.entries(subjectMapping)) {
    if (key === lowerSubject || aliases.includes(lowerSubject)) {
      return key;
    }
  }

  return lowerSubject;
};

const getOrdinal = (num) => {
  const n = parseInt(num, 10);
  if (isNaN(n)) return "";
  if ([11, 12, 13].includes(n % 100)) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
};

const ProfessionalDMCPage = () => {
  const dmcData = useSelector((state) => state.dmc);
  const students = dmcData?.students || [];

  const [grades, setGrades] = useState({});
  const [studentPositions, setStudentPositions] = useState({});
  const [statuses, setStatuses] = useState({});
  const [performances, setPerformances] = useState({});

  useEffect(() => {
    if (!students || students.length === 0) return;

    const results = [];
    const percentageValues = [];

    students.forEach((student, studentIndex) => {
      // Create normalized student object with standardized keys
      const normalizedStudent = {};
      Object.keys(student).forEach((key) => {
        if (key.toLowerCase() !== "subjects") {
          normalizedStudent[getSubjectKey(key)] = student[key];
        }
      });

      let totalPossible = 0;
      let totalObtained = 0;
      let passedSubjects = 0;
      let failedSubjects = 0;

      student.Subjects.forEach((subject) => {
        const subjectKey = getSubjectKey(subject.paper);
        const subjectMarks = parseFloat(subject.totalMarks) || 0;
        const obtained = parseFloat(normalizedStudent[subjectKey]) || 0;
        const passingMarks = parseFloat(subject.passingMarks) || 0;

        totalPossible += subjectMarks;
        totalObtained += obtained;

        if (obtained >= passingMarks) passedSubjects++;
        else failedSubjects++;
      });

      const percentage =
        totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

      let status = "Fail";
      if (
        student["Passing Criteria"] === "Percentage" &&
        percentage >= parseFloat(student["Passing Percentage"])
      )
        status = "Pass";
      if (
        student["Passing Criteria"] === "No of Papers Failed" &&
        failedSubjects <= parseFloat(student["Failed Papers"])
      )
        status = "Pass";
      if (
        student["Passing Criteria"] === "No of Papers Passed" &&
        passedSubjects >= parseFloat(student["Passed Papers"])
      )
        status = "Pass";

      let grade = "F";
      if (status === "Pass") {
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 33) grade = "D";
      }

      const performance = {
        "A+": "Excellent",
        A: "Outstanding",
        B: "Very Good",
        C: "Good",
        D: "Satisfactory",
        F: "Poor",
      }[grade];

      results.push({
        index: studentIndex,
        grade,
        status,
        performance,
        percentage,
      });

      percentageValues.push({ index: studentIndex, percentage });
    });

    const sorted = [...percentageValues].sort(
      (a, b) => b.percentage - a.percentage
    );
    const positions = {};
    sorted.forEach((item, pos) => {
      positions[item.index] = pos + 1;
    });

    const newGrades = {};
    const newStatuses = {};
    const newPerformances = {};

    results.forEach((res) => {
      newGrades[res.index] = res.grade;
      newStatuses[res.index] = res.status;
      newPerformances[res.index] = res.performance;
    });

    setGrades(newGrades);
    setStatuses(newStatuses);
    setPerformances(newPerformances);
    setStudentPositions(positions);
  }, [students]);

  const handlePrint = () => window.print();

  if (!students.length)
    return (
      <p className="text-center py-10 text-gray-500">No student data found</p>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6 no-print">
        <h1 className="text-2xl font-bold text-gray-800">
          Academic Transcripts
        </h1>
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
              clipRule="evenodd"
            />
          </svg>
          Generate Transcripts
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {students.map((student, index) => {
          // Create normalized student object for display
          const normalizedStudent = {};
          Object.keys(student).forEach((key) => {
            if (key.toLowerCase() !== "subjects") {
              normalizedStudent[getSubjectKey(key)] = student[key];
            }
          });

          // Calculate totals for this student
          const totalPossible = student.Subjects.reduce(
            (acc, s) => acc + (parseFloat(s.totalMarks) || 0),
            0
          );

          const totalObtained = student.Subjects.reduce((acc, s) => {
            const key = getSubjectKey(s.paper);
            return acc + (parseFloat(normalizedStudent[key]) || 0);
          }, 0);

          const percentage =
            totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

          return (
            <div
              key={index}
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 transform transition-all hover:scale-[1.01]"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="absolute top-24 right-6 w-32 h-32 bg-indigo-100 rounded-full opacity-20"></div>
              <div className="absolute bottom-10 left-8 w-40 h-40 bg-blue-100 rounded-full opacity-20"></div>

              {/* Header section */}
              <div className="flex items-center justify-between px-8 pt-6 pb-4 border-b">
                <div className="flex items-center">
                  <div className="w-20 h-20 border-2 border-dashed border-blue-300 rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
                    {student.Logo ? (
                      <img
                        src={student.Logo}
                        alt="School Logo"
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center">
                        School Logo
                      </span>
                    )}
                  </div>
                  <div className="ml-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {student["School Name"]}
                    </h1>
                    <p className="text-indigo-600 font-medium">
                      ACADEMIC TRANSCRIPT
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-block bg-indigo-50 text-indigo-800 px-4 py-2 rounded-lg">
                    <span className="block text-xs uppercase tracking-wide">
                      Session
                    </span>
                    <span className="font-semibold">
                      {student["Session"] || "2023-24"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student info section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="block w-32 text-gray-600">
                      Student Name:
                    </span>
                    <span className="font-medium">
                      {student["Student Name"] || "N/A"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="block w-32 text-gray-600">
                      Father's Name:
                    </span>
                    <span className="font-medium">
                      {student["Father Name"] || "N/A"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="block w-32 text-gray-600">
                      Roll Number:
                    </span>
                    <span className="font-medium">
                      {student["R.No"] || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex">
                    <span className="block w-32 text-gray-600">
                      Class/Section:
                    </span>
                    <span className="font-medium">
                      {student["Class Level"] || "N/A"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="block w-32 text-gray-600">Exam Type:</span>
                    <span className="font-medium">
                      {student["Exam Type"] || "Annual"}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="block w-32 text-gray-600">Position:</span>
                    <span className="font-medium text-indigo-700">
                      {getOrdinal(studentPositions[index])}
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 flex flex-col items-center justify-center border border-blue-100">
                  <div className="text-center mb-2">
                    <span className="text-xs text-gray-600 block">
                      Overall Percentage
                    </span>
                    <span className="text-3xl font-bold text-indigo-700">
                      {percentage.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Performance summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-8 pb-6">
                <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-700">
                    {grades[index] || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Grade</div>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-700">
                    {statuses[index] || "N/A"}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Status</div>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-700">
                    {totalObtained}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Obtained Marks
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-indigo-700">
                    {totalPossible}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Total Marks</div>
                </div>
              </div>

              {/* Subjects table */}
              <div className="px-8 pb-8">
                <div className="rounded-xl overflow-hidden shadow-sm border">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                          Code
                        </th>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold">
                          Subject
                        </th>
                        <th className="py-3 px-4 text-center text-gray-700 font-semibold">
                          Total
                        </th>
                        <th className="py-3 px-4 text-center text-gray-700 font-semibold">
                          Obtained
                        </th>
                        <th className="py-3 px-4 text-center text-gray-700 font-semibold">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {student.Subjects.map((subject, i) => {
                        const subjectKey = getSubjectKey(subject.paper);
                        const obtained =
                          parseFloat(normalizedStudent[subjectKey]) || 0;
                        const passing = parseFloat(subject.passingMarks) || 0;
                        const status = obtained >= passing ? "Pass" : "Fail";

                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="py-3 px-4 font-mono text-sm text-gray-600">
                              SUB{i + 1}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {subject.paper}
                            </td>
                            <td className="py-3 px-4 text-center text-gray-700">
                              {subject.totalMarks}
                            </td>
                            <td className="py-3 px-4 text-center font-medium">
                              <span
                                className={clsx(
                                  "inline-flex items-center justify-center w-10 h-10 rounded-full",
                                  status === "Pass"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                )}
                              >
                                {obtained}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={clsx(
                                  "px-3 py-1 rounded-full text-xs font-medium",
                                  status === "Pass"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                )}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-center p-6">
                  <div className="text-sm text-gray-600 mb-4 md:mb-0">
                    <span className="font-medium">
                      Result Declaration Date:
                    </span>{" "}
                    {student["Declaration Date"] || "DD/MM/YYYY"}
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-0.5 bg-gradient-to-b from-indigo-400 to-blue-400 mx-auto mb-2"></div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">Principal</p>
                      <p className="text-sm text-gray-500">
                        Authorized Signature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalDMCPage;
