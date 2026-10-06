import MiniSpinner from "@/common/loading/MiniSpinner";
import { useGetAllCourseQuery } from "@/store/LMS/course/courseApi";
import React, { useState } from "react";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import CourseCard from "../Common/CourseCard";
import CourseCreationModal, {
  CourseFormData,
} from "../components/creationModal/CourseCreationModal";

const Course: React.FC = () => {
  const { data, isLoading } = useGetAllCourseQuery();
  const allCourse = data?.data ?? [];

  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<
    (CourseFormData & { id?: string }) | null
  >(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  const handleClose = () => {
    setIsCourseOpen(false);
    setSelectedCourse(null);
    setCourseId(null);
  };

  return (
    <div>
      <AdminCommonHeader>All Courses</AdminCommonHeader>
      <AdminCommonButton
        onClick={() => {
          setIsCourseOpen(true);
          setSelectedCourse(null);
          setCourseId(null);
        }}
        className={`!w-fit ${allCourse.length > 0 ? "mb-10" : ""}`}
      >
        Create Course
      </AdminCommonButton>

      {isLoading ? (
        <MiniSpinner />
      ) : allCourse.length === 0 ? (
        <p className="text-gray-500">No courses available.</p>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
            allCourse.length > 0 ? "pb-8" : ""
          }`}
        >
          {allCourse.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => {
                setSelectedCourse(course);
                setCourseId(course.id);
                setIsCourseOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {isCourseOpen && (
        <CourseCreationModal
          selectedCourse={selectedCourse}
          courseId={courseId}
          onClose={handleClose}
          onSuccess={handleClose}
        />
      )}
    </div>
  );
};

export default Course;
