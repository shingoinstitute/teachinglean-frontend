import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import 'hammerjs';

import { AngularMaterialModule } from './config/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';

import { UserService } from './services/user.service';

import { AppRoutingModule } from './config/app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { TeachingComponent } from './teaching/teaching.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ForumComponent } from './forum/forum.component';
import { ForumDetailDirective } from './directives/forum-detail.directive';
import { ForumListItemComponent } from './forum-list-item/forum-list-item.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule.forRoot(),
    AngularMaterialModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    DashboardComponent,
    LoginComponent,
    TeachingComponent,
    ToolbarComponent,
    ForumComponent,
    ForumDetailDirective,
    ForumListItemComponent
  ],
  providers: [
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



