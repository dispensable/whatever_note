/**
 * Created by dispensable on 2016/10/10.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingInComponent }    from './singin.component';
import { SingInUpGuard } from '../shared/router-guards/singinup-guard.service';

const singInRoutes: Routes = [
  { path: 'singin',  component: SingInComponent, canActivate: [SingInUpGuard] },
];
export const singInRoutingProviders: any[] = [

];
export const singInRouting: ModuleWithProviders = RouterModule.forChild(singInRoutes);
