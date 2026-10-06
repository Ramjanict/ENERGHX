import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteQuizMutation } from "@/store/LMS/quiz/quizApi";
import { AllQuizData, SingleQuiz } from "@/store/LMS/quiz/types/quizTypes";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type QuizCardProps = {
  allQuiz: AllQuizData | undefined;
  handleQuiz: (quizId: string, quiz: SingleQuiz) => void;
};

const QuizCard: React.FC<QuizCardProps> = ({ allQuiz, handleQuiz }) => {
  const [deleteQuiz, { isLoading, originalArgs }] = useDeleteQuizMutation();

  const handleDelete = async (quizId: string) => {
    if (!quizId) return;
    try {
      await deleteQuiz(quizId).unwrap();
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allQuiz?.quizzes?.map((quiz, index) => {
        const isDeleting = isLoading && originalArgs === quiz.id;
        return (
          <CommonBorderWrapper key={quiz.id}>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Quiz {index + 1}
            </h2>
            <p className="text-sm text-gray-700 font-medium">{quiz.question}</p>

            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mt-2">
              {quiz.options.map((option, i) => (
                <li
                  key={i}
                  className={
                    i + 1 === quiz.correctAnswer
                      ? "font-semibold text-green-600"
                      : ""
                  }
                >
                  {option}
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-400 mt-2">
              Created: {new Date(quiz.createdAt).toLocaleString()}
            </p>

            <div className="flex justify-end items-center gap-2 pt-4">
              <EditButton
                type="button"
                onClick={() => handleQuiz(quiz.id, quiz)}
              >
                Edit
              </EditButton>
              <DeleteButton
                disabled={isDeleting}
                type="button"
                onClick={() => handleDelete(quiz.id)}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </DeleteButton>
            </div>
          </CommonBorderWrapper>
        );
      })}
    </div>
  );
};

export default QuizCard;
