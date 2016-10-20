/**
 * Created by dispensable on 2016/10/17.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostComponent }    from './post.component';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

const postRoutes: Routes = [
  { path: 'post',  component: PostComponent, canActivate: [AuthGuard] },
  { path: 'post/:post_id',  component: PostComponent, canActivate: [AuthGuard] },
];

export const postRoutingProviders: any[] = [

];

export const postRouting: ModuleWithProviders = RouterModule.forChild(postRoutes);
