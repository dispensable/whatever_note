/**
 * Created by dispensable on 2016/10/9.
 */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home.component';
import { routing, homeRoutingProviders }  from './home.routing';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [ homeRoutingProviders ],
})
export class HomeModule { }
