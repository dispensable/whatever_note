import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublishComponent }    from './publish.component';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';
import { PostComponent } from "./post.component/post.component";
import { ImgComponent } from "./img.component/img.component";

const publishRoutes: Routes = [
  { path: 'publish',  component: PublishComponent, canActivate: [AuthGuard] },
  { path: 'publish/post', component: PostComponent, canActivate: [AuthGuard]},
  { path: 'publish/img', component: ImgComponent, canActivate: [AuthGuard]}
];

export const publishRoutingProviders: any[] = [

];

export const publishRouting: ModuleWithProviders = RouterModule.forChild(publishRoutes);
