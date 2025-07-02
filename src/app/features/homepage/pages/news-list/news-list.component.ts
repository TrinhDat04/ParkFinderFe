import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {NEWS_LIST} from '../../../../core/constants/news-data';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent {
  newsList = NEWS_LIST;

  constructor(private router: Router) {}

  goToDetail(news: any) {
    this.router.navigate(['/homepage/news', news.id]);
  }
}
