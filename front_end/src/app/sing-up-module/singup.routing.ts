/**
 * Created by dispensable on 2016/10/9.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingUpComponent }    from './singup.component';
import { SingInUpGuard } from '../shared/router-guards/singinup-guard.service';

const singupRoutes: Routes = [
  { path: 'singup',  component: SingUpComponent, canActivate: [SingInUpGuard] },
];

export const singupRouting: ModuleWithProviders = RouterModule.forChild(singupRoutes);
