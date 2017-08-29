import { NgModule }                   from '@angular/core';
import { BrowserModule }              from '@angular/platform-browser';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { FormsModule }                from '@angular/forms';
import { ReactiveFormsModule }        from '@angular/forms';
import { HttpModule, JsonpModule }    from '@angular/http';
import { CookieModule }               from 'ngx-cookie';
import 'hammerjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';

// Material Design
import { MaterialModule }             from '@angular/material';
import { MaterialDesignImports }      from './config/material-design.module';
import { FlexLayoutModule }           from '@angular/flex-layout';
import { CdkTableModule }             from '@angular/cdk';

// App Components
import { AppRoutingModule }           from './config/app-routing.module';
import { AppComponent }               from './app.component';
import { HomeComponent }              from './home/home.component';
import { AboutComponent }             from './about/about.component';
import { DashboardComponent }         from './dashboard/dashboard.component';
import { LoginComponent }             from './login/login.component';
import { TeachingComponent }          from './teaching/teaching.component';
import { ToolbarComponent }           from './toolbar/toolbar.component';
import { ForumComponent }             from './forum-home/forum.component';
import { ForumListItemComponent }     from './forum-list-item/forum-list-item.component';
import { AskQuestionComponent }       from './ask-question/ask-question.component';
import { SignupComponent }            from './signup/signup.component';
import { EntryComponent }             from './entry/entry.component';
import { AdminPanelComponent }        from './admin-panel/admin-panel.component';
import { DisableUserDialog }          from './admin-panel/disable-user.dialog';
import { ModeratorComponent  }        from './moderator/moderator.component';
import { ModeratorQuestionTab }       from './moderator/questions/moderator-questions.component';
import { ModeratorAnswerTab }         from './moderator/answers/moderator-answers.component';
import { ModeratorCommentTab }        from './moderator/comments/moderator-comments.component'; 
import { CommentComponent }           from './comment/comment.component';
import { EntryCardComponent }         from './entry/entry-card.component';
import { UserInfoCardComponent }      from './entry/user-info-card.component';
import { UserProfileComponent }       from './user/user-profile.component';
import { AdminUserListItemComponent } from './admin-panel/admin-user-list-item/admin-user-list-item.component';
import { AdminUserCardComponent }     from './admin-panel/admin-user-card/admin-user-card.component';

// Directives
import { ForumDetailDirective }       from './directives/forum-detail.directive';
import { TinyMceDirective }           from './tinymce.directive';
import { MdMarginDirective }          from './directives/md-margin.directive';

// Services
import { SidenavService }             from './services/sidenav.service';
import { ForumService }               from './services/forum.service';
import { UserService }                from './services/user.service';
import { ResetPasswordLinkComponent } from './reset-password-link/reset-password-link.component';
import { ResetPasswordComponent }     from './reset-password/reset-password.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MaterialDesignImports,
    CdkTableModule,
    CookieModule.forRoot(),
    HttpModule,
    JsonpModule,
    FlexLayoutModule,
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
    MdMarginDirective,
    ResetPasswordLinkComponent,
    ResetPasswordComponent,
    AdminUserListItemComponent,
    AdminUserCardComponent
  ],
  entryComponents: [ DisableUserDialog ],
  providers: [
    UserService,
    ForumService,
    SidenavService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }



