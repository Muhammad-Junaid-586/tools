"use client";

"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../twoDmcDesignFirst.css";
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

const getSuffixOnly = (num) => {
  const n = parseInt(num, 10);
  if (isNaN(n)) return "";
  if ([11, 12, 13].includes(n % 100)) return "th";
  if (n % 10 === 1) return "st";
  if (n % 10 === 2) return "nd";
  if (n % 10 === 3) return "rd";
  return "th";
};

const DMCPage = () => {
  const dmcData = useSelector((state) => state.dmc);
  const students = dmcData?.students || [];

  const [grades, setGrades] = useState({});
  const [studentPositions, setStudentPositions] = useState({});
  const [statuses, setStatuses] = useState({});
  const [performances, setPerformances] = useState({});
  const [totalObtainedMarks, setTotalObtainedMarks] = useState({});

  useEffect(() => {
    if (!students || students.length === 0) return;

    const results = [];
    const percentageValues = [];
    const obtainedMarks = {};

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

      obtainedMarks[studentIndex] = totalObtained;
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
    setTotalObtainedMarks(obtainedMarks);
  }, [students]);

  const getOrdinal = (num) => {
    const n = parseInt(num, 10);
    if (isNaN(n)) return "";
    if ([11, 12, 13].includes(n % 100)) return `${n}th`;
    if (n % 10 === 1) return `${n}st`;
    if (n % 10 === 2) return `${n}nd`;
    if (n % 10 === 3) return `${n}rd`;
    return `${n}th`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (!students.length)
    return <p>No student data found. Please upload files first.</p>;

  return (
    <div className="container">
      <h2 className="no-print">Digital Mark Sheets</h2>
      <div className="no-print text-center my-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Print DMC
        </button>
      </div>
      <div className="dmc-grid">
        {students.map((student, index) => {
          // Create normalized student object for display
          const normalizedStudent = {};
          Object.keys(student).forEach((key) => {
            if (key.toLowerCase() !== "subjects") {
              normalizedStudent[getSubjectKey(key)] = student[key];
            }
          });

          const totalPossible = student.Subjects.reduce(
            (acc, s) => acc + (parseFloat(s.totalMarks) || 0),
            0
          );

          const totalObtained = student.Subjects.reduce((acc, s) => {
            const key = getSubjectKey(s.paper);
            return acc + (parseFloat(normalizedStudent[key]) || 0);
          }, 0);

          const getCellStyle = (subjectsLength) => ({
            paddingBlock: subjectsLength >= 7 ? "2px" : "4px",
          });

          return (
            <div key={index} className="dmc-card">
              {/* Decorative shapes */}
              <div className="decorative-shape top-left"></div>
              <div className="decorative-shape top-right"></div>
              <div className="decorative-shape bottom-left"></div>
              <div className="decorative-shape bottom-right"></div>

              {/* School header */}
              <div className="flex items-center justify-center gap-1 w-full mb-[-30px]">
                <div className="w-[240px] h-[240px]">
                  <img
                    src={student.Logo}
                    alt="School Logo"
                    className="w-[240px] h-full object-cover"
                  />
                </div>
                <div className="ml-[-30px] school-heading-text">
                  <h2
                    style={{ fontFamily: "Merriweather, serif" }}
                    className="relative z-40"
                  >
                    <strong>{student["School Name"]}</strong>
                  </h2>
                  <h3 className="relative z-40">
                    <strong>Detailed Marks Certificate</strong>
                  </h3>
                </div>
              </div>

              {/* Student info */}
              <div className="flex flex-col items-center">
                <div className="flex flex-wrap justify-center text-left gap-4 studentInfoNewLayout">
                  <div className="border p-[3px] rounded-lg w-full max-w-[300px] px-2 relative z-40">
                    <strong>Roll Number:</strong> {student["R.No"] || "N/A"}
                  </div>
                  <div className="border p-[3px] rounded-lg w-full max-w-[300px] px-2 relative z-40">
                    <strong>E.Type: </strong> {student["Exam Type"] || "N/A"}
                  </div>
                  <div className="border p-[3px] rounded-lg w-full max-w-[300px] px-2">
                    <strong>Name: </strong> {student["Student Name"] || "N/A"}
                  </div>
                  <div className="border p-[3px] rounded-lg w-full max-w-[300px] px-2">
                    <strong>F/Name: </strong> {student["Father Name"] || "N/A"}
                  </div>
                  <div className="border p-[3px] rounded-lg w-full max-w-[300px] px-2">
                    <strong>Class/Section: </strong> {student["Class Level"]}
                  </div>
                  <div className="border p-[3px] rounded-lg w-full max-w-[300px] px-2">
                    <strong>Session/year: </strong>{" "}
                    {student["Session"] || "N/A"}
                  </div>
                </div>
              </div>

              {/* Two tables in a single row */}
              <div className="flex flex-row gap-4 px-4 py-1">
                {/* Subjects table */}
                <div className="overflow-x-auto flex-1">
                  <table
                    style={{
                      fontSize: student.Subjects.length >= 7 ? ".7rem" : "1rem",
                    }}
                    className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden"
                  >
                    <thead className="bg-gray-800 text-white rounded-lg text-sm uppercase">
                      <tr className="bg-gray-800">
                        <th className="border px-4 py-1">S.No</th>
                        <th className="border px-4 py-1">Subjects</th>
                        <th className="border px-4 py-1">Total Marks</th>
                        <th className="border px-4 py-1">Obtained Marks</th>
                      </tr>
                    </thead>
                    <tbody
                      style={{
                        fontSize:
                          student.Subjects.length >= 7 ? ".7rem" : "1rem",
                      }}
                      className={clsx({
                        "print:text-xs": student.Subjects.length === 8,
                        "print:text-[9px]": student.Subjects.length > 8,
                        "print:text-sm": student.Subjects.length < 8,
                      })}
                    >
                      {student.Subjects.map((subject, i) => (
                        <tr key={i} className="hover:bg-gray-100">
                          <td
                            style={getCellStyle(student.Subjects.length)}
                            className="border px-4 py-1"
                          >
                            {i + 1}
                          </td>
                          <td
                            style={getCellStyle(student.Subjects.length)}
                            className="border px-4 py-1"
                          >
                            {subject.paper}
                          </td>
                          <td
                            style={getCellStyle(student.Subjects.length)}
                            className="border px-4 py-1"
                          >
                            {subject.totalMarks}
                          </td>
                          <td
                            style={getCellStyle(student.Subjects.length)}
                            className="border px-4 py-1"
                          >
                            {normalizedStudent[getSubjectKey(subject.paper)] ||
                              0}
                          </td>
                        </tr>
                      ))}
                      <tr className="hover:bg-gray-100">
                        <td
                          style={{
                            paddingBlock:
                              student.Subjects.length >= 7 ? "2px" : "4px",
                          }}
                          colSpan={2}
                          className="border px-4 py-1 font-semibold text-center"
                        >
                          Total Marks
                        </td>
                        <td
                          style={{
                            paddingBlock:
                              student.Subjects.length >= 7 ? "2px" : "4px",
                          }}
                          className="border px-4 py-1"
                        >
                          {totalPossible}
                        </td>
                        <td
                          style={{
                            paddingBlock:
                              student.Subjects.length >= 7 ? "2px" : "4px",
                          }}
                          className="border px-4 py-1"
                        >
                          {totalObtained}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Summary table */}
                <div className="overflow-x-auto  w-[200px]">
                  <table
                    style={{
                      fontSize: student.Subjects.length >= 7 ? ".7rem" : "1rem",
                    }}
                    className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden"
                  >
                    <thead className="bg-gray-800 text-white rounded-lg text-sm uppercase">
                      <tr>
                        <th colSpan={2} className="border px-4 py-1">
                          Summary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-100">
                        <td className="border px-4 py-1 font-semibold">
                          Status
                        </td>
                        <td className="border px-4 py-1">
                          {statuses[index] || "N/A"}
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-100">
                        <td className="border px-4 py-1 font-semibold">
                          Percentage
                        </td>
                        <td className="border px-4 py-1">
                          {(
                            (totalObtained / (totalPossible || 1)) *
                            100
                          ).toFixed(2)}
                          %
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-100">
                        <td className="border px-4 py-1 font-semibold">
                          Position
                        </td>
                        <td className="border px-4 py-1">
                          {getOrdinal(studentPositions[index])}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Declaration date and signature */}
              <div className="flex justify-between items-center px-4 ">
                <div className="flex justify-start">
                  <span className="text-gray-600 font-medium">
                    Result Declaration Date: {student["Declaration Date"]}
                  </span>
                </div>

                <div className="text-center">
                  <hr className="border-t border-black w-40 mx-auto mt-1" />
                  <p className="font-semibold">Principal Signature</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DMCPage;
