export type ContentItem = {
  id: string;
  title: string;
  contentType: "DESCRIPTION" | "VIDEO" | "QUIZ";
  video: string | null;
  description: string | null;
  videoDuration: number | null;
  courseId: string;
  moduleId: string;
};

export type AllContent = {
  id: string;
  title: string;
  thumbnail: string;
  videoDurationSum: number | null;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  totalDuration: number;
  contents: ContentItem[];
};

export type AllContentResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: AllContent;
};
