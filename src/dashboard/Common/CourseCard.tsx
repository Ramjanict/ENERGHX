import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteCourseMutation } from "@/store/LMS/course/courseApi";
import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type course = {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  programId: string;
};

type courseCardProps = {
  course: course;
  onEdit?: () => void;
};

const CourseCard: React.FC<courseCardProps> = ({ course, onEdit }) => {
  const [deleteCourse, { isLoading: isCourseDelete, originalArgs }] =
    useDeleteCourseMutation();

  const handleDelete = async () => {
    if (!course?.id) return;
    try {
      await deleteCourse(course.id).unwrap();
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const isDeleting = isCourseDelete && originalArgs === course.id;

  return (
    <CommonBorderWrapper>
      {course.thumbnail ? (
        <img
          className="w-full h-48 object-cover"
          src={course.thumbnail}
          alt={course.title}
        />
      ) : null}

      <div className="p-4 space-y-2">
        <h2 className="text-xl font-semibold capitalize text-gray-800">
          {course.title}
        </h2>
        <p className="text-sm text-gray-600">Rating: {course.averageRating}</p>
        <div className="flex items-center justify-between pt-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              course.isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {course.isCompleted ? "Completed" : "In Progress"}
          </span>
          <span className="text-xs text-gray-500">
            Created: {new Date(course.createdAt).toLocaleDateString()}
          </span>
        </div>

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

export default CourseCard;
