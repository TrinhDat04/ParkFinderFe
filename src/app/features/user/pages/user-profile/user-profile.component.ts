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
    // Kiểm tra password và confirm password
    if (this.password !== this.confirmPassword) {
      alert('Mật khẩu và Nhập lại mật khẩu không khớp!');
      return;
    }

    // Chuẩn bị dữ liệu gửi lên API
    const updatePresenter: UpdateProfilePresenter = {
      fullName: this.user.fullName,
      phone: this.user.phone,
      email: this.user.email,
      password: this.password ? this.password : undefined, // chỉ gửi nếu người dùng nhập password mới
      role: this.user.role
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
    localStorage.removeItem('user_token'); // theo key bạn lưu token
    alert('Bạn đã đăng xuất!');
    this.router.navigate(['/login']); // điều hướng về trang login hoặc trang chủ
  }
}
