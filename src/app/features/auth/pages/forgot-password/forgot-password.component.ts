import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  sendCode() {
    if (!this.isValidEmail(this.email)) {
      this.message = 'Email không hợp lệ. Vui lòng kiểm tra lại.';
      return;
    }

    this.authService.sendVerificationToken({email: this.email})
      .subscribe({
        next: response => {
          localStorage.setItem('resetEmail', this.email);
          this.router.navigate(['/auth/verify-code']);
        },
        error: error => {
          this.message = error.error?.message || 'Gửi email thất bại.';
          console.error(error);
        }
      });
  }

}
