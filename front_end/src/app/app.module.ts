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
import { NotificationCenterModule } from './notification-center.module/notification-center.module';
import { NotificationCenterComponent } from './notification-center.module/notificaiton-center.component';

import { NotificationComponent } from './shared/notification-component/notification.component';
import { Notification } from './shared/notification-component/notification';
import { AuthService } from './shared/auth.service';

// css skeleton
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// jwt support
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { JwtHelper } from 'angular2-jwt';

// drop down menue
import { DropdownModule } from 'ng2-dropdown';

// img annotation
import { ImgAnnotationModule } from './img.annotation.module/img.annotation.module';

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
    NgbModule.forRoot(),
    NotificationCenterModule,
    ImgAnnotationModule,
    routing
  ],
  declarations: [
    AppComponent,
    NotificationComponent,
  ],
  providers: [
    appRoutingProviders,
    AUTH_PROVIDERS,
    {provide: JwtHelper, useClass: JwtHelper},
    AuthService,
    {provide: Notification, useValue: new Notification('', 1, '', 1, new Date().getTime(), [], false, '', ''),}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
