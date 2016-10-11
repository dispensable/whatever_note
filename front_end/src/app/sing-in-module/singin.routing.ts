/**
 * Created by dispensable on 2016/10/10.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingInComponent }    from './singin.component';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

const singInRoutes: Routes = [
  { path: 'singin',  component: SingInComponent, canActivate: [!AuthGuard] },
];
export const singInRoutingProviders: any[] = [

];
export const singInRouting: ModuleWithProviders = RouterModule.forChild(singInRoutes);
