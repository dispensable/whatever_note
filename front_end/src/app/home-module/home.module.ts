/**
 * Created by dispensable on 2016/10/9.
 */
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home.component';
import { routing, homeRoutingProviders }  from './home.routing';
import { JwtHelper } from 'angular2-jwt';
import { AuthGuard } from '../shared/router-guards/auth-guard.service';

import { NotificationService } from "../shared/notification-component/notification.service";

import { HomeTimeLineService } from "./hometimeline.service";
import { CommonModule} from "@angular/common";
import { MarkdownModule } from '../shared/markdown-derictive/markdown.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    MarkdownModule,
    HttpModule,
    CommonModule,
    routing
  ],
  providers: [ homeRoutingProviders, {provide: JwtHelper, useClass: JwtHelper},
    AuthGuard, NotificationService, HomeTimeLineService],
})
export class HomeModule { }
