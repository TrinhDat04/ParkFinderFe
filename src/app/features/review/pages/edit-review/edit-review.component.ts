import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ReviewService} from '../../../../core/services/review/review.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EditReviewRequest} from '../../../../core/models/review/edit-review-request';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-review',
  templateUrl: 'edit-review.component.html',
  styleUrls: ['edit-review.component.css']
})

export class EditReviewComponent implements OnInit {
  constructor(private reviewService: ReviewService, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const queryParam = this.route.snapshot.queryParamMap;
    this.id = queryParam.get('id');
    this.reviewService.getReviewById(this.id).subscribe({
      next: response => {
        this.setRating(response.rating - 1);

        response.comment.likedFeatures.forEach((feature: string) => {
          if (feature in this.likedFeatureMap) {
            this.likedFeatureMap[feature] = true;
          }
        });
        response.comment.featuresToBeImproved.forEach((feature: string) => {
          if (feature in this.featuresToBeImprovedMap) {
            this.featuresToBeImprovedMap[feature] = true;
          }
        });

        this.additionalComment = response.comment.additionalComments;
      },
      error: error => {
        if (error.status === 401) {
          // 🔐 Not authorized – redirect to login
          window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          this.router.navigate(['/auth/login']); // adjust route as needed
        } else if (error.status === 403) {
          // 🔐 Not authorized – redirect to login
          this.router.navigate(['/homepage']);
        } else {
          window.alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          this.router.navigate(['/homepage']);
        }
      }
    })
  }

  protected readonly window = window;

  stars = Array(5).fill(0); // You can change the number of stars here
  rating = 0;
  additionalComment = '';
  id: string | null = '';

  likedFeatureMap: Record<string, boolean> = {
    'Hữu ích': false,
    'Tiện lợi': false,
    'Đẹp': false,
  };

  featuresToBeImprovedMap: Record<string, boolean> = {
    'Có thể có nhiều tính năng hơn': false,
    'Phức tạp': false,
    'Thiếu tương tác': false,
  };

  submitReview(form: NgForm): void {
    const likedFeatures = Object.entries(this.likedFeatureMap)
      .filter(([_, selected]) => selected)
      .map(([feature]) => feature);

    const featuresToBeImproved = Object.entries(this.featuresToBeImprovedMap)
      .filter(([_, selected]) => selected)
      .map(([feature]) => feature);

    const request: EditReviewRequest = {
      rating: this.rating,
      comment: {
        likedFeatures: likedFeatures || [],
        featuresToBeImproved: featuresToBeImproved || [],
        additionalComments: this.additionalComment || ''
      }
    }

    this.reviewService.updateReview(request, this.id).subscribe({
      next: response => {
        Swal.fire({
          icon: 'success',
          title: 'Đánh giá thành công!',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/reviews'], {
            queryParams: {parkingLotId: response.parkingLotId}
          });
        })
      },
      error: error => {
        if (error.status === 401) {
          window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          this.router.navigate(['/auth/login']);
        } else if (error.status === 400) {
          window.alert("Vui lòng nhập đầy đủ thông tin.");
        } else if (error.status === 403) {
          this.router.navigate(['/homepage']);
        } else {
          window.alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
        }
      }
    })
  }

  setRating(index: number): void {
    this.rating = index + 1;
    console.log(`User rating: ${this.rating}`);
  }

  onFeatureToggle(group: 'liked' | 'improve', feature: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    if (group === 'liked') {
      this.likedFeatureMap[feature] = target.checked;
    } else {
      this.featuresToBeImprovedMap[feature] = target.checked;
    }
  }

  protected readonly Object = Object;
}
