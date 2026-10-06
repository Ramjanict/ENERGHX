import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteBasicContentMutation } from "@/store/LMS/content/contentApi";
import { BasicContent } from "@/store/LMS/module/types/regularModule";
import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type BasicContentProps = {
  basicContent?: BasicContent; // Make it optional
  onEdit?: () => void;
};

const BasicContentCard: React.FC<BasicContentProps> = ({
  basicContent,
  onEdit,
}) => {
  const [deleteBasicContent, { isLoading, originalArgs }] =
    useDeleteBasicContentMutation();

  if (!basicContent) return null;

  const handleDelete = async () => {
    try {
      await deleteBasicContent(basicContent.id).unwrap();
    } catch (error) {
      console.error("Failed to delete basic content:", error);
    }
  };

  const isDeleting = isLoading && originalArgs === basicContent.id;
  return (
    <CommonBorderWrapper>
      {basicContent.video && (
        <video
          src={
            basicContent.video instanceof File
              ? URL.createObjectURL(basicContent.video)
              : basicContent.video
          }
          controls
          className="w-full max-h-60 object-contain bg-black"
        />
      )}
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold capitalize text-gray-800">
          {basicContent.title}
        </h2>

        <div className="flex justify-end items-center gap-2 pt-4">
          <EditButton onClick={onEdit}>Edit</EditButton>
          <DeleteButton disabled={isDeleting} onClick={handleDelete}>
            Delete
          </DeleteButton>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default BasicContentCard;
