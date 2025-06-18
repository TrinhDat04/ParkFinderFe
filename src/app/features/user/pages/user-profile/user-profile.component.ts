import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';
import {UpdateProfilePresenter} from '../../models/update-profile-presenter';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: User = {
    userId: '',
    fullName: '',
    phone: '',
    email: '',
    passwordHash: '',
    role: '',
    createdAt: new Date(),
  };

  // Thêm các biến mới
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    // Lấy dữ liệu user từ resolver (đã preload)
    this.route.data.subscribe((data) => {
      if (data['userData']) {
        this.user = data['userData'];
      }
    });
  }

  editProfile() {
    if (!this.user.fullName || this.user.fullName.trim() === '') {
      alert('Họ và tên không được để trống!');
      return;
    }

    if (!this.user.email || this.user.email.trim() === '') {
      alert('Email không được để trống!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      alert('Email không hợp lệ!');
      return;
    }

    if (this.user.phone && this.user.phone.length < 9) {
      alert('Số điện thoại phải có ít nhất 9 chữ số!');
      return;
    }
    if (!this.user.phone || this.user.phone.trim() === '') {
      alert('SĐT không được để trống!');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu và Nhập lại mật khẩu không khớp!');
      return;
    }

    const updatePresenter: UpdateProfilePresenter = {
      fullName: this.user.fullName,
      phone: this.user.phone,
      email: this.user.email,
      passwordHash: this.password ? this.password : undefined,
    };

    this.userService.editProfile(updatePresenter).subscribe({
      next: (res) => {
        console.log('Update response:', res);
        alert('Thông tin tài khoản đã được cập nhật!');
      },
      error: (err) => {
        console.error('Update error:', err);
        alert('Đã xảy ra lỗi khi cập nhật thông tin!');
      }
    });
  }

  logout() {
    localStorage.removeItem('user_token');
    alert('Bạn đã đăng xuất!');
    this.router.navigate(['/auth/login']);
  }
}
