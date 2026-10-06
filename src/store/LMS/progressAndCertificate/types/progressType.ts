export type CourseProgress = {
  watchedContents: string[];
  percentage: number;
};

export type CourseProgressResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: CourseProgress;
};

export interface AveragePercentageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: number;
}

export interface QuizResult {
  contentTitle: string;
  contentType: string;
  correctAnswers: number;
  incorrectAnswers: number;
  isCompleted: boolean;
  createdAt: string;
}

export interface UserQuizResultsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: QuizResult[];
}
