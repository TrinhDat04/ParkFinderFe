import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ExampleHeaderComponent } from './components/header/example-header/example-header.component';
import { ExampleLeftHeaderComponent } from './components/header/example-left-header/example-left-header.component';
import { SharedModule } from '../shared/components/shared-components.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    ExampleHeaderComponent,
    ExampleLeftHeaderComponent,
  ],
  imports: [CommonModule, RouterModule,SharedModule],
  exports: [
    MainLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    ExampleHeaderComponent,
  ],
})
export class LayoutModule {}
