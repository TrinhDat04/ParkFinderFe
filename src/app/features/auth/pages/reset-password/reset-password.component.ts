import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
  password = "";
  password2 = "";
  message = "";

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  changePassword() {
    if (this.password !== this.password2) {
      this.message = 'Mật khẩu không khớp!';
      return;
    }

    this.authService.changePassword({email: localStorage.getItem("resetEmail"), newPassword: this.password})
      .subscribe({
        next: response => {
          localStorage.removeItem("resetEmail");
          Swal.fire({
            icon: 'success',
            title: 'Đặt lại mật khẩu thành công!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/auth/login'])
          });
        },
        error: error => {
          this.message = error.error?.message;
          console.log(error);
        }
      })
  }

}
