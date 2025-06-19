import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './pages/map/map.component';
import { RouterModule, Routes } from '@angular/router';
import { SearchBoxComponent } from './pages/search-box/search-box.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: MapComponent }];
@NgModule({
  declarations: [MapComponent, SearchBoxComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ReactiveFormsModule,
  ],
})
export class MapModule {}
