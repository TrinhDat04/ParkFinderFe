import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  email = '';
  password = '';
  confirmPassword = '';
  fullName = '';
  phoneNumber: string | null = null;
  message = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  registerErrors: { [key: string]: string } = {};

  register() {
    this.registerErrors = {}; // Reset errors before submission

    if (this.password !== this.confirmPassword) {
      this.message = 'Mật khẩu không khớp!';
      return;
    }

    if (this.phoneNumber == null || this.phoneNumber.length == 0){
      this.phoneNumber = null
    }

    this.authService.register({
      email: this.email,
      password: this.password,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      role: ""
    })
      .subscribe({
        next: response => {
          this.message = response.message || 'Đăng kí thành công!';
          console.log('User registered:', response);
          this.registerErrors = {}; // Clear errors on success
        },
        error: error => {
          this.message = error.error?.message;
          this.registerErrors = {}; // Reset previous errors

          if (error.error && Array.isArray(error.error)) {
            error.error.forEach((err: { memberNames: string[]; errorMessage: string }) => {
              if (err.memberNames.length > 0) {
                this.registerErrors[err.memberNames[0]] = err.errorMessage;
              }
            });
          }
          console.error('Error:', error);
        }
      });
  }

}
