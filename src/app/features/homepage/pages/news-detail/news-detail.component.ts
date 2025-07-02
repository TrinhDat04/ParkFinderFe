import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NEWS_LIST} from '../../../../core/constants/news-data';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css']
})
export class NewsDetailComponent implements OnInit {
  newsDetail: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.newsDetail = NEWS_LIST.find(item => item.id === Number(id));

    if (!this.newsDetail) {
      // Không tìm thấy bài viết -> trở về trang chủ
      this.router.navigate(['/']);
    }
  }

  goBack(event: Event) {
    event.preventDefault();
    this.router.navigate(['/homepage/news']);

  }
}
