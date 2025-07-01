export interface User {
  userId: string;
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: string;
  createdAt?: Date;
}
