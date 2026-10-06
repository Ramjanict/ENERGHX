import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteContentMutation } from "@/store/LMS/content/contentApi";
import { ContentItem } from "@/store/LMS/content/types/contentType";
import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

interface ContentCardProps {
  content: ContentItem;
  onEdit?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onEdit }) => {
  const [deleteContent, { isLoading, originalArgs }] =
    useDeleteContentMutation();

  const handleDelete = async () => {
    if (!content?.id) return;
    try {
      await deleteContent(content.id).unwrap();
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const isDeleting = isLoading && originalArgs === content.id;

  return (
    <CommonBorderWrapper>
      {content.contentType === "VIDEO" && content?.video ? (
        <video
          src={content?.video}
          controls
          className="w-full max-h-60 object-contain bg-black"
        />
      ) : content.contentType === "DESCRIPTION" && content?.description ? (
        <div className="p-4">
          <p className="text-gray-700 text-sm line-clamp-6">
            {content?.description}
          </p>
        </div>
      ) : (
        <div className="p-4">
          <p className="italic text-gray-500 text-sm">Quiz content</p>
        </div>
      )}

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold capitalize text-gray-800">
          {content?.title}
        </h2>
        <p className="text-sm text-gray-500 capitalize">
          {content?.contentType?.toLowerCase()}
        </p>

        <div className="flex justify-end items-center gap-2 pt-4">
          <EditButton onClick={onEdit}>Edit</EditButton>
          <DeleteButton disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Deleting..." : "Delete"}
          </DeleteButton>
        </div>
      </div>
    </CommonBorderWrapper>
  );
};

export default ContentCard;
