/**
 * Created by dispensable on 2016/10/9.
 */
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const homeRoutes: Routes = [
  { path: '',  component: HomeComponent },
];

export const homeRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forChild(homeRoutes);
