"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { title: "DMC Generator", path: "/dmcIntro" },
    { title: "CV Generator", path: "/resume/cv" },
    { title: "Papers Making", path: "/papers" },
    { title: "Roll No Slip", path: "/rollno-slip" },
    { title: "Student Cards", path: "/student-cards" },
    { title: "Certificate Generator", path: "/certificate-generator" },
  ];

  return (
    <nav className="w-full bg-white shadow-md py-4 px-8 flex justify-between items-center no-print sticky top-0 z-50">
      {/* Logo */}
      <Link
        href="/"
        className="text-3xl font-extrabold text-blue-600 hover:text-blue-700 tracking-tight transition-colors"
      >
        EduDoc
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-4 md:gap-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;

          return (
            <Link
              key={link.path}
              href={link.path}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              {link.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
