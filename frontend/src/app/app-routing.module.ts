import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './wall/post-list/post-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SinglePostComponent } from './wall/single-post/single-post.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { UpdateAPostComponent } from './wall/update-a-post/update-a-post.component';
import { CreateACommentComponent } from './comments/create-a-comment/create-a-comment.component';
import { CommentsListComponent } from './comments/comments-list/comments-list.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';


const routes: Routes = [
    { path: '', component: LandingPageComponent },

    { path: 'wall', component: PostListComponent },
    { path: 'wall/:id', component: SinglePostComponent},
    { path: 'wall/:id/update', component: UpdateAPostComponent},
    { path: 'wall/:id/comment', component: CreateACommentComponent},
    { path: 'wall/:id/allTheComments', component: CommentsListComponent},

    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },

    { path: 'profil/:id', component: ProfileComponent},
    { path: 'profil/:id/update', component: ProfileUpdateComponent},

    { path: 'admin', component: AdminDashboardComponent}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
      ],
      exports: [
        RouterModule
      ]
})
export class AppRoutingModule {}