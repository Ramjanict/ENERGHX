export type Course = {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  programId: string;
  totalDuration: number;
};

export type AllCoursesResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: Course[];
};

// instructor course
interface Program {
  id: string;
  title: string;
}

interface AssignmentInfo {
  id: string;
}

export interface InstructorCourse {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  programId: string;
  program: Program;
  totalDuration: number;
  assignmentInfo: AssignmentInfo;
}

export interface InstructorCoursesResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: InstructorCourse[];
}
