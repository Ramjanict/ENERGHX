import { useGetAllModuleQuery } from "@/store/LMS/module/moduleApi";
import React, { useState } from "react";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import BasicContentCard from "../Common/BasicContentCard";
import AllCourse from "../components/AllCourse";
import BasicContentCreationModal, {
  BasicContentFormData,
} from "../components/creationModal/BasicContentCreationModal";

const BasicContent: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isBasicContentOpen, setIsBasicContentOpen] = useState(false);
  const [selectedBasicContent, setSelectedBasicContent] = useState<
    (BasicContentFormData & { id?: string }) | null
  >(null);
  const [basicContentId, setBasicContentId] = useState<string | null>(null);

  const { data: moduleData } = useGetAllModuleQuery(selectedCourseId, {
    skip: !selectedCourseId,
    refetchOnMountOrArgChange: true,
  });
  const allModule = moduleData?.data;

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
  };

  const handleClose = () => {
    setIsBasicContentOpen(false);
    setSelectedBasicContent(null);
    setBasicContentId(null);
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

      <div className="">
        <div className="">
          <AdminCommonHeader className="pt-6 !text-sm">
            {Array.isArray(allModule?.basicContents) &&
            allModule.basicContents.length > 0
              ? `Basic Content (${allModule.basicContents.length})`
              : "This course does not contain any Basic Content"}
          </AdminCommonHeader>
        </div>

        <AdminCommonButton
          onClick={() => {
            setIsBasicContentOpen(true);
            setSelectedBasicContent(null);
            setBasicContentId(null);
          }}
          className="!w-fit mb-6"
        >
          Create Basic Content
        </AdminCommonButton>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
            (allModule?.basicContents?.length ?? 0) > 0 ? "pb-8" : ""
          }`}
        >
          {allModule?.basicContents?.map((basicContent) => (
            <BasicContentCard
              key={basicContent.id}
              basicContent={basicContent}
              onEdit={() => {
                setSelectedBasicContent(basicContent);
                setIsBasicContentOpen(true);
                setBasicContentId(basicContent.id);
              }}
            />
          ))}
        </div>

        {isBasicContentOpen && (
          <BasicContentCreationModal
            selectedBasicContent={selectedBasicContent}
            basicContentId={basicContentId}
            onClose={handleClose}
            onSuccess={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default BasicContent;
