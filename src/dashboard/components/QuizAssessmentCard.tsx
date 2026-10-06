import { QuizSubmissionResponse } from "@/store/LMS/quiz/types/quizTypes";

type QuizAssessmentCardProps = {
  quizResult: QuizSubmissionResponse;
};

const QuizAssessmentCard: React.FC<QuizAssessmentCardProps> = ({
  quizResult,
}) => {
  return (
    <div className="">
      <h2 className="text-sm font-bold text-gray-800 mb-4">Quiz Result</h2>

      <ul className="space-y-2 text-sm text-gray-700">
        <li>
          <span className="font-medium">Score:</span> {quizResult?.score} /{" "}
          {quizResult?.total}
        </li>
        <li>
          <span className="font-medium">Correct Answers: </span>
          {quizResult?.quizSubmission?.correctAnswers}
        </li>
        <li>
          <span className="font-medium">Incorrect Answers: </span>
          {quizResult?.quizSubmission?.incorrectAnswers}
        </li>
        <li>
          <span className="font-medium">Status: </span>
          {quizResult?.quizSubmission?.isCompleted ? (
            <span className="text-green-600 font-semibold">Completed</span>
          ) : (
            <span className="text-red-600 font-semibold">Incomplete</span>
          )}
        </li>
        <li>
          <span className="font-medium">Submitted At: </span>
          {quizResult?.quizSubmission?.createdAt &&
            new Date(quizResult.quizSubmission.createdAt).toLocaleString()}
        </li>
      </ul>
    </div>
  );
};

export default QuizAssessmentCard;
