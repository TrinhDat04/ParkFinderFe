import {ReviewComment} from './review-comment';

export interface AddReviewRequest {
  parkingLotId: string;
  rating: number;
  reviewComment: ReviewComment;
}
