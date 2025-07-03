import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LayoutModule } from '../../layout/layout.module';
import {NewsListComponent} from './pages/news-list/news-list.component';
import {NewsDetailComponent} from './pages/news-detail/news-detail.component';

const routes: Routes = [{ path: '', component: HomepageComponent },
  { path: 'news', component: NewsListComponent },
  { path: 'news/:id', component: NewsDetailComponent },];
@NgModule({
  declarations: [HomepageComponent,
  NewsListComponent,
  NewsDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    LayoutModule,
  ],
})
export class HomepageModule {}
