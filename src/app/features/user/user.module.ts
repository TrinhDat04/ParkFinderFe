import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'list', component: UserListComponent },
  { path: 'create', component: UserCreateComponent },
  { path: 'detail', component: UserDetailComponent },
  { path: 'edit', component: UserEditComponent },
  { path: 'profile', component: UserProfileComponent },
];
@NgModule({
  declarations: [
    UserDetailComponent,
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
    UserProfileComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
})
export class UserModule {}
