import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteProgramMutation } from "@/store/LMS/program/programApi";
import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type Program = {
  id: string;
  thumbnail: string;
  description: string;
  title: string;
  price: number;
  publishedFor: "DEVELOPER" | "SERVER";
};

type ProgramCardProps = {
  program: Program;
  onEdit?: () => void;
};

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onEdit }) => {
  const [deleteProgram, { isLoading: isProgramDeleting, originalArgs }] =
    useDeleteProgramMutation();

  const handleDelete = async () => {
    if (!program?.id) return;
    try {
      await deleteProgram(program.id).unwrap();
    } catch (error) {
      console.error("Failed to delete program:", error);
    }
  };

  const isDeleting = isProgramDeleting && originalArgs === program.id;

  return (
    <CommonBorderWrapper className="">
      <img
        className="w-full h-48 object-cover"
        src={program.thumbnail}
        alt={program.title || "Program Thumbnail"}
      />
      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold capitalize text-gray-800">
          {program.title}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3">
          {program.description}
        </p>
        <div className="flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-green-600">
            ${program.price}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 uppercase">
            {program.publishedFor}
          </span>
        </div>
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

export default ProgramCard;
