export type Module = {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  courseId: string;
};

export type BasicContent = {
  id: string;
  title: string;
  video: string | File;
  createdAt: string;
  updatedAt: string;
  courseId: string;
};

export type AllModule = {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  programId: string;
  modules?: Module[];
  basicContents?: BasicContent[];
};

export type GetModuleResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: AllModule;
};

export type ModuleCardType = Module | BasicContent;
