type PublishedFor = "DEVELOPER" | "SERVER";

// All Programs
export type Program = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  publishedFor: PublishedFor;
  createdAt: string;
  updatedAt: string;
};

export type AllProgramsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Program[];
};

// My Programs
export interface MyProgramsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: MyProgram[];
}

export interface MyProgram {
  status: "BASIC" | "STANDARD" | "CERTIFIED" | string;
  program: ProgramForUser;
}

export interface ProgramForUser {
  id: string;
  thumbnail: string;
  description: string;
  title: string;
  price: number;
  publishedFor: PublishedFor;
  createdAt: string;
  updatedAt: string;
  _count: {
    courses: number;
  };
}

// Single Program
export type SingleProgramApiResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: SingleProgramData;
};

export type SingleProgramData = {
  id: string;
  thumbnail: string;
  description: string;
  title: string;
  price: number;
  publishedFor: string;
  createdAt: string;
  updatedAt: string;
  courses: AllCourse[];
};

export type AllCourse = {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  programId: string;
  _count: { modules: number; reviews: number };
  level: "BASIC" | "STANDARD" | "CERTIFIED" | string;
};
