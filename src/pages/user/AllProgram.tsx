import CommonHeader from "@/common/header/CommonHeader";
import MiniSpinner from "@/common/loading/MiniSpinner";
import { useGetMyProgramQuery } from "@/store/LMS/program/programApi";
import { motion } from "framer-motion";

const AllProgram = () => {
  const { data, isLoading } = useGetMyProgramQuery();
  const myProgram = data?.data ?? [];

  return (
    <section className="">
      <CommonHeader>Your all programs </CommonHeader>
      <div>
        {isLoading ? (
          <MiniSpinner />
        ) : myProgram?.length === 0 ? (
          <p className="text-gray-500">No programs available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {myProgram.map((program) => (
              <motion.div
                key={program.program.id}
                whileHover={{ scale: 1.05 }}
                className="p-2 border border-primary w-[220px] h-[230px] bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer flex flex-col items-center"
              >
                <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <img
                    src={program.program.thumbnail}
                    alt={program.program.title}
                    className="h-full object-contain rounded-lg"
                  />
                </div>
                <p className="text-primary text-center font-semibold text-sm truncate w-full mb-1">
                  {program.program.title}
                </p>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    program.status === "CERTIFIED"
                      ? "bg-green-100 text-green-700"
                      : program.status === "STANDARD"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {program.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProgram;
