import { BrowserModule }           from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule }                from '@angular/core';
import { FormsModule }             from '@angular/forms';
import { ReactiveFormsModule }     from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { CookieService }           from 'angular2-cookie/services/cookies.service';
import 'hammerjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';

import { AngularMaterialModule }   from './config/angular-material.module';
import { FlexLayoutModule }        from '@angular/flex-layout';
import { MaterialModule }          from '@angular/material';

import { AppRoutingModule }        from './config/app-routing.module';
import { AppComponent }            from './app.component';
import { HomeComponent }           from './home/home.component';
import { AboutComponent }          from './about/about.component';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { LoginComponent }          from './login/login.component';
import { TeachingComponent }       from './teaching/teaching.component';
import { ToolbarComponent }        from './toolbar/toolbar.component';
import { ForumComponent }          from './forum-home/forum.component';
import { ForumDetailDirective }    from './directives/forum-detail.directive';
import { ForumListItemComponent }  from './forum-list-item/forum-list-item.component';
import { AskQuestionComponent }    from './ask-question/ask-question.component';
import { SignupComponent }         from './signup/signup.component';
import { EntryComponent }          from './entry/entry.component';
import { AdminPanelComponent }     from './admin-panel/admin-panel.component';
import { DisableUserDialog }       from './admin-panel/disable-user.dialog';
import { ModeratorComponent  }     from './moderator/moderator.component';
import { ModeratorQuestionTab }    from './moderator/questions/moderator-questions.component';
import { ModeratorAnswerTab }      from './moderator/answers/moderator-answers.component';
import { ModeratorCommentTab }     from './moderator/comments/moderator-comments.component'; 
import { CommentComponent }        from './comment/comment.component';
import { EntryCardComponent }      from './entry/entry-card.component';
import { UserInfoCardComponent }   from './entry/user-info-card.component';
import { UserProfileComponent }    from './user/user-profile.component';

// Directives
import { TinyMceDirective }        from './tinymce.directive';
import { MdMarginDirective }       from './directives/md-margin.directive';

// Custom Services
import { SidenavService }          from './services/sidenav.service';
import { ForumService }            from './services/forum.service';
import { UserService }             from './services/user.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule.forRoot(),
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
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
    SignupComponent,
    EntryComponent,
    AdminPanelComponent,
    ModeratorComponent,
    DisableUserDialog,
    ModeratorQuestionTab, 
    ModeratorAnswerTab, 
    ModeratorCommentTab,
    CommentComponent,
    EntryCardComponent,
    UserInfoCardComponent,
    UserProfileComponent,
    TinyMceDirective,
    MdMarginDirective
  ],
  entryComponents: [DisableUserDialog],
  providers: [
    CookieService,
    UserService,
    ForumService,
    SidenavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



