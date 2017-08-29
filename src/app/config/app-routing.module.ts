import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { TeachingComponent } from '../teaching/teaching.component';
import { ForumComponent } from '../forum-home/forum.component';
import { ForumListItemComponent } from '../forum-list-item/forum-list-item.component';
import { SignupComponent } from '../signup/signup.component';
import { ResetPasswordLinkComponent } from '../reset-password-link/reset-password-link.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'about', component: AboutComponent },
    { path: 'login', component: LoginComponent },
    { path: 'teaching', component: TeachingComponent },
    { path: 'forum', component: ForumComponent },
    { path: 'forum/:id', component: ForumListItemComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'auth/linkedin/callback', component: LoginComponent },
    { path: 'reset', component: ResetPasswordLinkComponent },
    { path: 'reset/:id', component: ResetPasswordComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
