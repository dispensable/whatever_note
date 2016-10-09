import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SingUpModule } from './sing-up-module/singup.module'
import { routing, appRoutingProviders }  from './app.routing';
import { HomeModule } from './home-module/home.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SingUpModule,
    HomeModule,
    routing
  ],
  declarations: [
    AppComponent,
  ],
  providers: [ appRoutingProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
