import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import {User} from '../../features/user/models/user';
import {UserService} from '../../features/user/services/user.service';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserProfileResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  resolve(): Observable<User> {
    let userId: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      userId = localStorage.getItem("user_id");
    }
    // const userId = '11111111-1111-1111-1111-111111111111';
    if (!userId) {
      throw new Error('Missing userId in localStorage');
    }
    return this.userService.getUserProfile(userId);
  }
}
