export type Role = "USER" | "MANAGER" | "ADMIN";

export interface IUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: Role;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  username: string;
  phoneNumber?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}