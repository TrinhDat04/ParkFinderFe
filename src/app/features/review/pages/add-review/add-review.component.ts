import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AddReviewRequest} from '../../../../core/models/review/add-review-request';
import {ReviewService} from "../../../../core/services/review/review.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
    selector: 'app-add-review',
    templateUrl: 'add-review.component.html',
    styleUrls: ['add-review.component.css']
})

export class AddReviewComponent implements OnInit {
    ngOnInit() {
        this.route.queryParamMap.subscribe(params => {
            this.parkingLotId = params.get('parkingLotId') || '';
        });
    }

    parkingLotId: string = '';

    constructor(private reviewService: ReviewService, private router: Router,
                private route: ActivatedRoute) {
    }

    likedFeatureMap: Record<string, boolean> = {
        'Hữu ích': false,
        'Thuận tiện': false,
        'Đẹp': false,
    };

    featuresToBeImprovedMap: Record<string, boolean> = {
        'Có thể có nhiều tính năng hơn': false,
        'Phức tạp': false,
        'Thiếu tương tác': false,
    };

    getLikedFeatures(): string[] {
        return Object.entries(this.likedFeatureMap)
            .filter(([_, checked]) => checked)
            .map(([feature]) => feature);
    }

    getFeaturesToBeImproved(): string[] {
        return Object.entries(this.featuresToBeImprovedMap)
            .filter(([_, checked]) => checked)
            .map(([feature]) => feature);
    }


    stars = Array(5).fill(0); // You can change the number of stars here
    rating = 0;

    setRating(index: number): void {
        this.rating = index + 1;
        console.log(`User rating: ${this.rating}`);
    }

    submitReview(form: NgForm): void {
        if (this.rating === 0){
            window.alert('Vui lòng đánh giá từ 1 sao đến 5 sao');
            return;
        }

        const formValue = form.value;

        const finalReview: AddReviewRequest = {
            parkingLotId: this.parkingLotId,
            rating: this.rating, // you keep tracking this manually
            reviewComment: {
                likedFeatures: this.getLikedFeatures() || [],
                featuresToBeImproved: this.getFeaturesToBeImproved() || [],
                additionalComments: formValue.reviewComment.additionalComments || ''
            }
        };

        this.reviewService.addReview(finalReview).subscribe({
            next: response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Đánh giá thành công!',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    this.router.navigate(['/reviews'], {
                        queryParams: {parkingLotId: this.parkingLotId}
                    });
                })
            },
            error: error => {
                if (error.status === 401) {
                    // 🔐 Not authorized – redirect to login
                    window.alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                    this.router.navigate(['/auth/login']); // adjust route as needed
                } else if (error.status === 400) {
                    window.alert("Vui lòng nhập đầy đủ thông tin.");
                } else {
                    window.alert("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
                    console.error('Error:', error);
                }
            }
        });
    }

    protected readonly window = window;
}
