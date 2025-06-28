"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DMCPage = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [schoolName, setSchoolName] = useState("");
  const [examType, setExamType] = useState("");
  const [declarationDate, setDeclarationDate] = useState("");
  const [session, setSession] = useState("");
  const [classLevel, setClassLevel] = useState("");

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem("dmcData")) || []);
    setSubjects(JSON.parse(localStorage.getItem("subjects")) || []);
    setSchoolName(localStorage.getItem("schoolName") || "");
    setExamType(localStorage.getItem("examType") || "");
    setDeclarationDate(localStorage.getItem("declarationDate") || "");
    setSession(localStorage.getItem("session") || "");
    setClassLevel(localStorage.getItem("classLevel") || "");
  }, []);

  const generateDMC = (student) => {
    const doc = new jsPDF();
    doc.text(`DMC - ${examType}`, 20, 20);
    doc.text(`School: ${schoolName}`, 20, 30);
    doc.text(`Student: ${student.name}`, 20, 40);
    doc.text(`Father: ${student.fatherName || ""}`, 20, 50);
    doc.text(`Class: ${classLevel}`, 20, 60);
    doc.text(`Roll No: ${student.rollNo || ""}`, 20, 70);
    doc.text(`Session: ${session}`, 20, 80);
    doc.text(`Declaration Date: ${declarationDate}`, 20, 90);

    doc.autoTable({
      startY: 100,
      head: [["Subject", "Marks", "Passing Marks"]],
      body: subjects.map((s) => [s.paper, s.marks, s.passingMarks || "-"]),
    });

    doc.save(`${student.name}_DMC.pdf`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generated DMCs</h1>
      {students.length === 0 ? (
        <p>No student data found. Please upload files first.</p>
      ) : (
        students.map((student, idx) => (
          <div
            key={idx}
            className="p-4 mb-4 border shadow flex justify-between items-center"
          >
            <div>
              <p>Name: {student.name}</p>
              <p>Roll No: {student.rollNo}</p>
              <p>Father's Name: {student.fatherName}</p>
            </div>
            <button
              onClick={() => generateDMC(student)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Download DMC
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default DMCPage;
