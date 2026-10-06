import { BadgeCheck, CheckCircle, Download, X, XCircle } from "lucide-react";
import React, { useRef } from "react";

import { LoginData } from "@/store/auth/types/loginUser";
import { QuizResult } from "@/store/LMS/progressAndCertificate/types/progressType";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type CertificateCardProps = {
  user: LoginData;
  certificate: QuizResult[];
  calculatedMark: number | null;
  setShowCertificate: (data: boolean) => void;
};

const CertificateCard: React.FC<CertificateCardProps> = ({
  user,
  certificate,
  calculatedMark,
  setShowCertificate,
}) => {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDownload = async (index: number, certTitle: string) => {
    const element = refs.current[index];
    if (!element) return;

    // Add class to hide download button during capture
    element.classList.add("capturing");

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${certTitle.replace(/\s+/g, "_")}_certificate.pdf`);
    } finally {
      // Remove capturing class so button re-appears
      element.classList.remove("capturing");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full ">
        {certificate.map((cert, index) => (
          <div
            key={cert.contentTitle + cert.createdAt}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className="print-area bg-white shadow-2xl  overflow-hidden p-6  pb-20 transition-transform transform hover:scale-[1.01]  flex flex-col gap-6"
          >
            <div className="flex items-center gap-6">
              <div className=" relative">
                <img
                  src={user.profile_photo}
                  alt="Profile"
                  className="w-24 h-24 object-cover rounded-full border-4 border-primary shadow"
                />
                <div className=" absolute top-20 left-15 bg-primary p-1 rounded-full text-white">
                  <BadgeCheck />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.firstname} {user.lastname}
                </h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {user.country.name}, {user.othername}
                </p>
              </div>

              <button
                onClick={() => setShowCertificate(false)}
                className="no-print flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg  transition cursor-pointer"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={() => handleDownload(index, cert.contentTitle)}
                className="no-print flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="border-t  flex flex-col gap-6">
              <h3 className="text-xl font-semibold text-gray-700 pt-2">
                🎓 Certificate of Completion
              </h3>
              <p className="text-gray-600 leading-relaxed italic">
                This is to certify that{" "}
                <span className="font-semibold text-gray-800">
                  {user.firstname} {user.lastname}
                </span>{" "}
                has successfully completed the content titled{" "}
                <span className="font-semibold text-primary">
                  "{cert.contentTitle}"
                </span>{" "}
                on{" "}
                <span className="font-medium">
                  {new Date(cert.createdAt).toLocaleDateString()}
                </span>
                .
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-500 bg-green-50" />
                    <span className="text-xl font-medium text-green-700">
                      Achievement Summary
                    </span>
                  </div>
                  <p className="text-lg text-gray-600">Total Mark</p>
                  <p className="text-xl font-bold text-green-700">
                    {cert.correctAnswers}
                  </p>
                  <p className="text-lg text-gray-600 mt-2">Mark Percentage</p>
                  <p className="text-xl font-bold text-green-700">
                    {calculatedMark ?? "--"}%
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="text-red-500" />
                    <span className="text-xl font-medium text-red-700">
                      Area for Improvement
                    </span>
                  </div>
                  <span className="text-sm font-medium text-red-700">
                    Incorrect Answers
                  </span>
                  <p className="text-xl font-bold text-red-700">
                    {cert.incorrectAnswers}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Completion Status
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {cert.isCompleted ? "Completed" : "In Progress"}
                  </p>
                </div>
              </div>

              <div className="py-6">
                {cert.isCompleted ? (
                  <div className=" text-center bg-green-100 border border-green-200 text-green-800 font-semibold px-6 py-3 rounded-xl shadow-inner">
                    🎉 Congratulations! You’ve successfully completed the
                    course.
                  </div>
                ) : (
                  <div className="text-center bg-yellow-100 border border-yellow-200 text-yellow-800 font-semibold  rounded-xl shadow-inner ">
                    ⏳ Course is not yet completed.
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-6 ">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12  border rounded-lg flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-700"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Certificate ID</p>
                  <p className="text-sm font-mono text-gray-700">
                    {Math.random().toString(36).substring(2, 10).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-700">Issued on</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateCard;
