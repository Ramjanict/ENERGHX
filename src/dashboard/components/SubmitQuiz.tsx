import { QuizQuestion } from "@/store/LMS/content/types/singleContent";
import { useSubmitQuizMutation } from "@/store/LMS/quiz/quizApi";
import { AnswerSubmission } from "@/store/LMS/quiz/types/quizTypes";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface SubmitQuizProps {
  quizzes: QuizQuestion[];
  contentId: string;
}

type QuizFormValues = {
  [quizId: string]: string;
};

const SubmitQuiz: React.FC<SubmitQuizProps> = ({ quizzes, contentId }) => {
  const [submitQuiz, { isLoading: isQuizSubmitting }] = useSubmitQuizMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormValues>();

  const onSubmit: SubmitHandler<QuizFormValues> = async (data) => {
    const answerSheet = Object.entries(data).map(([quizId, answer]) => ({
      quizId,
      answer: Number(answer) + 1,
    }));

    const result: AnswerSubmission = {
      contentId,
      answerSheet,
    };

    try {
      await submitQuiz(result).unwrap();
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="p-4 border rounded-md">
            <p className="font-semibold mb-2">{quiz.question}</p>
            <div className="space-y-2">
              {quiz.options.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value={index}
                    {...register(quiz.id, {
                      required: "Please select an answer",
                    })}
                    className="accent-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {errors[quiz.id] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[quiz.id]?.message as string}
              </p>
            )}
          </div>
        ))}

        <button
          disabled={isQuizSubmitting}
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer disabled:bg-blue-500 disabled:cursor-not-allowed"
        >
          {isQuizSubmitting ? "Processing..." : " Submit Quiz"}
        </button>
      </form>
    </div>
  );
};

export default SubmitQuiz;
