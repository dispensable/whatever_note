import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SingUpModule } from './sing-up-module/singup.module'
import { routing, appRoutingProviders }  from './app.routing';
import { HomeModule } from './home-module/home.module';
import { SingInModule } from './sing-in-module/singin.module';

import { NotificationComponent } from './shared/notification-component/notification.component';

// jwt support
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { JwtHelper } from 'angular2-jwt';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SingUpModule,
    HomeModule,
    SingInModule,
    routing
  ],
  declarations: [
    AppComponent,
    NotificationComponent
  ],
  providers: [ appRoutingProviders, AUTH_PROVIDERS, {provide: JwtHelper, useClass: JwtHelper} ],
  bootstrap: [AppComponent]
})
export class AppModule { }
