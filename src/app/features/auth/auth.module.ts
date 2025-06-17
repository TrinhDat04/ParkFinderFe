import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthMainComponent } from './pages/auth-main/auth-main.component';
const routes: Routes = [
  { path: '', component: AuthMainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];
@NgModule({
  declarations: [AuthFormComponent, LoginComponent, RegisterComponent, AuthMainComponent],
  imports: [CommonModule, RouterModule.forChild(routes),FormsModule],
  exports: [],
})
export class AuthModule {}
