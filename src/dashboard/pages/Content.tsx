import { useGetAllContentQuery } from "@/store/LMS/content/contentApi";
import { useGetAllModuleQuery } from "@/store/LMS/module/moduleApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import ContentCard from "../Common/ContentCard";
import AllCourse from "../components/AllCourse";
import AllModules from "../components/AllModules";
import ContentCreationModal, {
  AllContentType,
  ContentItem,
} from "../components/creationModal/ContentCreationModal";

const moduleIdSchema = z.object({
  moduleId: z.string(),
  contentType: z.enum(["DESCRIPTION", "VIDEO", "QUIZ"]).optional(),
  title: z.string().optional(),
});

const Content: React.FC = () => {
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(
    null,
  );
  const [contentId, setContentId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<AllContentType>({
    defaultValues: {
      title: "",
      contentType: "DESCRIPTION",
      moduleId: "",
      description: "",
    },
  });

  const moduleId = watch("moduleId");

  const { data: moduleData } = useGetAllModuleQuery(selectedCourseId, {
    skip: !selectedCourseId,
    refetchOnMountOrArgChange: true,
  });
  const allModule = moduleData?.data;

  const { data: contentData } = useGetAllContentQuery(moduleId, {
    skip: !moduleId,
    refetchOnMountOrArgChange: true,
  });
  const allContent = contentData?.data;

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
  };

  const handleClose = () => {
    setIsContentOpen(false);
    setSelectedContent(null);
    setContentId(null);
  };

  return (
    <>
      <AdminCommonHeader>Choose course and module</AdminCommonHeader>
      <div className="max-w-xl flex items-center gap-6 pb-6">
        <AllCourse
          handleCourseChange={handleCourseChange}
          selectedCourseId={selectedCourseId}
        />
        <AllModules
          control={control}
          errors={errors}
          selectedCourseId={selectedCourseId}
        />
      </div>

      <AdminCommonHeader className="!text-sm">
        {Array.isArray(allModule?.modules) && allModule.modules.length > 0
          ? `Content (${allContent?.contents?.length || 0})`
          : "This module does not contain any Content"}
      </AdminCommonHeader>

      <AdminCommonButton
        onClick={() => setIsContentOpen(true)}
        className="!w-fit mb-6"
      >
        Create Content
      </AdminCommonButton>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
          (allContent?.contents?.length ?? 0) > 0 ? "pb-8" : ""
        }`}
      >
        {allContent?.contents?.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onEdit={() => {
              setSelectedContent(content as ContentItem);
              setIsContentOpen(true);
              setContentId(content.id);
            }}
          />
        ))}
      </div>

      {isContentOpen && (
        <ContentCreationModal
          selectedContent={selectedContent}
          contentId={contentId}
          selectedCourseId={selectedCourseId}
          onClose={handleClose}
          onSuccess={handleClose}
        />
      )}
    </>
  );
};

export default Content;
