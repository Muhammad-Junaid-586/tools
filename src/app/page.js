import Link from "next/link";
import {
  FaFileAlt,
  FaClipboardList,
  FaIdCard,
  FaCertificate,
  FaFileInvoice,
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {
  const features = [
    {
      title: "DMC Generator",
      description:
        "Create detailed and professional DMCs (Detailed Marks Certificates) for students with customizable layouts.",
      icon: (
        <FaFileAlt className="text-blue-600 text-4xl transition-transform duration-300 group-hover:scale-110" />
      ),
      path: "/dmcIntro",
      bgColor: "bg-blue-50",
    },
    {
      title: "Papers Making",
      description:
        "Generate exam papers with ease, tailored to your curriculum and requirements.",
      icon: (
        <FaClipboardList className="text-green-600 text-4xl transition-transform duration-300 group-hover:scale-110" />
      ),
      path: "/papers",
      bgColor: "bg-green-50",
    },
    {
      title: "Roll No Slip",
      description:
        "Create roll no slips for exams, ensuring a smooth and organized examination process.",
      icon: (
        <FaFileInvoice className="text-purple-600 text-4xl transition-transform duration-300 group-hover:scale-110" />
      ),
      path: "/rollno-slip",
      bgColor: "bg-purple-50",
    },
    {
      title: "Student Cards",
      description: "Design and print professional student ID cards with ease.",
      icon: (
        <FaIdCard className="text-yellow-600 text-4xl transition-transform duration-300 group-hover:scale-110" />
      ),
      path: "/student-cards",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Certificate Generator",
      description:
        "Generate certificates for achievements, events, and more with customizable templates.",
      icon: (
        <FaCertificate className="text-pink-600 text-4xl transition-transform duration-300 group-hover:scale-110" />
      ),
      path: "/certificate-generator",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center mt-12 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">EduDoc Generator</span>
        </h1>
        <p className="text-gray-600 text-lg">
          Your one-stop solution for creating and managing educational documents
          with ease. Generate DMCs, roll no slips, student cards, certificates,
          and exam papers efficiently.
        </p>
        <p className="text-gray-600 text-lg mt-4">
          Trusted by thousands of educational institutions and individuals, our
          platform saves time and ensures professional-quality results.
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-12 bg-white shadow-md rounded-lg p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link
              href={feature.path}
              key={index}
              className={`${feature.bgColor} p-6 rounded-lg hover:shadow-xl transition group flex flex-col items-center text-center relative cursor-pointer`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
              <FaArrowRight className="absolute bottom-4 right-4 text-gray-500 group-hover:text-gray-800 transition" />
            </Link>
          ))}
        </div>
      </div>

      {/* Usage Statistics Section */}
      <div className="mt-12 bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto w-full mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Our Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-extrabold text-blue-600">10,000+</h3>
            <p className="text-gray-600 mt-2">Documents Generated</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold text-green-600">500+</h3>
            <p className="text-gray-600 mt-2">Happy Clients</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-extrabold text-purple-600">95%</h3>
            <p className="text-gray-600 mt-2">Satisfaction Rate</p>
          </div>
        </div>
      </div>AVA
    </div>
  );
};

export default Home;
