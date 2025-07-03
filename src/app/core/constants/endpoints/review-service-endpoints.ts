export const REVIEW_ENDPOINTS = {
  getTopRating:(id: string | number)=> `/reviews/RatingsByParkingLot?i=${id}`,
}
