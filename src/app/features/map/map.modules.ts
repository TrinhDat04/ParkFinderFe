import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchBoxComponent } from './pages/search-box/search-box.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/components/shared-components.module';

const routes: Routes = [{ path: '' }];
@NgModule({
  declarations: [SearchBoxComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    SharedModule,
  ],
  exports: [SearchBoxComponent],
})
export class MapModule {}
