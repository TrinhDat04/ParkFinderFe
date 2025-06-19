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

  errors: string[] = [];
  successMessage: string = '';
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  openModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
    // Thêm class 'modal-open' cho body để tránh scroll nền khi modal mở
    document.body.classList.add('modal-open');
  }

  // Hàm đóng modal
  closeModal() {
    this.modalVisible = false;
    document.body.classList.remove('modal-open');
  }
  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      if (data['userData']) {
        this.user = data['userData'];
      } else {
        alert('Bạn chưa đăng nhập, vui lòng đăng nhập lại!');
        this.router.navigate(['/auth']);
      }
    });
  }

  editProfile() {
    this.errors = [];
    this.successMessage = '';

    if (!this.user.fullName || this.user.fullName.trim() === '') {
      this.errors.push('Họ và tên không được để trống!');
    }

    if (!this.user.email || this.user.email.trim() === '') {
      this.errors.push('Email không được để trống!');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.errors.push('Email không hợp lệ!');
      }
    }

    if (!this.user.phone || this.user.phone.trim() === '') {
      this.errors.push('SĐT không được để trống!');
    } else if (this.user.phone.length < 9) {
      this.errors.push('Số điện thoại phải có ít nhất 9 chữ số!');
    }

    if (this.password !== this.confirmPassword) {
      this.errors.push('Mật khẩu và Nhập lại mật khẩu không khớp!');
    }

    if (this.errors.length > 0) {
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
        this.successMessage = 'Thông tin tài khoản đã được cập nhật!';
      },
      error: (err) => {
        this.errors.push('Đã xảy ra lỗi khi cập nhật thông tin!');
      }
    });
  }



  logout() {
    localStorage.removeItem('user_token');
    this.openModal('Đăng xuất', 'Bạn đã đăng xuất!');
    setTimeout(() => {
      this.closeModal();
      this.router.navigate(['/homepage']);
    }, 1500);
  }
}
