import MiniSpinner from "@/common/loading/MiniSpinner";
import { useGetAllProgramQuery } from "@/store/LMS/program/programApi";
import { useState } from "react";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import ProgramCard from "../Common/ProgramCard";
import ProgramCreationModal, {
  ProgramFormData,
} from "../components/creationModal/ProgramCreationModal";

const Program: React.FC = () => {
  const { data, isLoading } = useGetAllProgramQuery();
  const allProgram = data?.data ?? [];

  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<
    (ProgramFormData & { id?: string }) | null
  >(null);
  const [programId, setProgramId] = useState<string | null>(null);

  const handleClose = () => {
    setIsProgramOpen(false);
    setSelectedProgram(null);
    setProgramId(null);
  };

  const handleSuccess = () => {
    handleClose();
  };

  return (
    <div>
      <AdminCommonHeader>All Programs</AdminCommonHeader>
      <AdminCommonButton
        onClick={() => {
          setIsProgramOpen(true);
          setSelectedProgram(null);
          setProgramId(null);
        }}
        className={`!w-fit ${allProgram.length > 0 ? "mb-10" : ""}`}
      >
        Create Program
      </AdminCommonButton>
      {isLoading ? (
        <MiniSpinner />
      ) : allProgram.length === 0 ? (
        <p className="text-gray-500">No programs available.</p>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
            allProgram.length > 0 ? "pb-8" : ""
          }`}
        >
          {allProgram.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onEdit={() => {
                setSelectedProgram(program);
                setIsProgramOpen(true);
                setProgramId(program.id);
              }}
            />
          ))}
        </div>
      )}

      {isProgramOpen && (
        <ProgramCreationModal
          selectedProgram={selectedProgram}
          programId={programId}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default Program;
