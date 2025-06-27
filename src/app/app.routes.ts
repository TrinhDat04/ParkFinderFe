import { Routes, CanActivate } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { TranslationModuleResolver } from './core/resolvers/translation-module-resolver';
import { RouteData } from './core/models/rout-data';
import { EnumLanguageModule } from './core/constants/language-module.enum';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HasAnyRoleGuard } from './core/guards/has-any-role.guard';
import { EnumRole } from './core/constants/roles.enum';
import {UserProfileComponent} from './features/user/pages/user-profile/user-profile.component';
import {UserProfileResolver} from './core/resolvers/user-profile-resolver';
import { MapComponent } from './features/map/pages/map/map.component';
import {MapLayoutComponent} from './layout/map-layout/map-layout.component';
import { MapGoogleComponent } from './features/map-google/pages/map-google/map-google.component';
export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: 'user',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/user/user.module').then((m) => m.UserModule),
        resolve: {
          language: TranslationModuleResolver,
        },
        data: {
          LanguageModules: [EnumLanguageModule.User],
          roles: [EnumRole.Admin],
        } as RouteData,
        canActivate: [HasAnyRoleGuard],
      },
      {
        path: 'profile', component: UserProfileComponent,canActivate: [AuthGuard], resolve: { userData: UserProfileResolver }
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        resolve: {
          language: TranslationModuleResolver,
        },
        data: { LanguageModules: [EnumLanguageModule.Dashboard] } as RouteData,
      },
    ],
  },
  {
    path: 'map',
    component: MapLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/map/map.modules').then((m) => m.MapModule),
        resolve: {
          language: TranslationModuleResolver,
        },
        data: { LanguageModules: [EnumLanguageModule.Map] } as RouteData,
      },
    ],
  },
  {
    path: 'map-google',
    component: MapLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/map-google/map-google.module').then((m) => m.MapGoogleModule ),
        resolve: {
          language: TranslationModuleResolver,
        },
        data: { LanguageModules: [EnumLanguageModule.Map] } as RouteData,
      },
    ],
  },
  {
    path: 'homepage',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/homepage/homepage.module').then(
            (m) => m.HomepageModule
          ),
        resolve: {
          language: TranslationModuleResolver,
        },
        data: { LanguageModules: [EnumLanguageModule.Dashboard] } as RouteData,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'map-google',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
