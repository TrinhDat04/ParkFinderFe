import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AddParkingLotComponent} from './pages/add-parking-lot/add-parking-lot.component';

const routes: Routes = [
  {path: 'add', component: AddParkingLotComponent},
];

@NgModule({
  declarations: [AddParkingLotComponent],
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, AngularFireAuthModule],
  exports: [],
  providers: []
})
export class ParkingLotModule {
}
