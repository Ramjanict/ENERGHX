import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllContentQuery } from "@/store/LMS/content/contentApi";
import { useGetAllModuleQuery } from "@/store/LMS/module/moduleApi";
import { useGetAllQuizQuery } from "@/store/LMS/quiz/quizApi";
import { SingleQuiz } from "@/store/LMS/quiz/types/quizTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import QuizCard from "../Common/QuizCard";
import AllCourse from "../components/AllCourse";
import QuizCreationModal from "../components/creationModal/CreateQuizCreationModal";

const quizSchema = z.object({
  contentId: z.string().uuid({ message: "Please select a content ID" }),
  quizzesData: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        options: z
          .array(z.string().min(1, "Option is required"))
          .length(4, "Exactly 4 options required"),
        correctAnswer: z
          .number()
          .min(0, "Select the correct answer")
          .max(3, "Answer must be between 1 and 4"),
      }),
    )
    .min(1, "At least one question is required"),
});

export type QuizSchemaType = z.infer<typeof quizSchema>;

export const defaultQuestion: QuizSchemaType["quizzesData"][0] = {
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
};

const Quiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizSchemaType | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [quizId, setQuizId] = useState("");
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const { data: moduleData } = useGetAllModuleQuery(selectedCourseId, {
    skip: !selectedCourseId,
    refetchOnMountOrArgChange: true,
  });
  const allModule = moduleData?.data;

  const { data: contentData } = useGetAllContentQuery(selectedModuleId, {
    skip: !selectedModuleId,
    refetchOnMountOrArgChange: true,
  });
  const allContent = contentData?.data;

  const form = useForm<QuizSchemaType>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      contentId: "",
      quizzesData: [defaultQuestion],
    },
  });

  const {
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const watchedContentId = watch("contentId");

  const { data: quizData } = useGetAllQuizQuery(watchedContentId, {
    skip: !watchedContentId,
    refetchOnMountOrArgChange: true,
  });
  const allQuiz = quizData?.data;

  useEffect(() => {
    if (selectedQuiz) {
      reset({
        contentId: selectedQuiz.contentId,
        quizzesData: selectedQuiz.quizzesData,
      });
      setIsQuizOpen(true);
    } else {
      reset({ contentId: "", quizzesData: [defaultQuestion] });
      setIsQuizOpen(false);
    }
  }, [selectedQuiz, reset]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedModuleId("");
    setValue("contentId", "");
  };

  const handleModuleChange = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setValue("contentId", "");
  };

  const handleQuiz = (qId: string, quiz: SingleQuiz) => {
    setSelectedQuiz({
      contentId: allQuiz?.contentId ?? "",
      quizzesData: [
        {
          question: quiz.question,
          options: quiz.options,
          correctAnswer: quiz.correctAnswer - 1,
        },
      ],
    });
    setQuizId(qId);
    setIsQuizOpen(true);
  };

  const handleClose = () => {
    setIsQuizOpen(false);
    setSelectedQuiz(null);
    setQuizId("");
    reset({ contentId: "", quizzesData: [defaultQuestion] });
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminCommonHeader className="!pb-0">Create Quiz</AdminCommonHeader>
      <div className="flex gap-4 items-center">
        <AllCourse
          handleCourseChange={handleCourseChange}
          selectedCourseId={selectedCourseId}
        />
        <div>
          <Select onValueChange={handleModuleChange} value={selectedModuleId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choose Module" />
            </SelectTrigger>
            <SelectContent>
              {allModule?.modules?.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Controller
            control={control}
            name="contentId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select content..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {allContent?.contents
                    ?.filter((c) => c.contentType === "QUIZ")
                    .map((content) => (
                      <SelectItem key={content.id} value={content.id}>
                        {content.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.contentId && (
            <p className="text-red-600 text-sm mt-1">
              {errors.contentId.message}
            </p>
          )}
        </div>
      </div>

      {!isQuizOpen && (
        <AdminCommonButton
          type="button"
          onClick={() => setIsQuizOpen(true)}
          className="!w-fit"
        >
          Create Quiz
        </AdminCommonButton>
      )}

      {(allQuiz?.quizzes?.length ?? 0) > 0 && (
        <QuizCard allQuiz={allQuiz} handleQuiz={handleQuiz} />
      )}

      {isQuizOpen && (
        <QuizCreationModal
          form={form}
          selectedQuiz={selectedQuiz}
          quizId={quizId}
          onClose={handleClose}
          onSuccess={handleClose}
        />
      )}
    </div>
  );
};

export default Quiz;
