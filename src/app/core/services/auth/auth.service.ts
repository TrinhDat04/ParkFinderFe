import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {LocalStorageService} from '../storage/local-storage.service';
import {EnumRole} from '../../constants/roles.enum';
import {EnumPemission} from '../../constants/pemission.enum';
import {LOCAL_STORAGE_KEYS} from '../../constants/local-storage-key';
import {ApiService} from '../network/api.service';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {isPlatformBrowser} from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService, private apiService: ApiService,
              private afAuth: AngularFireAuth, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('user_token');
      const userId = localStorage.getItem('user_id');
      return !!token && !!userId;
    }
    return false;  }

  hasAnyRoles(requireAnyRoles: EnumRole[]): boolean {
    return true;
  }

  hasAnyPermission(requiredPermissions: EnumPemission[]): boolean {
    return true;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post<any>({
      serviceUrl: "auth",
      endpoint: "/login",
      paramsObj: credentials
    });
  }

  register(userData: {
    email: string;
    password: string,
    fullName: string,
    phoneNumber: string | null,
    role: string
  }): Observable<any> {
    console.log('Sending registration request:', userData);
    return this.apiService.post<any>({
      serviceUrl: "auth",
      endpoint: "/register",
      paramsObj: userData
    });
  }

  sendVerificationToken(credentials: { email: string }): Observable<any> {
    return this.apiService.post<any>({
      serviceUrl: "auth",
      endpoint: "/sendEmail",
      paramsObj: credentials
    });
  }

  async getFirebaseToken() {
    const userCredential = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    return await userCredential.user?.getIdToken(); // Retrieve the ID token
  }

  loginWithGG(tokenModel: { token: string }): Observable<any> {
    return this.apiService.post<any>({
      serviceUrl: 'auth',
      endpoint: '/loginWithGG',
      paramsObj: tokenModel
    })
  }

  verifyCode(model: { email: string | null, code: string }): Observable<any> {
    return this.apiService.post<any>({
      serviceUrl: 'auth',
      endpoint: '/verifyCode',
      paramsObj: model
    });
  }

  changePassword(request: { email: string | null, newPassword: string }): Observable<any> {
    return this.apiService.post<any>({
      serviceUrl: 'auth',
      endpoint: '/changePassword',
      paramsObj: request
    });
  }

}
