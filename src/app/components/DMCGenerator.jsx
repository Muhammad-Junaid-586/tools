"use client";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";

const DMCGenerator = ({
  students,
  logoPath,
  subjects,
  schoolName,
  session,
  className,
  examType,
  declarationDate,
}) => {
  const generateDMCs = () => {
    students.forEach((student, index) => {
      const doc = new jsPDF();

      // Add Logo
      if (logoPath) {
        const logoURL = window.location.origin + logoPath;
        doc.addImage(logoURL, "PNG", 80, 10, 50, 30);
      }

      // Heading
      doc.setFontSize(16);
      doc.text(schoolName || "School Name", 105, 50, { align: "center" });
      doc.text(`DMC - ${examType}`, 105, 60, { align: "center" });

      // Student Details
      doc.setFontSize(12);
      doc.text(`Name: ${student.Name || student.name}`, 20, 80);
      doc.text(
        `Father Name: ${student.FatherName || student.fatherName}`,
        20,
        90
      );
      doc.text(`Class: ${className}`, 20, 100);
      doc.text(`Session: ${session}`, 20, 110);
      doc.text(`Declaration Date: ${declarationDate}`, 20, 120);

      // Marks Table
      const tableData = subjects.map((subj) => [
        subj.paper,
        subj.marks,
        student[subj.paper] || "N/A",
        subj.passingMarks || "-",
      ]);

      doc.autoTable({
        head: [["Subject", "Total Marks", "Obtained Marks", "Passing Marks"]],
        body: tableData,
        startY: 130,
      });

      // Save Each PDF
      doc.save(`${student.Name || student.name}_DMC.pdf`);
    });
  };

  useEffect(() => {
    if (students?.length) {
      generateDMCs();
    }
  }, [students]);

  return null;
};

export default DMCGenerator;
