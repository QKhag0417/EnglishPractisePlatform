export type UserRole = "learner" | "tutor" | "administrator";

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: "male" | "female";
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
}

export type UpdateProfilePayload = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
  phoneNumber?: string;
  avatarUrl?: string;
  email?: string;
};

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;

  login: (email: string, password: string) => Promise<User>;
  register: (
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export type LoginResponseDTO = {
  id: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role: UserRole;
  gender?: "male" | "female";
  phoneNumber?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
};

export type LoginRequestBody = {
  email: string;
  password: string;
};

export type RegisterRequestBody = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export type RegisterResponseDTO = {
  email: string;
  firstname: string;
  lastname: string;
};

export type RegisterResult = {
  email: string;
  firstname: string;
  lastname: string;
};

export type LogoutRequestBody = Record<string, never>;

export type LogoutResponseDTO = Record<string, never>;

export type LogoutResult = Record<string, never>;

export type HomeInfoDTO = {
  id?: string;
  email?: string;
  role?: string;
};

export type HomeInfo = HomeInfoDTO;

export const HOME_INFO_DTO_INCLUDE_FIELDS = ["id", "email", "role"] as const;

export const HOME_INFO_DTO_INCLUDE_FIELDS_QUERY =
  HOME_INFO_DTO_INCLUDE_FIELDS.join(",");

export type UserProfileParams = {
  userId: string;
};

export type UserProfileDTO = {
  userId?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
  avatarUrl?: string;
  gender?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
};

export type UserProfile = UserProfileDTO;

export const USER_PROFILE_DTO_INCLUDE_FIELDS = [
  "email",
  "firstname",
  "lastname",
  "role",
  "avatarUrl",
  "gender",
  "phoneNumber",
  "dateOfBirth",
] as const;

export const USER_PROFILE_DTO_INCLUDE_FIELDS_QUERY =
  USER_PROFILE_DTO_INCLUDE_FIELDS.join(",");
