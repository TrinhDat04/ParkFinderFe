import {ReviewComment} from './review-comment';

export interface EditReviewRequest {
  rating: number;
  comment: ReviewComment;
}
