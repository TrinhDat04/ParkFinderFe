import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { ExampleHeaderComponent } from './components/header/example-header/example-header.component';
import { ExampleLeftHeaderComponent } from './components/header/example-left-header/example-left-header.component';
import { SharedModule } from '../shared/components/shared-components.module';
import { MapLayoutComponent } from './map-layout/map-layout.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MapHeaderComponent } from './components/header/map-header/map-header.component';
import { BasicHeaderComponent } from './components/header/basic-header/basic-header.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    ExampleHeaderComponent,
    ExampleLeftHeaderComponent,
    MapLayoutComponent,
    NavBarComponent,
    MapHeaderComponent,
    BasicHeaderComponent,
  ],
  imports: [CommonModule, RouterModule,SharedModule],
  exports: [
    MainLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    ExampleHeaderComponent,
    MapLayoutComponent,
    BasicHeaderComponent,
  ],
})
export class LayoutModule {}
