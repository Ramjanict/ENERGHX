export type UserTypeName = "CONSUMER" | "SERVER" | "DEVELOPER" | "SUPER_ADMIN";

export type UserLevel = "BASIC" | "STANDARD" | "CERTIFIED";
export type UserStatus = "ACTIVE" | "BLOCKED";
export type UserSex = "MALE" | "FEMALE";
export type UserRole = "INSTRUCTOR" | "MANAGER" | "WRITER";

export interface UserType {
  id: string;
  name: UserTypeName;
}

export interface Country {
  country_id: string;
  name: string;
}

export interface State {
  state_id: string;
  name: string;
}

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  othername: string | null;
  email: string;
  phoneNumber: string | null;
  alternatePhoneNumber: string | null;
  sex: UserSex;
  isVerified: boolean;
  isAccreditedByAdmin: boolean;
  profile_photo: string | null;
  status: UserStatus;
  level: UserLevel;
  user_type_id: string | null;
  user_type: UserType;
  user_role: UserRole[];
  country: Country;
  state: State;
  adminId: string | null;
}

export interface SingleUser {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}
export interface AllUsersResponse {
  status: number;
  message: string;
  data: SingleUser;
}

export interface UserParams {
  page?: number;
  limit?: number;
  user_type_id?: string;
  user_type_name?: UserTypeName;
  user_role?: UserRole;
  isAccreditedByAdmin?: boolean;
  isVerified?: boolean;
  status?: UserStatus;
  level?: UserLevel;
  sex?: UserSex;
  searchFilter?: string;
}

export type AccreditationPayload = {
  emails: string[];
  accredit: "true" | "false";
};

export interface CountryCurrency {
  name: string;
  code: string;
}
export interface StateList {
  names: string[];
}

export interface ConsumerServerAssignment {
  consumerId: string;
  serverId: string;
}

export interface ConsumerDeveloperAssignment {
  consumerId: string;
  developerId: string;
}

export interface UserTypeAndRole {
  userId: string;
  userType: UserTypeName;
  userRole: UserRole;
}

// assignments

export interface AssignmentUser {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string | null;
}

// Server and Developer share the same shape
export interface AssignmentMember {
  id?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  phonenumber?: string | null;
}

export interface UserServerAssignment {
  user: AssignmentUser;
  server: AssignmentMember;
}

export interface UserDeveloperAssignment {
  user: AssignmentUser;
  developer: AssignmentMember;
}

// Response wrappers
export interface UserServerAssignmentResponse {
  status: number;
  message: string;
  data: UserServerAssignment[];
}

export interface UserDeveloperAssignmentResponse {
  status: number;
  message: string;
  data: UserDeveloperAssignment[];
}
