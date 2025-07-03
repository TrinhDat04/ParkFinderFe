import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


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
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('user_token');
    if (token) {
      this.router.navigate(['/homepage']); // redirect wherever makes sense
    }
  }

  registerErrors: { [key: string]: string } = {};

  togglePassword(): void{
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPassword(): void{
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

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
          console.log('User registered:', response);
          this.registerErrors = {}; // Clear errors on success

          Swal.fire({
            icon: 'success',
            title: 'Đăng ký thành công!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            // Navigate after SweetAlert closes
            this.router.navigate(['/auth/login']);
          });

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
