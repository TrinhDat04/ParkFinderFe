import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {
  user: User = {
    userId: '',
    fullName: '',
    phone: '',
    email: '',
    passwordHash: '',
    role: '',
    createdAt: new Date(),
  };
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';

  showUsername = false;
  showPhone = false;
  constructor(private route: ActivatedRoute, private router: Router) {}

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

  goToProfile(){
    this.router.navigate(['/user/profile']);
  }
  onRegisterParking() {
    alert('Chức năng đăng ký bãi đỗ đang được phát triển.');
  }
  logout() {
    localStorage.removeItem('user_token');
    this.openModal('Đăng xuất', 'Bạn đã đăng xuất!');
    setTimeout(() => {
      this.closeModal();
      this.router.navigate(['/homepage']);
    }, 1500);
  }
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
  toggleShow(type: 'username' | 'phone') {
    if (type === 'username') {
      this.showUsername = !this.showUsername;
      // Nếu mở username thì đóng phone để tránh mở cả 2 cùng lúc
      if (this.showUsername) this.showPhone = false;
    }
    if (type === 'phone') {
      this.showPhone = !this.showPhone;
      if (this.showPhone) this.showUsername = false;
    }
  }
}
