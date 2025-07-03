import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageComponent } from './language/language.component';
import { FilterBoxComponent } from '../../features/map/pages/filter-box/filter-box.component';
import { FilterDialogComponent } from '../../features/map/pages/filter-dialog/filter-dialog.component';
@NgModule({
  declarations: [
    LanguageComponent,
    FilterBoxComponent,
    FilterDialogComponent
],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
        deps: [HttpClient],
      },
    }),
  ],
  exports: [
    LanguageComponent,
    FilterBoxComponent,
    FilterDialogComponent
  ],
})
export class SharedModule {}
