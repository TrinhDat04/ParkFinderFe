import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../../core/services/language/language.service';
import { LanguageModel } from './models/language-model';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.less']
})
export class LanguageComponent implements OnInit {
  languages: LanguageModel[] = [];
  selectedLanguage?: LanguageModel;

  constructor(private languageService: LanguageService) { }
  ngOnInit(): void {
    this.languageService.getLanguagesObservable().subscribe((data)=>{
      this.languages = data;
      this.selectedLanguage = data.find(x=>x.value == this.languageService.getCurrentLanguage());
    });
  }
  onLanguageChange(lang: string): void {
    this.languageService.changeLanguage(lang);
  }
}
