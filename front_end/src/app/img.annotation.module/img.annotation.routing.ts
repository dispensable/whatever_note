/**
 * Created by dispensable on 2016/11/6.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImgAnnotationComponent }    from './img.annotation.component';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

const imgAnnotationRoutes: Routes = [
  { path: 'add_note_to_img',  component: ImgAnnotationComponent, canActivate: [AuthGuard] },
];

export const imgAnnotationRoutingProviders: any[] = [

];

export const imgAnnotationRouting: ModuleWithProviders = RouterModule.forChild(imgAnnotationRoutes);
