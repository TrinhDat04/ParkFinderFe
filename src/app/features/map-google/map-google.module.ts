import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MapGoogleComponent } from './pages/map-google/map-google.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

const routes: Routes = [{ path: '', component: MapGoogleComponent }];
@NgModule({
  declarations: [MapGoogleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ],
})
export class MapGoogleModule {}
