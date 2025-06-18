import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  login() {
    this.authService.login({email: this.email, password: this.password})
      .subscribe({
        next: response => {
          if (response.token) {
            this.message = 'Đăng nhập thành công!';
            localStorage.setItem("user_token", response.token);
            const tokenParts = response.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userId = payload.Id;
              console.log('Decoded userId:', userId);
              localStorage.setItem("user_id", userId);
            } else {
              console.warn('Invalid JWT token format');
            }
            console.log('Saved token successfully'); // Handle authentication token
          } else {
            this.message = response.message || 'Đăng nhập thất bại'; // Use API-provided message
          }
        },
        error: error => {
          this.message = error.error?.message || 'Đăng nhập thất bại! Vui lòng thử lại sau.';
          console.error('Error:', error);
        }
      });
  }

}
