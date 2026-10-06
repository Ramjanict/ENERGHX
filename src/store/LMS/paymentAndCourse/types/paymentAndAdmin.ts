export interface PaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PaymentRecord[];
}

export interface PaymentRecord {
  paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
  paymentIntentId: string | null;
  paymentMethod: string | null;
  invoiceUrl: string | null;
  status: "BASIC" | "STANDARD" | "CERTIFIED" | string;
  userId: string;
  programId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  program: Program;
}

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export interface Program {
  id: string;
  title: string;
}

// admin

export type UserForAdmin = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  otherName: string | null;
  sex: "MALE" | "FEMALE" | string;
  password: string;
  profile_photo: string;
  companyName: string;
  streetNumber: number;
  street: string;
  postalCode: number;
  city: string;
  countryId: string;
  stateId: string;
  isVerified: boolean;
  userType: "ADMIN" | "DEVELOPER" | "USER" | string;
  status: "ACTIVE" | "INACTIVE" | string;
  createdAt: string;
  updatedAt: string;
};

export type AdminAccessWithUser = {
  id: string;
  email: string;
  status: "ACTIVE" | "INACTIVE" | string;
  canAccess: "DEVELOPER" | "SERVER" | string;
  userId: string;
  user: UserForAdmin;
} | null;

export type AssignCoursesPayload = {
  adminId: string;
  courseIds: string[];
};
export type AdminCreatePayload = {
  admin: FormData;
  file?: File;
};
