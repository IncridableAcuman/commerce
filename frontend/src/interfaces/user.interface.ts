export type Role = "USER" | "ADMIN"

export interface IUser {
    id: number;
    fullName: string;
    username: string;
    email: string;
    role: Role;
    avatar: string;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
}