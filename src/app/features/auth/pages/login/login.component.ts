import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.authService.login({email: this.email, password: this.password})
      .subscribe({
        next: response => {
          if (response.token) {
            localStorage.setItem("user_token", response.token);
            const tokenParts = response.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userId = payload.Id;
              localStorage.setItem("user_id", userId);
            } else {
              console.warn('Invalid JWT token format');
            }
            console.log('Saved token successfully'); // Handle authentication token

            // Trigger SweetAlert
            Swal.fire({
              icon: 'success',
              title: 'Đăng nhập thành công!',
              text: 'Chào mừng bạn quay trở lại!',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/homepage'])
            });
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
