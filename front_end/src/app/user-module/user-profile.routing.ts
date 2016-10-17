/**
 * Created by dispensable on 2016/10/17.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserProfileComponent }    from './user-profile.component';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

const profileRoutes: Routes = [
  { path: 'profile',  component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userid', component: UserProfileComponent, canActivate: [AuthGuard]}
];

export const profileRoutingProviders: any[] = [

];

export const profileRouting: ModuleWithProviders = RouterModule.forChild(profileRoutes);
