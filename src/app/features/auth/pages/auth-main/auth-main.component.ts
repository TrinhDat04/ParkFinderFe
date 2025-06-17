import {AfterViewInit, Component} from '@angular/core';
import {gapi} from 'gapi-script';
import {ApiService} from '../../../../core/services/network/api.service';


@Component({
  selector: 'app-auth-main',
  templateUrl: './auth-main.component.html',
  styleUrl: './auth-main.component.scss'
})
export class AuthMainComponent implements AfterViewInit {
  private clientId = '1000409441117-j80h4bldmjfvh7vm78abfs34g3j65a4a.apps.googleusercontent.com'; // Replace with your Google Client ID
  message = '';

  constructor(private apiService: ApiService) {
  }

  ngAfterViewInit() {
    gapi.load('auth2', () => {
      gapi.auth2.init({client_id: this.clientId});
    });
  }

  loginWithGoogle() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn({
      redirect_uri: 'http://localhost:4200' // ✅ Must match Google settings
    }).then((googleUser: { getAuthResponse: () => { (): any; new(): any; id_token: any; }; }) => {
      const idToken = googleUser.getAuthResponse().id_token;
      console.log('Google Token:', idToken); // Debugging

      // Send token to your API for verification
      this.apiService.post<any>({
        serviceUrl: 'auth',
        endpoint: '/loginWithGG',
        paramsObj: {token: idToken}
      }).subscribe({
        next: response => {
          this.message = response.message || 'Login successful!';
          console.log('Login response:', response);
        },
        error: error => {
          this.message = error.error?.message || 'Login failed!';
          console.error('Error:', error);
        }
      });
    });
  }

}
