import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {User} from '../../features/user/models/user';
import {UserService} from '../../features/user/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(): Observable<User> {
    // const userId = localStorage.getItem('userId'); // lấy từ localStorage (hoặc cookie)
    const userId = '11111111-1111-1111-1111-111111111111';
    if (!userId) {
      throw new Error('Missing userId in localStorage');
    }
    return this.userService.getUserProfile(userId);
  }
}
