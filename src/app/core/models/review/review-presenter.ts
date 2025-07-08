export interface ReviewPresenter{
  parkingLotName: string;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    additionalComments: string;
    createdAt: string;
  }>;
}
