import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './pages/map/map.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchBoxComponent } from './pages/search-box/search-box.component';
import { ReactiveFormsModule } from '@angular/forms';
import {FilterBoxComponent} from './pages/filter-box/filter-box.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FilterDialogComponent} from './pages/filter-dialog/filter-dialog.component';

const routes: Routes = [{ path: '', component: MapComponent }];
@NgModule({
  declarations: [
    MapComponent,
    SearchBoxComponent,
    FilterBoxComponent,
    FilterDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
})
export class MapModule {}
