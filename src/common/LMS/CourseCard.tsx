import CertificateCard from "@/dashboard/Common/CertificateCard";
import ProgressBar from "@/dashboard/components/ProgressBar";
import StarRating from "@/dashboard/components/StarRating";
import { ServerDeveloperLoginResponse } from "@/store/auth/types/loginUser";
import { usePaymentMutation } from "@/store/LMS/paymentAndCourse/paymentCourseApi";
import { AllCourse } from "@/store/LMS/program/types/programTypes";
import {
  useLazyGetCalculatedMarkQuery,
  useLazyGetResultQuery,
  useSubmitCertificateMutation,
} from "@/store/LMS/progressAndCertificate/progressAndCertificateApi";
import { CourseProgress } from "@/store/LMS/progressAndCertificate/types/progressType";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FaCrown } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AdminCommonButton from "../../dashboard/Common/AdminCommonButton";
import MiniSpinner from "../loading/MiniSpinner";
import video from "/src/assets/courses/carousel-video.png";

interface CourseCardProps {
  course: AllCourse;
  courseProgress: CourseProgress;
  onWatch: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  courseProgress,
  onWatch,
}) => {
  const [getResult, { data }] = useLazyGetResultQuery();
  const [getCalculatedMark, { data: calculatedMark }] =
    useLazyGetCalculatedMarkQuery();

  const result = data?.data;

  const { user } = useSelector((state: RootState) => state.auth);
  const serverUser = user as ServerDeveloperLoginResponse | null;

  const [payment, { isLoading: isPaymentProcessing }] = usePaymentMutation();
  const [submitCertificate, { isLoading: isCertificateSubmitting }] =
    useSubmitCertificateMutation();

  const handlePayment = async (programId: string) => {
    if (!programId) return;

    try {
      await payment(programId);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
    }
  };

  const [isModuleFetch, setIsModuleFetch] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const pathLists = [
    { path: "/standard-server", redirect: "/standard-server/all-courses" },
    { path: "/standard-server/", redirect: "/standard-server/all-courses" },
    {
      path: "/standard-server/dashboard",
      redirect: "/standard-server/all-courses",
    },
    {
      path: "/standard-server/dashboard/",
      redirect: "/standard-server/all-courses",
    },
    {
      path: "/standard-server-certified",
      redirect: "/standard-server/all-courses",
    },
    {
      path: "/standard-server-certified/",
      redirect: "/standard-server/all-courses",
    },
    {
      path: "/standard-server-certified/dashboard",
      redirect: "/standard-server/all-courses",
    },
    {
      path: "/standard-server-certified/dashboard/",
      redirect: "/standard-server/all-courses",
    },

    {
      path: "/standard-developer",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer/",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer/dashboard",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer/dashboard/",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer-certified",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer-certified/",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer-certified/dashboard",
      redirect: "/standard-developer/all-courses",
    },
    {
      path: "/standard-developer-certified/dashboard/",
      redirect: "/standard-developer/all-courses",
    },
  ];

  // Find a redirect object if pathname matches
  const matchedPath = pathLists.find((item) => item.path === pathname);

  const handleModule = async (id: string) => {
    try {
      setIsModuleFetch(true);
      onWatch();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Failed to fetch module:", error);
    } finally {
      setIsModuleFetch(false);
      navigate(matchedPath?.redirect || pathname);
    }
  };

  const userId = serverUser?.data?.id;
  const userData = serverUser?.data;

  const [isCertificateDownloading, setIsCertificateDownloading] =
    useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleCertificate = async (courseId: string) => {
    if (!userId || !courseId) return;

    try {
      setIsCertificateDownloading(true);

      await submitCertificate({ courseId, userId });
      await getResult({ courseId, userId });
      await getCalculatedMark({ courseId, userId });
    } catch (error) {
      console.error("Certificate handling failed:", error);
    } finally {
      setIsCertificateDownloading(false);
      setShowCertificate(true);
    }
  };

  return (
    <div className=" w-full">
      {isCertificateDownloading ? (
        <MiniSpinner />
      ) : (
        <div className="w-full rounded-xl shadow-[0_0_1px_2px_rgba(0,0,0,0.04)] p-4 bg-white transition duration-300 ">
          <div className="flex flex-col md:flex-row gap-10">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full md:w-[250px] h-[200px] object-cover rounded-lg"
            />

            <div className="w-full flex flex-col gap-4">
              <h2 className="font-semibold  text-xl md:text-2xl text-gray-800">
                {course.title}
              </h2>

              <div className="flex gap-2 text-gray-600 text-sm">
                {course.level !== "BASIC" && (
                  <div className="flex items-center gap-2">
                    <img src={video} alt="Modules" className="w-5 h-5" />
                    <span>{course._count?.modules} modules</span>
                  </div>
                )}

                {course.averageRating > 1 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <StarRating number={course?.averageRating} />
                    <span className="text-yellow-500 font-semibold">
                      {course?.averageRating?.toFixed(1)} / 5
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-700">
                      {course?._count?.reviews ?? 0} review
                      {course?._count?.reviews !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex  items-center gap-6  pb-4">
                {course.level === "BASIC" && (
                  <button
                    onClick={() => handlePayment(course.programId)}
                    disabled={isPaymentProcessing}
                    className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white transition hover:bg-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-1 text-xs sm:text-lg">
                      <span>
                        <FaCrown />
                      </span>
                      {isPaymentProcessing ? "Processing..." : " Upgrade"}
                    </div>
                  </button>
                )}

                <button
                  onClick={() => handleModule(course.id)}
                  className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white transition hover:bg-green-500"
                >
                  {isModuleFetch
                    ? "Processing..."
                    : course.level === "BASIC"
                      ? " Show Demo"
                      : "Watch Now"}
                </button>
              </div>

              {course.level !== "BASIC" && (
                <div className=" flex gap-10 items-center">
                  <div className=" flex-1">
                    <ProgressBar percentage={courseProgress?.percentage} />
                  </div>
                  {courseProgress?.percentage === 100 && (
                    <AdminCommonButton
                      className="!w-fit"
                      disabled={isCertificateSubmitting}
                      onClick={() => handleCertificate(course.id)}
                    >
                      {isCertificateSubmitting
                        ? "Downloading..."
                        : "Get certificate"}
                    </AdminCommonButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {user && showCertificate && course.level !== "BASIC" && (
        <CertificateCard
          user={userData!!}
          certificate={result!!}
          calculatedMark={calculatedMark?.data ?? null}
          setShowCertificate={setShowCertificate}
        />
      )}
    </div>
  );
};

export default CourseCard;
