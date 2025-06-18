export interface UpdateProfilePresenter {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash?: string; // Optional
}
