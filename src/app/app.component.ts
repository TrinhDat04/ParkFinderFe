import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language/language.service';
import { LayoutModule } from './layout/layout.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    LayoutModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit {
  title = 'angular18';
  constructor(private languageService: LanguageService) { }
  ngOnInit(): void {
    this.languageService.loadGlobalTranslations().subscribe(()=>{
      this.languageService.setDefaultLanguage();
    });
  }
}
