import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancianInformationComponent } from './pages/financian-information/financian-information.component';
const routes: Routes = [
    { path: '', component: FinancianInformationComponent },
    { path: 'financian', component: FinancianInformationComponent },
  ];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class DashboardModule {}
