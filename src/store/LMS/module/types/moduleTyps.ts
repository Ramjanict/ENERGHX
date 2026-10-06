export type BasicContent = {
  id: string;
  title: string;
  video: string;
  createdAt: string;
  updatedAt: string;
  courseId: string;
};

export type ModuleContent = {
  videoDuration: number | null;
};

export type Module = {
  id: string;
  title: string;
  thumbnail: string;
  videoDurationSum: number | null;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  contents: ModuleContent[];
};

export type SingleCourseData = {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  programId: string;
  totalDuration: number;
  basicContents: BasicContent[];
  modules: Module[];
};

export type AllModuleResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: SingleCourseData;
};
