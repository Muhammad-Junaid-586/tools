"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const SingleDesigns = () => {
  const router = useRouter();

  const singleDmcImages = [
    {
      id: 1,
      src: "/images/myschool.jpg",
      navigate: "NewDmc",
    },
    {
      id: 2,
      src: "/images/myschool.jpg", // Make sure this image exists in your /public folder
      navigate: "kb",
    },
  ];

  const handleDesignSelection = (design) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedDesign", design);
      router.push("/upload");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Choose Your Design
        </h1>
        <p className="text-lg text-gray-500 mt-2">
          Click on a design to proceed to upload.
        </p>
      </div>

      {/* Single DMC Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Single DMC on One Page
        </h2>
        <div className="flex justify-center gap-10 flex-wrap">
          {singleDmcImages.map((image) => (
            <div
              key={image.id}
              onClick={() => handleDesignSelection(image.navigate)}
              className="w-[350px] group relative cursor-pointer bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <div className="w-full h-72 overflow-hidden">
                <Image
                  src={image.src}
                  alt={`Single DMC Design ${image.id}`}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SingleDesigns;
