import {Injectable} from '@angular/core';
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


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private localStorageService: LocalStorageService, private apiService: ApiService,
              private afAuth: AngularFireAuth) {
  }

  isAuthenticated(): boolean {
    // return this.localStorageService.getItem(LOCAL_STORAGE_KEYS.USER_TOKEN) ? true : false;
    return true;
  }

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

}
