export type QuizData = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export type QuizPayload = {
  contentId: string;
  quizzesData: QuizData[];
};

export type AnswerItem = {
  quizId: string;
  answer: number;
};

export type AnswerSubmission = {
  contentId: string;
  answerSheet: AnswerItem[];
};

// AllQuizResponse

export type SingleQuiz = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
  updatedAt: string;
  quizInstanceId: string;
};

export type AllQuizData = {
  id: string;
  totalMark: number;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  contentId: string;
  quizzes: SingleQuiz[];
};

export type AllQuizResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: AllQuizData;
};

//mark
export type QuizSubmission = {
  id: string;
  correctAnswers: number;
  incorrectAnswers: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  quizInstanceId: string;
  userId: string;
};

export type QuizSubmissionResponse = {
  quizSubmission: QuizSubmission;
  score: number;
  total: number;
} | null;
