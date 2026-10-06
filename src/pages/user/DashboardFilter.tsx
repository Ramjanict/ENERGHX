import { useGetMyProgramQuery } from "@/store/LMS/program/programApi";
import { useState } from "react";
import { FaBookOpen, FaMedal } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa6";

const DashboardFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data } = useGetMyProgramQuery();
  const myProgram = data?.data ?? [];

  const courseFilterArray = [
    {
      icon: FaGraduationCap,
      label: "All Program",
      number: `${myProgram?.length || 0} `,
      value: "all",
    },
    {
      icon: FaBookOpen,
      label: "Enrolled Programs",
      number: `${
        myProgram.filter(
          (item) => item.status === "CERTIFIED" || item.status === "STANDARD",
        ).length || 0
      }`,
      value: "enrolled",
    },
    {
      icon: FaMedal,
      label: "Completed Programs",
      number: `${
        myProgram.filter((item) => item.status === "CERTIFIED").length || 0
      }`,
      value: "completed",
    },
  ];

  return (
    <>
      {courseFilterArray.map((item, i) => {
        const IconElement = item.icon;
        return (
          <div
            className={` w-full p-6 rounded-3xl border-[#9ED98A] cursor-pointer transition-all duration-300 
                ${
                  item.value === selectedFilter
                    ? "bg-primary"
                    : "bg-light-green border"
                }
                hover:scale-105
              `}
            onClick={() => setSelectedFilter(item.value)}
            key={i}
          >
            <div className="flex justify-center mb-3">
              <span
                className={`text-6xl 
                    ${
                      item.value === selectedFilter
                        ? "text-white"
                        : "text-primary"
                    }
                  `}
              >
                <IconElement />
              </span>
            </div>
            <div className="text-center">
              <p
                className={`text-2xl font-extrabold font-akira 
                    ${
                      item.value === selectedFilter
                        ? "text-white"
                        : "text-[#1C9237]"
                    }
                  `}
              >
                {item.number}
              </p>
              <p
                className={`text-[18px] 
                    ${
                      item.value === selectedFilter
                        ? "text-white"
                        : "text-[#394A3F]"
                    }
                  `}
              >
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DashboardFilter;
