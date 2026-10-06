import { InstructorCourse } from "@/store/LMS/course/types/courseTypes";
import React from "react";

interface CourseCardProps {
  course: InstructorCourse;
}

const AssociatedCourse: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="max-w-sm bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Program: {course.program.title}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Created At: {new Date(course.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Status:
          <span
            className={`font-semibold ${
              course.isCompleted ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {course.isCompleted ? "Completed" : "In Progress"}
          </span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Average Rating: {course.averageRating}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Total Duration: {course.totalDuration} hours
        </p>
      </div>
    </div>
  );
};

export default AssociatedCourse;
