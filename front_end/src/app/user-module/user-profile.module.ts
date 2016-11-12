/**
 * Created by dispensable on 2016/10/17.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule} from "@angular/common";

import { NotificationService } from '../shared/notification-component/notification.service';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

import { UserProfileComponent } from "./user-profile.component";
import { BaseDataService } from "../shared/base-data.service";

import { profileRouting, profileRoutingProviders } from "./user-profile.routing";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    NgbModule,
    profileRouting
  ],
  declarations: [
    UserProfileComponent
  ],
  providers: [
    profileRoutingProviders,
    NotificationService,
    AuthGuard,
    BaseDataService,
  ],
})

export class UserProfileModule { }
