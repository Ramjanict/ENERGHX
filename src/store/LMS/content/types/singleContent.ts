export type PublishedFor = "SERVER" | "DEVELOPER";

export type ContentType = "VIDEO" | "DESCRIPTION" | "QUIZ";

export interface Program {
  publishedFor: PublishedFor;
}

export interface Course {
  program: Program;
}

export interface Module {
  course: Course;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  createdAt: string;
  updatedAt: string;
  quizInstanceId: string;
}

export interface QuizInstance {
  id: string;
  totalMark: number;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  contentId: string;
  quizzes: QuizQuestion[];
}

interface BaseContent {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  moduleId: string;
  module: Module;
}

export interface DescriptionContent extends BaseContent {
  contentType: "DESCRIPTION";
  video: null;
  videoPublicId: null;
  description: string;
  videoDuration: null;
  quiz: null;
}

export interface VideoContent extends BaseContent {
  contentType: "VIDEO";
  video: string;
  videoPublicId: string;
  description: null;
  videoDuration: number;
  quiz: null;
}

export interface QuizContent extends BaseContent {
  contentType: "QUIZ";
  video: null;
  videoPublicId: null;
  description: null;
  videoDuration: null;
  quiz: QuizInstance;
}

export type Content = DescriptionContent | VideoContent | QuizContent;

export interface SingleContentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Content;
}
