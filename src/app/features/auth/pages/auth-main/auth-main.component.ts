import {AfterViewInit, Component} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-auth-main',
  templateUrl: './auth-main.component.html',
  styleUrl: './auth-main.component.scss'
})
export class AuthMainComponent implements AfterViewInit {
  message = '';

  constructor(private authService: AuthService) {
  }

  ngAfterViewInit() {
  }

  async loginWithGoogle() {
    const token = await this.authService.getFirebaseToken();
    if (token) {
      this.authService.loginWithGG({token})
        .subscribe({
          next: response => {
            this.message = "Đăng nhập thành công";
            localStorage.setItem("user_token", response.token);
            const tokenParts = response.token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              const userId = payload.Id;
              localStorage.setItem("user_id", userId);
            } else {
              console.warn('Invalid JWT token format');
            }
            console.log('Login successful');
          },
          error: error => {
            this.message = error.error?.message;
            console.error('Error: ', error)
          }
        });
    } else {
      console.log("Failed to receive token");
    }

  }
}
