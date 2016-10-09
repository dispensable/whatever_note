/**
 * Created by dispensable on 2016/10/9.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingUpComponent }    from './singup.component';

const singupRoutes: Routes = [
  { path: 'singup',  component: SingUpComponent },
];

export const singupRouting: ModuleWithProviders = RouterModule.forChild(singupRoutes);
