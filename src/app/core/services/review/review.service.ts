import {Injectable} from '@angular/core';
import {ApiService} from '../network/api.service';
import {Observable} from 'rxjs';
import {ReviewPresenter} from '../../models/review/review-presenter';
import {HttpHeaders} from '@angular/common/http';
import {AddReviewRequest} from '../../models/review/add-review-request';
import {EditReviewPresenter} from '../../models/review/edit-review-presenter';
import {EditReviewRequest} from '../../models/review/edit-review-request';

@Injectable({
  providedIn: 'root'
})

export class ReviewService{
  constructor(private apiService: ApiService) {
  }

  getReviewById(id: string | null) : Observable<any>{
    const token = localStorage.getItem('user_token'); // or inject from auth service

    return this.apiService.get<EditReviewPresenter>({
      serviceUrl: 'default',
      endpoint: '/reviews/' + id,
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    })
  }

  getReviewsByParkingLotId(parkingLotId: string | null, page: number, pageSize: number): Observable<any>{
    const token = localStorage.getItem('user_token'); // or inject from auth service

    return this.apiService.get<ReviewPresenter>({
      serviceUrl: 'default',
      endpoint: '/reviews/getReviewsByParkingLotId/' + parkingLotId,
      paramsObj: {
        page: page,
        pageSize : pageSize
      },
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  addReview(request: AddReviewRequest) : Observable<any>{
    const token = localStorage.getItem('user_token'); // or inject from auth service
    return this.apiService.post<any>({
      serviceUrl: 'default',
      endpoint: '/reviews',
      paramsObj: request,
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  deleteReview(id: string | null): Observable<any>{
    const token = localStorage.getItem('user_token'); // Or however you store it

    return this.apiService.delete<any>({
      serviceUrl: 'default',
      endpoint: `/reviews/${id}`,
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    });
  }

  updateReview(request: EditReviewRequest, id: string | null): Observable<any>{
    const token = localStorage.getItem('user_token'); // or inject from auth service
    return this.apiService.put<any>({
      serviceUrl: 'default',
      endpoint: '/reviews/' + id,
      paramsObj: request,
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    })
  }
}
