import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteModuleMutation } from "@/store/LMS/module/moduleApi";
import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type Module = {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  courseId: string;
};

type ModuleCardProps = {
  module: Module;
  onEdit?: () => void;
};

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onEdit }) => {
  const [deleteModule, { isLoading: isModuleDeleting, originalArgs }] =
    useDeleteModuleMutation();

  const handleDelete = async () => {
    if (!module?.id) return;
    try {
      await deleteModule(module.id).unwrap();
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
  };

  const isDeleting = isModuleDeleting && originalArgs === module.id;

  return (
    <CommonBorderWrapper>
      <img
        className="w-full h-48 object-cover"
        src={module.thumbnail}
        alt={module.title || "Program Thumbnail"}
      />
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold capitalize text-gray-800">
          {module.title}
        </h2>

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

export default ModuleCard;
