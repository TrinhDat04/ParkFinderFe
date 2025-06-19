import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthFormComponent} from './components/auth-form/auth-form.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthMainComponent} from './pages/auth-main/auth-main.component';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {VerifyCodeComponent} from './pages/verify-code/verify-code.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';

const routes: Routes = [
  {path: '', component: AuthMainComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'verify-code', component: VerifyCodeComponent},
  {path: 'reset-password', component: ResetPasswordComponent}
];

@NgModule({
  declarations: [AuthFormComponent, LoginComponent, RegisterComponent,
    AuthMainComponent, ForgotPasswordComponent, VerifyCodeComponent,
    ResetPasswordComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, AngularFireAuthModule],
  exports: [],
  providers: []
})
export class AuthModule {
}
