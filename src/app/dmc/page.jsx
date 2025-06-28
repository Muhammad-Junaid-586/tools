"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../Dmc.css";

// Subject mapping
const subjectMapping = {
  urdu: ["u", "ur", "urdu", "Urdu"],
  generalscience: ["gs", "general science", "generalscience"],
  pakstudy: ["ps", "pak study", "pakstudy"],
  english: ["e", "eng", "Eng", "english"],
  islamiat: ["is", "islamiat", "islamic study", "islamicstudy"],
  mathematics: ["m", "math", "maths", "Math", "Maths", "mathematics"],
  physics: ["p", "physics", "phy"],
  chemistry: ["c", "chemistry", "chem"],
  biology: ["b", "biology", "bio"],
  computerScience: ["cs", "computer science", "comp sci", "comp-science"],
  history: ["h", "history", "hist", "his", "Hist"],
  geography: ["g", "geography", "geo", "Geo"],
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
  computerStudies: ["cs", "computer studies", "comp studies", "comp-studies"],
};

// =====================================//
// Helper function to get the standardized subject key
const getSubjectKey = (subjectName) => {
  // Create a direct mapping based on your actual data structure
  const directMapping = {
    english: "Eng",
    drawing: "Dw",
    mathematics: "Math",
    math: "Math",
    nazra: "Nazra",
    urdu: "urdu",
    // Add more mappings as needed
  };

  // Convert subject name to lowercase for case-insensitive matching
  const lowerSubject = subjectName.toLowerCase().trim();

  // Return the mapped key or the original subject name if no mapping found
  return directMapping[lowerSubject] || subjectName;
};

// =====================================//

const DMCPage = () => {
  const dmcData = useSelector((state) => state.dmc);
  const students = dmcData?.students || [];

  const [obtainedMarks, setObtainedMarks] = useState({});
  const [grades, setGrades] = useState({});
  const [studentPositions, setStudentPositions] = useState({});
  const [statuses, setStatuses] = useState({});
  const [performances, setPerformances] = useState({});
  const [totalObtainedMarks, setTotalObtainedMarks] = useState({});

  useEffect(() => {
    if (!students || students.length === 0) return;

    console.log("Starting calculations for", students.length, "students");

    const calculateAllResults = () => {
      const results = [];
      const percentageValues = [];

      // 1. First Pass: Calculate basic metrics for each student
      students.forEach((student, studentIndex) => {
        console.group(`Calculating for student ${studentIndex}`);
        console.log("Student data:", student);

        let totalPossible = 0;
        let totalObtained = 0;
        let passedSubjects = 0;
        let failedSubjects = 0;

        // Calculate subject marks
        student.Subjects.forEach((subject, subjIndex) => {
          const subjectKey = getSubjectKey(subject.paper);
          const subjectMarks = parseFloat(subject.totalMarks) || 0;
          const obtainedMarks = parseFloat(student[subjectKey]) || 0;
          const passingMarks = parseFloat(subject.passingMarks) || 0;

          console.log(`Subject ${subjIndex}:`, {
            name: subject.paper,
            keyUsed: subjectKey,
            total: subjectMarks,
            obtained: obtainedMarks,
            passing: passingMarks,
          });

          totalPossible += subjectMarks;
          totalObtained += obtainedMarks;

          if (obtainedMarks >= passingMarks) {
            passedSubjects++;
          } else {
            failedSubjects++;
          }
        });

        // Calculate percentage with safeguard
        const percentage =
          totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

        console.log("Mark totals:", {
          totalPossible,
          totalObtained,
          passedSubjects,
          failedSubjects,
          calculatedPercentage: percentage,
        });

        // Determine status
        const passingCriteria = student["Passing Criteria"] || "Percentage";
        const passingPercentage =
          parseFloat(student["Passing Percentage"]) || 0;
        const failedAllowed = parseFloat(student["Failed Papers"]) || 0;
        const passedRequired = parseFloat(student["Passed Papers"]) || 0;

        let status = "Fail";
        if (
          passingCriteria === "Percentage" &&
          percentage >= passingPercentage
        ) {
          status = "Pass";
        } else if (
          passingCriteria === "No of Papers Failed" &&
          failedSubjects <= failedAllowed
        ) {
          status = "Pass";
        } else if (
          passingCriteria === "No of Papers Passed" &&
          passedSubjects >= passedRequired
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

        console.log("Calculated results:", {
          percentage,
          status,
          grade,
          performance,
        });

        results.push({
          index: studentIndex,
          totalObtained,
          percentage,
          status,
          grade,
          performance,
        });

        percentageValues.push({ index: studentIndex, percentage });
        console.groupEnd();
      });

      // 2. Calculate positions
      console.log("Calculating positions...");
      const sortedPercentages = [...percentageValues].sort(
        (a, b) => b.percentage - a.percentage
      );
      const positions = {};
      sortedPercentages.forEach((item, pos) => {
        positions[item.index] = pos + 1;
      });

      // 3. Update all states
      console.log("Updating state with final results");
      const newStates = results.reduce(
        (acc, result) => {
          acc.obtainedMarks[result.index] = result.totalObtained;
          acc.grades[result.index] = result.grade;
          acc.statuses[result.index] = result.status;
          acc.performances[result.index] = result.performance;
          return acc;
        },
        {
          obtainedMarks: {},
          grades: {},
          statuses: {},
          performances: {},
        }
      );

      setObtainedMarks(newStates.obtainedMarks);
      setGrades(newStates.grades);
      setStatuses(newStates.statuses);
      setPerformances(newStates.performances);
      setStudentPositions(positions);

      console.log("Final state updates:", {
        obtainedMarks: newStates.obtainedMarks,
        grades: newStates.grades,
        statuses: newStates.statuses,
        performances: newStates.performances,
        positions,
      });
    };

    calculateAllResults();
  }, [students]);

  const getOrdinalSuffix = (num) => {
    if (!num) return "N/A";
    num = Number(num);
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${num}th`;
    if (lastDigit === 1) return `${num}st`;
    if (lastDigit === 2) return `${num}nd`;
    if (lastDigit === 3) return `${num}rd`;
    return `${num}th`;
  };

  const getSuffixOnly = (num) => {
    const number = parseInt(num, 10);
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    if (lastDigit === 1) return "st";
    if (lastDigit === 2) return "nd";
    if (lastDigit === 3) return "rd";
    return "th";
  };

  const getOrdinal = (num) => {
    const number = parseInt(num, 10);
    if (isNaN(number)) return "";
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return `${number}th`;
    if (lastDigit === 1) return `${number}st`;
    if (lastDigit === 2) return `${number}nd`;
    if (lastDigit === 3) return `${number}rd`;
    return `${number}th`;
  };

  if (!dmcData || students.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Detailed Mark Certificates</h1>
        <p className="text-red-500">
          No student data found. Please upload files first.
        </p>
      </div>
    );
  }
  console.log(students);

  return (
    <div className="container">
      <h2 className="no-print">Digital Mark Sheets</h2>

      <div className="dmc-grid">
        {students.map((student, index) => (
          <div key={index} className="dmc-card">
            <div className="decorative-shape top-left"></div>
            <div className="decorative-shape top-right"></div>
            <div className="decorative-shape bottom-left"></div>
            <div className="decorative-shape bottom-right"></div>

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
                  <strong>Session/year: </strong> {student["Session"] || "N/A"}
                </div>
              </div>
            </div>

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
                    fontSize: student.Subjects.length > 8 ? ".9rem" : "1rem",
                  }}
                >
                  {student.Subjects?.map((subject, i) => (
                    <tr key={i} className="hover:bg-gray-100">
                      <td className="border px-4 py-1">{i + 1}</td>
                      <td className="border px-4 py-1">{subject.paper}</td>
                      <td className="border px-4 py-1">{subject.totalMarks}</td>
                      <td className="border px-4 py-1">
                        {student[getSubjectKey(subject.paper)]}
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
                    <td className="border px-4 py-1">
                      {student.Subjects?.reduce(
                        (acc, subject) =>
                          acc + (Number(subject.totalMarks) || 0),
                        0
                      )}
                    </td>
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

            <div className="footer mt-4 pt-1">
              <table className="w-full border text-center">
                <tbody>
                  <tr className="bg-gray-200">
                    <td className="border px-4 py-1 font-semibold text-center">
                      Percentage
                    </td>
                    <td className="p-2 border">
                      {(
                        (obtainedMarks[index] /
                          (student.Subjects?.reduce(
                            (acc, subject) =>
                              acc + (Number(subject.totalMarks) || 0),
                            0
                          ) || 1)) *
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
                      {getOrdinal(studentPositions[index] || "N/A")}
                    </td>
                    <td className="p-2 border font-semibold">Performance</td>
                    <td className="p-2 border">
                      {performances[index] || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mr-[20px] m-0 p-0">
              <span className="text-gray-600 font-medium">
                Result Declaration Date : {student["Declaration Date"]}
              </span>
            </div>

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
                          {parseInt(student["Class Level"]) + 1}
                          <sup className="text-sm">
                            {getSuffixOnly(
                              parseInt(student["Class Level"]) + 1
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

              <div>
                <div
                  className="flex justify-between mt-3"
                  style={{
                    marginTop: student.Subjects?.length < 7 ? "6rem" : "2.5rem",
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
        ))}
      </div>
    </div>
  );
};

export default DMCPage;
