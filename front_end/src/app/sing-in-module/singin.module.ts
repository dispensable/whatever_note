/**
 * Created by dispensable on 2016/10/10.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { SingInComponent } from './singin.component'
import {SingInService} from "./singin.service";
import {singInRouting, singInRoutingProviders} from "./singin.routing";
import {CommonModule} from "@angular/common";
//import { NameEmailUniqueService } from '../shared/name_email_isunique.service';
import { NotificationService } from '../shared/notification-component/notification.service';
import { SingInUpGuard } from '../shared/router-guards/singinup-guard.service';

@NgModule({
  declarations: [
    SingInComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    singInRouting
  ],
  providers: [SingInService, singInRoutingProviders, NotificationService, SingInUpGuard],
})
export class SingInModule { }
