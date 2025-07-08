import {RouterModule, Routes} from '@angular/router';
import {ListReviewComponent} from './pages/list-reviews/list-review.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AddReviewComponent} from './pages/add-review/add-review.component';
import {EditReviewComponent} from './pages/edit-review/edit-review.component';

const routes: Routes = [
  {path: '', component: ListReviewComponent},
  {path: 'add', component: AddReviewComponent},
  {path: 'edit', component: EditReviewComponent}
];

@NgModule({
  declarations: [ListReviewComponent, AddReviewComponent, EditReviewComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, AngularFireAuthModule],
  exports: [],
  providers: []
})
export class ReviewModule {

}
