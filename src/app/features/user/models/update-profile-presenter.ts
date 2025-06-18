export interface UpdateProfilePresenter {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash?: string; // Optional vì có thể không đổi password
}
