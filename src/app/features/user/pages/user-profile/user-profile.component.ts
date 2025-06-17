import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user';

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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Lấy dữ liệu user từ resolver (đã preload)
    this.route.data.subscribe((data) => {
      if (data['userData']) {
        this.user = data['userData'];
      }
    });
  }

  editProfile() {
    // Thực tế bạn nên gọi API update profile tại đây
    console.log('User info:', this.user);
    alert('Thông tin tài khoản đã được cập nhật!');
  }

  logout() {
    localStorage.removeItem('user_token'); // theo key bạn lưu token
    alert('Bạn đã đăng xuất!');
    this.router.navigate(['/login']); // điều hướng về trang login hoặc trang chủ
  }
}
