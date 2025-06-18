import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './pages/map/map.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: MapComponent }];
@NgModule({
  declarations: [MapComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
})
export class MapModule {}
