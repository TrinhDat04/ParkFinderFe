import {Component, OnInit} from '@angular/core';
import {ReviewService} from '../../../../core/services/review/review.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReviewPresenter} from '../../../../core/models/review/review-presenter';
import Swal from 'sweetalert2';

declare var bootstrap: any;


@Component({
  selector: 'app-list-review',
  templateUrl: './list-review.component.html',
  styleUrls: ['./list-review.component.css']
})
export class ListReviewComponent implements OnInit {
  constructor(private reviewService: ReviewService, private route: ActivatedRoute,
              private router: Router) {
  }

  pageSize = 4;
  totalPages = 0;
  currentPage = 1;
  parkingLotId: string | null = '';
  review: ReviewPresenter | null = null;
  selectedReviewId: string | null = null;


  protected readonly window = window;

  ngOnInit() {
    console.log(bootstrap);
    const queryParam = this.route.snapshot.queryParamMap;
    this.parkingLotId = queryParam.get('parkingLotId');
    this.currentPage = Number(queryParam.get('page')) || 1;

    this.loadPagination(this.parkingLotId);

    this.reviewService.getReviewsByParkingLotId(this.parkingLotId, this.currentPage, this.pageSize).subscribe({
      next: review => {
        this.review = review;
      },
      error: error => {
        if (error.status === 401) {
          window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          this.router.navigate(['/auth/login']); // adjust route as needed
        } else if (error.status === 400) {
          window.alert("Vui lòng nhập đầy đủ thông tin.");
        } else if (error.status === 404) {
          this.router.navigate(['/homepage']);
        } else {
          window.alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          this.router.navigate(['/homepage']);
        }
      }
    });
  }

  private loadPagination(parkingLotId: string | null) {
    this.reviewService.getReviewsByParkingLotId(parkingLotId, 1, 0).subscribe({
      next: (res) => {
        const total = res.totalReviews;
        this.totalPages = this.pageSize > 0 ? Math.ceil(total / this.pageSize) : 1;
      }
    });
  }

  changePage(page: number | string): void {
    if (typeof page !== 'number') return; // Ignore if it's '...'

    if (page < 1 || page > this.totalPages || page === this.currentPage) return;

    this.currentPage = page;

    this.reviewService.getReviewsByParkingLotId(this.parkingLotId, this.currentPage, this.pageSize)
      .subscribe(res => {
        this.review = res;
      });

  }

  get paginationPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 5) {
      // Show all pages when total is small
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1); // Always show first page

    if (current > 3) pages.push('...');

    for (let i = current - 1; i <= current + 1; i++) {
      if (i > 1 && i < total) pages.push(i);
    }

    if (current < total - 2) pages.push('...');

    if (total > 1) pages.push(total); // Always show last page

    return pages;
  }

  confirmDelete() {
    this.reviewService.deleteReview(this.selectedReviewId).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Xóa đánh giá thành công!',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        })
      },
      error: error => {
        if (error.status === 401) {
          window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          this.router.navigate(['/auth/login']);
        } else if (error.status === 403) {
        } else {
          window.alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
          console.error('Error:', error);
        }
      }
    })
  }

  openDeleteModal(id: string): void {
    this.selectedReviewId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    modal.show();
  }

}
