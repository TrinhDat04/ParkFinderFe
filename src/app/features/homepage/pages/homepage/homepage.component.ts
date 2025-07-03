import {Component, , Inject, OnInit, PLATFORM_ID, } from '@angular/core';
import { Router} from '@angular/router';
import {UserService} from '../../../user/services/user.service';
import {User} from '../../../user/models/user';
import {isPlatformBrowser} from '@angular/common';
import {HomepageService} from '../../services/homepage.service';
import {ParkingLotWithRating} from '../../models/ParkingLotWithRating';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  user: User | null = null;
  public isNavigating: boolean = false;
  navigationData: any = null;  constructor(
              private router: Router,
              private userService: UserService,
              private homepageService : HomepageService,
              @Inject(PLATFORM_ID) private platformId: Object

  ){}
  isLoading = true;
  topRatedLots: ParkingLotWithRating[] = [];
  ngOnInit(): void {
    let userId: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      userId = localStorage.getItem("user_id");
    }

    if (userId) {
      this.userService.getUserProfile(userId).subscribe({
        next: (user: User) => {
          this.user = user;
          this.isLoading = false;
        },
        error: () => {
          this.showError('Lỗi khi lấy thông tin user');
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
    this.homepageService.navigationInfo$.subscribe((val) => {
      this.isNavigating = val.isNavigating;
      this.navigationData = val;
    });
    this.homepageService.getTop5RatedParkingLots().subscribe({
      next: (lots) => {
        this.topRatedLots = lots;
      },
      error: () => {
        this.showError('Lỗi khi lấy thông tin bãi đỗ');
      }
    });
  }

  openNews(event: Event){
    event.preventDefault();
    this.router.navigate(['/homepage/news']);
  }
  goToLogin(){
    this.router.navigate(['/auth/login']);
  }
  goToMap(){
    this.router.navigate(['/map-google']);
  }
  goToSettings(){
    this.router.navigate(['/user/setting']);
  }
  goToNews(){
    this.router.navigate(['/homepage/news']);
  }
  showPopup = false;
  popupMessage = '';

  showError(message: string) {
    this.popupMessage = message;
    this.showPopup = true;

    // Tự động ẩn sau 3 giây
    setTimeout(() => this.showPopup = false, 3000);
  }

  closePopup() {
    this.showPopup = false;
  }
}
