/**
 * Created by dispensable on 2016/10/9.
 */
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent,  canActivate: [AuthGuard]},
];

export const homeRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forChild(homeRoutes);
