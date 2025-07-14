import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MapGoogleComponent } from './pages/map-google/map-google.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FilterBoxComponent } from '../map/pages/filter-box/filter-box.component';
import { SearchBoxComponent } from './pages/search-box/search-box.component';
import { FilterDialogComponent } from '../map/pages/filter-dialog/filter-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../../shared/components/shared-components.module';

const routes: Routes = [{ path: '', component: MapGoogleComponent }];
@NgModule({
  declarations: [
    MapGoogleComponent,
    SearchBoxComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    GoogleMapsModule,
    SharedModule,
  ],
  exports: [
    FilterBoxComponent
  ]
})
export class MapGoogleModule {}
