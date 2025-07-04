"use client";

import { useState, useRef } from "react";
import ResumeForm from "../../components/resume/ResumeForm";
import ResumePreview from "../../components/resume/ResumePreview";

// Sample resume data structure with photo field
const initialResumeData = {
  personalInfo: {
    name: "Muhammad Junaid",
    title: "Software Engineer",
    email: "junaid@example.com",
    phone: "+92 300 1234567",
    location: "Hangu, Pakistan",
    summary:
      "Passionate full-stack developer with 5+ years of experience building scalable web applications using modern JavaScript frameworks.",
    photo: null,
  },
  experience: [
    {
      id: 1,
      position: "Senior Frontend Developer",
      company: "Tech Innovations Ltd",
      period: "2020 - Present",
      description:
        "Led development of React-based applications, improved performance by 40%, mentored junior developers",
    },
    {
      id: 2,
      position: "Web Developer",
      company: "Digital Solutions Inc",
      period: "2018 - 2020",
      description:
        "Developed responsive websites using HTML5, CSS3, and JavaScript, collaborated with design team",
    },
  ],
  projects: [
    {
      id: 123,
      name: "Project Name",
      period: "Jan 2023 - Mar 2023",
      technologies: "React, Node.js",
      description: "Project description...",
    },
  ],
  education: [
    {
      id: 1,
      degree: "B.S. Computer Science",
      institution: "University of Punjab",
      period: "2014 - 2018",
    },
  ],
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Next.js",
    "Tailwind CSS",
    "Redux",
    "TypeScript",
  ],
};

export default function CVPage() {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [editMode, setEditMode] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("professional");

  const handleSave = (updatedData) => {
    setResumeData(updatedData);
    setEditMode(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 no-print">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
            <p className="text-gray-600">
              Create and customize your professional CV
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center border rounded-md overflow-hidden bg-white">
              <button
                className={`px-3 py-2 text-sm ${
                  activeTemplate === "professional"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTemplate("professional")}
              >
                Professional
              </button>
              <button
                className={`px-3 py-2 text-sm ${
                  activeTemplate === "modern"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTemplate("modern")}
              >
                Modern
              </button>
              <button
                className={`px-3 py-2 text-sm ${
                  activeTemplate === "creative"
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTemplate("creative")}
              >
                Creative
              </button>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm md:text-base"
            >
              {editMode ? "Preview CV" : "Edit CV"}
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm md:text-base"
            >
              Download PDF
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-${editMode ? "2" : "2"}`}>
            {editMode ? (
              <ResumeForm data={resumeData} onSave={handleSave} />
            ) : (
              <ResumePreview data={resumeData} template={activeTemplate} />
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 no-print">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              CV Tips & Templates
            </h2>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Professional Advice
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Keep your CV to 1-2 pages maximum</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Use action verbs: Developed, Implemented, Managed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Quantify achievements with numbers when possible</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Tailor your CV for each job application</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-3">
                Sample Templates
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "professional"
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setActiveTemplate("professional")}
                >
                  <div className="bg-gray-100 border-b p-2 text-center text-xs">
                    Professional
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-bold text-sm">John Doe</div>
                      <div className="text-xs text-gray-500">
                        Software Engineer
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeTemplate === "modern"
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => setActiveTemplate("modern")}
                >
                  <div className="bg-gray-100 border-b p-2 text-center text-xs">
                    Modern
                  </div>
                  <div className="h-32 bg-gradient-to-r from-green-50 to-teal-50 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-bold text-sm">John Doe</div>
                      <div className="text-xs text-gray-500">UX Designer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">Pro Tip</h3>
              <p className="text-sm text-yellow-700">
                Save time by uploading your existing resume - our system will
                extract your information automatically!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
