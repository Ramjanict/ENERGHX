import CommonHeader from "@/common/header/CommonHeader";
import CourseCard from "@/common/LMS/CourseCard";
import { useState } from "react";
import ModuleInterface from "./ModuleInterface";

import { useGetAllModuleRegularQuery } from "@/store/LMS/module/moduleApi";
import { BasicContent } from "@/store/LMS/module/types/regularModule";
import {
  useGetMyProgramQuery,
  useGetSingleProgramQuery,
} from "@/store/LMS/program/programApi";
import {
  useLazyGetProgressQuery,
  useSetProgressMutation,
} from "@/store/LMS/progressAndCertificate/progressAndCertificateApi";
import { Controller, useForm } from "react-hook-form";
import CommonSelect from "../button/CommonSelect";
import MiniSpinner from "../loading/MiniSpinner";
import ModuleDisplay from "./ModuleDisplay";
const AllCourses = () => {
  const [selectBasicContent, setSelectBasicContent] =
    useState<BasicContent | null>(null);

  const [selectModulesId, setSelectModulesId] = useState<string | null>(null);
  const [selectCourseId, setSelectCourseId] = useState("");
  const { data } = useGetMyProgramQuery();

  const myProgram = data?.data ?? [];
  const programOptions = myProgram.map((item) => ({
    label: item.program.id,
    value: item.program.title,
  }));

  const { data: moduleData } = useGetAllModuleRegularQuery(selectCourseId, {
    skip: !selectCourseId,
    refetchOnMountOrArgChange: true,
  });

  const allModule = moduleData?.data;

  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      programId: "",
    },
  });

  const programId = watch("programId");
  const { data: singleProgram, isLoading } = useGetSingleProgramQuery(
    programId,
    {
      skip: !programId,
      refetchOnMountOrArgChange: true,
    },
  );
  const courses = singleProgram?.data?.courses ?? [];

  const [setProgress, { isLoading: isHandleProgress }] =
    useSetProgressMutation();
  const [getProgress, { data: progress }] = useLazyGetProgressQuery();

  const courseProgress = progress?.data;
  const handleProgress = async (courseId: string, singleContentId: string) => {
    try {
      setSelectModulesId(singleContentId);
      await setProgress({ courseId, singleContentId });
      await getProgress(courseId);
    } catch (error) {
      console.error("Error handling progress:", error);
    } finally {
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-6 pb-6">
        <CommonHeader className="!pb-0">Choose program</CommonHeader>
        <Controller
          control={control}
          name="programId"
          render={({ field }) => (
            <CommonSelect
              value={field.value}
              onValueChange={field.onChange}
              item={programOptions}
              placeholder="Select Program"
            />
          )}
        />
      </div>

      {(!!allModule?.basicContents?.length || !!allModule?.modules?.length) && (
        <div className="flex justify-between gap-6 mb-10 w-full">
          <ModuleDisplay
            selectBasicContent={selectBasicContent}
            selectModulesId={selectModulesId}
            isHandleProgress={isHandleProgress}
            allModule={allModule}
            courseProgress={courseProgress!!}
          />
          <ModuleInterface
            handleProgress={handleProgress}
            setSelectBasicContent={setSelectBasicContent}
            allModule={allModule}
            courseProgress={courseProgress!!}
          />
        </div>
      )}

      {!programId ? (
        <p className="text-gray-500">
          Please select a program to view courses.
        </p>
      ) : isLoading ? (
        <MiniSpinner />
      ) : myProgram?.length === 0 ? (
        <p>No programs available.</p>
      ) : courses?.length > 0 ? (
        <div className="flex flex-col gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              courseProgress={courseProgress!!}
              onWatch={() => {
                setSelectCourseId(course.id);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No courses found for this program.</p>
      )}
    </div>
  );
};

export default AllCourses;
