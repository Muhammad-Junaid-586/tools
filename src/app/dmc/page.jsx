"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../Dmc.css";

// Subject mapping with all possible variations
const subjectMapping = {
  urdu: ["u", "ur", "urdu", "Urdu", "URDU", "اردو"],
  generalscience: [
    "gs",
    "general science",
    "generalscience",
    "General Science",
  ],
  pakstudy: ["ps", "pak study", "pakstudy", "Pak Study"],
  english: ["e", "eng", "Eng", "english", "English", "ENG"],
  islamiat: ["is", "islamiat", "islamic study", "islamicstudy", "Islamiat"],
  mathematics: [
    "m",
    "math",
    "maths",
    "Math",
    "Maths",
    "mathematics",
    "Mathematics",
  ],
  physics: ["p", "physics", "phy", "Physics"],
  chemistry: ["c", "chemistry", "chem", "Chemistry"],
  biology: ["b", "biology", "bio", "Biology"],
  computerScience: [
    "cs",
    "computer science",
    "comp sci",
    "comp-science",
    "Computer Science",
  ],
  history: ["h", "history", "hist", "his", "Hist", "History"],
  geography: ["g", "geography", "geo", "Geo", "Geography"],
  nazra: [
    "nqh",
    "Nazra",
    "nazria quran hakeem",
    "nazria-quran",
    "quran hakeem",
    "nazria",
    "Nazria Quran",
  ],
  muthaliaQuranHakeem: [
    "mqh",
    "muthalia quran hakeem",
    "muthalia-quran",
    "muthalia",
    "Quran Hakeem",
    "Muthalia Quran",
  ],
  arabic: ["a", "arabic", "arb", "Arabic"],
  pashto: ["p", "pashto", "PSH", "pash", "Pashto"],
  hpe: [
    "hpe",
    "health and physical education",
    "health & physical edu",
    "health edu",
    "physical edu",
    "Physical Education",
  ],
  drawing: ["d", "Dw", "drawing", "art", "sketching", "Drawing"],
  computerStudies: [
    "cs",
    "computer studies",
    "comp studies",
    "comp-studies",
    "Computer Studies",
  ],
};

// Helper function to get the standardized subject key
const getSubjectKey = (subjectName) => {
  const lowerSubject = subjectName.toLowerCase().trim();

  for (const [key, aliases] of Object.entries(subjectMapping)) {
    if (
      key.toLowerCase() === lowerSubject ||
      aliases.some((alias) => alias.toLowerCase() === lowerSubject)
    ) {
      return key;
    }
  }

  return subjectName;
};

const DMCPage = () => {
  const dmcData = useSelector((state) => state.dmc);
  const students = dmcData?.students || [];

  const [grades, setGrades] = useState({});
  const [studentPositions, setStudentPositions] = useState({});
  const [statuses, setStatuses] = useState({});
  const [performances, setPerformances] = useState({});
  const [totalObtainedMarks, setTotalObtainedMarks] = useState({});
  const [subjectMarks, setSubjectMarks] = useState({});

  useEffect(() => {
    if (!students || students.length === 0) return;

    const results = [];
    const percentageValues = [];
    const obtainedMarks = {};
    const marksBySubject = {};

    students.forEach((student, studentIndex) => {
      // Normalize student marks data
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

      // Store marks for each subject
      marksBySubject[studentIndex] = {};

      student.Subjects.forEach((subject) => {
        const subjectKey = getSubjectKey(subject.paper);
        const totalMarks = parseFloat(subject.totalMarks) || 0;
        let obtained = normalizedStudent[subjectKey];

        // Check if student is absent (mark is "A" or "a")
        const isAbsent = obtained?.toString().toLowerCase() === "a";
        const obtainedValue = isAbsent ? "A" : parseFloat(obtained) || 0;

        const passingMarks = parseFloat(subject.passingMarks) || 0;

        totalPossible += totalMarks;
        // Don't add to total obtained if absent
        totalObtained += isAbsent ? 0 : obtainedValue;

        marksBySubject[studentIndex][subjectKey] = obtainedValue;

        if (!isAbsent && obtainedValue >= passingMarks) {
          passedSubjects++;
        } else if (!isAbsent) {
          failedSubjects++;
        }
      });

      obtainedMarks[studentIndex] = totalObtained;
      const percentage =
        totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

      // Determine status based on passing criteria
      let status = "Fail";
      const passingCriteria = student["Passing Criteria"] || "Percentage";

      if (
        passingCriteria === "Percentage" &&
        percentage >= parseFloat(student["Passing Percentage"] || 0)
      ) {
        status = "Pass";
      } else if (
        passingCriteria === "No of Papers Failed" &&
        failedSubjects <= parseFloat(student["Failed Papers"] || 0)
      ) {
        status = "Pass";
      } else if (
        passingCriteria === "No of Papers Passed" &&
        passedSubjects >= parseFloat(student["Passed Papers"] || 0)
      ) {
        status = "Pass";
      }

      // Determine grade
      let grade = "F";
      if (status === "Pass") {
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 33) grade = "D";
      }

      // Determine performance
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

    // Calculate positions
    const sorted = [...percentageValues].sort(
      (a, b) => b.percentage - a.percentage
    );
    const positions = {};
    sorted.forEach((item, pos) => {
      positions[item.index] = pos + 1;
    });

    // Update all states
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
    setSubjectMarks(marksBySubject);
  }, [students]);

  // Helper functions for ordinal numbers
  const getOrdinalSuffix = (num) => {
    if (!num) return "N/A";
    const n = parseInt(num, 10);
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${n}th`;
    if (lastDigit === 1) return `${n}st`;
    if (lastDigit === 2) return `${n}nd`;
    if (lastDigit === 3) return `${n}rd`;
    return `${n}th`;
  };

  const getSuffixOnly = (num) => {
    const n = parseInt(num, 10);
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    if (lastDigit === 1) return "st";
    if (lastDigit === 2) return "nd";
    if (lastDigit === 3) return "rd";
    return "th";
  };

  if (!students.length) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Detailed Mark Certificates</h1>
        <p className="text-red-500">
          No student data found. Please upload files first.
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="no-print">Digital Mark Sheets</h2>

      <div className="dmc-grid">
        {students.map((student, index) => {
          const totalPossible = student.Subjects.reduce(
            (acc, subject) => acc + (parseFloat(subject.totalMarks) || 0),
            0
          );

          return (
            <div key={index} className="dmc-card">
              {/* Decorative elements */}
              <div className="decorative-shape top-left"></div>
              <div className="decorative-shape top-right"></div>
              <div className="decorative-shape bottom-left"></div>
              <div className="decorative-shape bottom-right"></div>

              {/* School header */}
              <h2
                style={{ fontFamily: "Merriweather, serif" }}
                className="relative z-40"
              >
                <strong>{student["School Name"]}</strong>
              </h2>

              <div className="flex justify-center items-center w-full h-[180px] object-cover my-1 p-0 mt-[-40px] mb-[-40px] relative">
                <img
                  src={student.Logo}
                  alt="School Logo"
                  className="w-auto h-full m-0 p-0 z-20 object-cover"
                />
              </div>

              <h3 className="relative z-40">
                <strong>Detailed Marks Certificate</strong>
              </h3>

              {/* Student info */}
              <div className="flex flex-col items-center">
                <div className="flex flex-wrap justify-center text-left gap-4 studentInfo">
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2 relative z-40">
                    <strong>Roll Number:</strong> {student["R.No"] || "N/A"}
                  </div>
                  <div className="border p-1 rounded-lg w-full max-w-[300px] px-2 relative z-40">
                    <strong>Exam Type: </strong> {student["Exam Type"] || "N/A"}
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
                <table className="w-full border text-center">
                  <thead>
                    <tr className="bg-gray-200">
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
                    {student.Subjects.map((subject, i) => {
                      const subjectKey = getSubjectKey(subject.paper);
                      const obtained = subjectMarks[index]?.[subjectKey] || 0;

                      return (
                        <tr key={i} className="hover:bg-gray-100">
                          <td className="border px-4 py-1">{i + 1}</td>
                          <td className="border px-4 py-1">{subject.paper}</td>
                          <td className="border px-4 py-1">
                            {subject.totalMarks}
                          </td>
                          <td className="border px-4 py-1">
                            {obtained === "A" ? "A" : obtained}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="hover:bg-gray-100">
                      <td
                        colSpan={2}
                        className="border px-4 py-1 font-semibold text-center"
                      >
                        Total Marks
                      </td>
                      <td className="border px-4 py-1">{totalPossible}</td>
                      <td className="border px-4 py-1">
                        {totalObtainedMarks[index] || 0}
                      </td>
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

              {/* Results summary */}
              <div className="footer mt-4 pt-1">
                <table className="w-full border text-center">
                  <tbody>
                    <tr className="bg-gray-200">
                      <td className="border px-4 py-1 font-semibold text-center">
                        Percentage
                      </td>
                      <td className="p-2 border">
                        {(
                          (totalObtainedMarks[index] / (totalPossible || 1)) *
                          100
                        ).toFixed(2)}
                        %
                      </td>
                      <td className="p-2 border font-semibold">Grade</td>
                      <td className="p-2 border">{grades[index] || "N/A"}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Position</td>
                      <td className="p-2 border">
                        {getOrdinalSuffix(studentPositions[index])}
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

              {/* Grading system and promotion message */}
              <div className="grading-wrapper">
                <div className="grading-system-promotion mt-2 flex flex-nowrap justify-between items-center px-2 py-1 rounded-xl bg-white transition-all duration-300 ease-in-out overflow-hidden">
                  <div className="grading-system flex items-center p-6 rounded-2xl w-[40%] min-w-0">
                    <img
                      src="images/grade bee.PNG"
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
                    <img
                      src="images/comments.PNG"
                      alt="Comments"
                      className="w-full h-full object-contain rounded-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-bold z-10 px-6 pb-2 text-center rounded-2xl">
                      {statuses[index] !== "Fail" ? (
                        <p style={{ fontFamily: "Merriweather, serif" }}>
                          🎉 Congratulations! You have been promoted to Class{" "}
                          <span className="inline-flex items-baseline font-extrabold">
                            {student["Class Level"]?.toLowerCase() === "kg"
                              ? 1
                              : parseInt(student["Class Level"], 10) + 1}
                            <sup className="text-sm">
                              {student["Class Level"]?.toLowerCase() === "kg"
                                ? getSuffixOnly(1)
                                : getSuffixOnly(
                                    parseInt(student["Class Level"], 10) + 1
                                  )}
                            </sup>
                          </span>
                        </p>
                      ) : (
                        <p
                          style={{ fontFamily: "Merriweather, serif" }}
                          className="text-red-300"
                        >
                          Unfortunately! You have not met the required standards
                          to pass the exam.
                        </p>
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
