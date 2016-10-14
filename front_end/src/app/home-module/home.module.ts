/**
 * Created by dispensable on 2016/10/9.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home.component';
import { routing, homeRoutingProviders }  from './home.routing';
import { JwtHelper } from 'angular2-jwt';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

import {NotificationService} from "../shared/notification-component/notification.service";


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [ homeRoutingProviders, {provide: JwtHelper, useClass: JwtHelper}, AuthGuard, NotificationService],
})
export class HomeModule { }
