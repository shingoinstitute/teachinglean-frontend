import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { UpgradeModule } from '@angular/upgrade/static';
import 'hammerjs';

import { AngularMaterialModule } from './config/angular-material.module';
import { MaterialModule } from '@angular/material';

import { UserService } from './user/user.service';

import { AppRoutingModule } from './config/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidenavService } from './sidenav/sidenav.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule.forRoot(),
    AngularMaterialModule,
    FormsModule,
    HttpModule,
    UpgradeModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    DashboardComponent
  ],
  providers: [
    UserService,
    SidenavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  ngDoBootstrap() {}
}



