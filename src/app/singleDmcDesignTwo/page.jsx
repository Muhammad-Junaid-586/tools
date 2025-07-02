"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../singleDmcDesignTwo.css";

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

  if (!students.length)
    return <p>No student data found. Please upload files first.</p>;

  return (
    <div className="container">
      <h2 className="no-print">Digital Mark Sheets</h2>

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
                <div className="flex flex-wrap justify-center text-left gap-4 studentInfo">
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2 relative z-40">
                    <strong>Roll Number:</strong> {student["R.No"] || "N/A"}
                  </div>
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2 relative z-40">
                    <strong>E.Type: </strong> {student["Exam Type"] || "N/A"}
                  </div>
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                    <strong>Name: </strong> {student["Student Name"] || "N/A"}
                  </div>
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                    <strong>F/Name: </strong> {student["Father Name"] || "N/A"}
                  </div>
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                    <strong>Class/Section: </strong> {student["Class Level"]}
                  </div>
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2">
                    <strong>Session/year: </strong>{" "}
                    {student["Session"] || "N/A"}
                  </div>
                </div>
              </div>

              {/* Marks table */}
              <div className="overflow-x-auto p-4">
                <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
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
                      fontSize: student.Subjects.length >= 8 ? ".7rem" : "1rem",
                    }}
                  >
                    {student.Subjects.map((subject, i) => (
                      <tr key={i} className="hover:bg-gray-100">
                        <td className="border px-4 py-1">{i + 1}</td>
                        <td className="border px-4 py-1">{subject.paper}</td>
                        <td className="border px-4 py-1">
                          {subject.totalMarks}
                        </td>
                        <td className="border px-4 py-1">
                          {normalizedStudent[getSubjectKey(subject.paper)] || 0}
                        </td>
                      </tr>
                    ))}
                    <tr className="hover:bg-gray-100">
                      <td
                        colSpan={2}
                        className="border px-4 py-1 font-semibold text-center"
                      >
                        Total Marks
                      </td>
                      <td className="border px-4 py-1">{totalPossible}</td>
                      <td className="border px-4 py-1">{totalObtained}</td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td
                        colSpan={2}
                        className="border px-4 py-1 font-semibold text-center"
                      >
                        Status
                      </td>
                      <td className="p-2 border text-center" colSpan={2}>
                        {statuses[index] || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Results footer */}
              <div className="footer mt-4 pt-1">
                <table className="w-full border-collapse rounded-lg overflow-hidden text-center">
                  <tbody className="border-collapse overflow-hidden rounded-lg">
                    <tr className="bg-gray-200">
                      <td className="border px-4 py-1 font-semibold text-center">
                        Percentage
                      </td>
                      <td className="p-2 border">
                        {((totalObtained / (totalPossible || 1)) * 100).toFixed(
                          2
                        )}
                        %
                      </td>
                      <td className="p-2 border font-semibold">Grade</td>
                      <td className="p-2 border">{grades[index] || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Position</td>
                      <td className="p-2 border">
                        {getOrdinal(studentPositions[index])}
                      </td>
                      <td className="p-2 border font-semibold">Performance</td>
                      <td className="p-2 border">
                        {performances[index] || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Declaration date */}
              <div className="flex justify-end mr-[20px] m-0 p-0">
                <span className="text-gray-600 font-medium">
                  Result Declaration Date : {student["Declaration Date"]}
                </span>
              </div>

              {/* Grading and promotion section */}
              <div className="grading-wrapper">
                <div className="grading-system-promotion mt-2 flex flex-nowrap justify-between items-center px-2 py-1 rounded-xl bg-white transition-all duration-300 ease-in-out overflow-hidden">
                  <div className="grading-system flex items-center p-6 rounded-2xl w-[40%] min-w-0">
                    <img
                      src="images/congrats1.jpg"
                      alt="Grading System"
                      className="w-40 h-auto object-contain rounded-xl transition-transform duration-300 hover:scale-105"
                    />
                    <div className="flex-1 ml-6 text-left grading-system-text">
                      <h4 className="font-bold text-3xl text-gray-800 mb-2 pb-1 whitespace-nowrap">
                        Grading System
                      </h4>
                      <ul className="space-y-1 text-lg font-semibold text-gray-700">
                        <li className="px-4 hover:text-yellow-600 transition">
                          A+ - Excellent
                        </li>
                        <li className="px-4 hover:text-blue-600 transition">
                          A - Outstanding
                        </li>
                        <li className="px-4 hover:text-green-600 transition">
                          B - Very Good
                        </li>
                        <li className="px-4 hover:text-orange-600 transition">
                          C - Good
                        </li>
                        <li className="px-4 hover:text-orange-600 transition">
                          D - Satisfactory
                        </li>
                        <li className="px-4 hover:text-red-600 transition">
                          F - Poor
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="promotion-message text-center relative w-[40%] h-52 min-w-0">
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold z-10 px-6 pb-2 text-center rounded-2xl">
                      {statuses[index] !== "Fail" ? (
                        <img src="images/congrats8.png" alt="" />
                      ) : (
                        <img src="images/try1-removebg-preview.png" alt="" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div>
                  <div
                    className="flex justify-between mt-3"
                    style={{
                      marginTop:
                        student.Subjects?.length < 6 ? "6rem" : "2.5rem",
                    }}
                  >
                    <div className="text-center">
                      <hr className="border-t border-black w-40 mx-auto mt-1" />
                      <p className="font-semibold">Exam Controller Signature</p>
                    </div>
                    <div className="text-center">
                      <hr className="border-t border-black w-40 mx-auto mt-1" />
                      <p className="font-semibold">Principal Signature</p>
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

export default DMCPage;
