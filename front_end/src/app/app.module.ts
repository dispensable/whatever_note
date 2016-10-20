import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SingUpModule } from './sing-up-module/singup.module'
import { routing, appRoutingProviders }  from './app.routing';
import { HomeModule } from './home-module/home.module';
import { SingInModule } from './sing-in-module/singin.module';
import { UserProfileModule } from './user-module/user-profile.module';
import { PublishModule } from './publish.module/publish.module';
import { PostModule } from './post-module/post.module';

import { NotificationComponent } from './shared/notification-component/notification.component';
import { AuthService } from './shared/auth.service';

// jwt support
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { JwtHelper } from 'angular2-jwt';

// drop down menue
import { DropdownModule } from 'ng2-dropdown';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SingUpModule,
    HomeModule,
    SingInModule,
    DropdownModule,
    UserProfileModule,
    PublishModule,
    PostModule,
    routing
  ],
  declarations: [
    AppComponent,
    NotificationComponent,
  ],
  providers: [ appRoutingProviders, AUTH_PROVIDERS, {provide: JwtHelper, useClass: JwtHelper}, AuthService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
