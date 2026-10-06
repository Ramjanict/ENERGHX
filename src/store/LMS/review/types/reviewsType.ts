import { LoginData } from "@/store/auth/types/loginUser";

export type ReviewPayload = {
  rating: number;
  comment: string;
  courseId: string;
};

export type AllReview = {
  id: string;
  comment: string;
  rating: number;
  userId: string;
  courseId: string;
};

export type AllReviewsResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: AllReview[];
};
// SingleReview   SingleReview

export interface SingleReview {
  id: string;
  comment: string;
  rating: number;
  userId: string;
  courseId: string;
  user: LoginData;
}

export type SingleReviewResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: SingleReview[];
};
//  user review my review
export interface MyReviewsResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: MyReview[];
}

export interface MyReview {
  id: string;
  comment: string;
  rating: number;
  userId: string;
  courseId: string;
  course: ReviewCourse;
}

export interface ReviewCourse {
  id: string;
  title: string;
  thumbnail: string;
  averageRating: number;
  isCompleted: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  programId: string;
}
