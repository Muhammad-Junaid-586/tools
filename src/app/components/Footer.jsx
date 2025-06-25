import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-16 no-print">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Logo & About */}
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide text-white">
            EduDoc Generator
          </h2>
          <p className="mt-5 leading-relaxed text-gray-300">
            A seamless solution for generating educational documents such as
            DMCs, roll no slips, student cards, and certificates with ease and
            professionalism.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { name: "DMC Generator", link: "/dmcIntro" },
              { name: "Papers Making", link: "/papers" },
              { name: "Roll No Slip", link: "/rollno-slip" },
              { name: "Student Cards", link: "/student-cards" },
              { name: "Certificate Generator", link: "/certificate-generator" },
            ].map((item, index) => (
              <li key={index}>
                <Link
                  href={item.link}
                  className="relative text-white hover:text-white transition duration-300 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-white before:transition-all before:duration-300 hover:before:w-full"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">Contact Us</h3>
          <p className="flex items-center mb-2 text-gray-300">
            <FaMapMarkerAlt className="text-white mr-2" /> Hangu, Pakistan
          </p>
          <p className="flex items-center mb-2 text-gray-300">
            <FaPhoneAlt className="text-white mr-2" /> +92 300 1234567
          </p>
          <p className="flex items-center mb-5 text-gray-300">
            <FaEnvelope className="text-white mr-2" /> support@edudoc.com
          </p>

          {/* Social Media Links */}
          <div className="flex space-x-5">
            {[
              { icon: FaFacebookF, link: "#" },
              { icon: FaTwitter, link: "#" },
              { icon: FaLinkedinIn, link: "#" },
              { icon: FaInstagram, link: "#" },
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full hover:bg-white hover:text-gray-900 transition duration-300"
              >
                <item.icon className="text-lg" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 border-t border-gray-700 pt-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} EduDoc Generator. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
