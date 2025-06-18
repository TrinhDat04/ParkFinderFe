export interface UpdateProfilePresenter {
  fullName: string;
  phone?: string;
  email: string;
  password?: string; // Optional vì có thể không đổi password
  role?: string;
}
