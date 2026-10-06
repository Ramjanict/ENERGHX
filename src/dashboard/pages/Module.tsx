import { useGetAllModuleQuery } from "@/store/LMS/module/moduleApi";
import React, { useState } from "react";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import ModuleCard from "../Common/ModuleCard";
import AllCourse from "../components/AllCourse";
import ModuleCreationModal, {
  ModuleFormData,
} from "../components/creationModal/ModuleCreationModal";

const Module: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<
    (ModuleFormData & { id?: string }) | null
  >(null);
  const [moduleId, setModuleId] = useState<string | null>(null);

  const { data: moduleData } = useGetAllModuleQuery(selectedCourseId, {
    skip: !selectedCourseId,
  });
  const allModule = moduleData?.data;

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
  };

  const handleClose = () => {
    setIsModuleOpen(false);
    setSelectedModule(null);
    setModuleId(null);
  };

  return (
    <div>
      <div className="flex items-center gap-6">
        <AdminCommonHeader className="!pb-0">Choose course</AdminCommonHeader>
        <AllCourse
          handleCourseChange={handleCourseChange}
          selectedCourseId={selectedCourseId}
        />
      </div>

      <div>
        <AdminCommonHeader className="pt-6 !text-sm">
          {Array.isArray(allModule?.modules) && allModule.modules.length > 0
            ? `Modules (${allModule.modules.length})`
            : "This course does not contain any modules"}
        </AdminCommonHeader>

        <AdminCommonButton
          onClick={() => {
            setIsModuleOpen(true);
            setSelectedModule(null);
            setModuleId(null);
          }}
          className="!w-fit mb-6"
        >
          Create Module
        </AdminCommonButton>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
            (allModule?.modules?.length ?? 0) > 0 ? "pb-8" : ""
          }`}
        >
          {allModule?.modules?.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onEdit={() => {
                setSelectedModule(module);
                setIsModuleOpen(true);
                setModuleId(module.id);
              }}
            />
          ))}
        </div>

        {isModuleOpen && (
          <ModuleCreationModal
            selectedModule={selectedModule}
            moduleId={moduleId}
            onClose={handleClose}
            onSuccess={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default Module;
