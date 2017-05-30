import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import 'hammerjs';

import { AngularMaterialModule } from './config/angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';

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
import { AskQuestionComponent } from './ask-question/ask-question.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { EntryComponent } from './entry/entry.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DisableUserDialog } from './admin-panel/disable-user.dialog';
import { ModeratorComponent, ModeratorQuestionTab, ModeratorAnswerTab, ModeratorCommentTab } from './moderator/moderator.component';

// Custom Services
import { SidenavService } from './services/sidenav.service';
import { ForumService } from './services/forum.service';

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
    ForumListItemComponent,
    AskQuestionComponent,
    CreateAccountComponent,
    EntryComponent,
    AdminPanelComponent,
    ModeratorComponent,
    DisableUserDialog,
    ModeratorQuestionTab, 
    ModeratorAnswerTab, 
    ModeratorCommentTab
  ],
  entryComponents: [DisableUserDialog],
  providers: [
    CookieService,
    ForumService,
    SidenavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



