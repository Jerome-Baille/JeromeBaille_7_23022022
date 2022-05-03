import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PostComponent } from './wall/post/post.component';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
import { PostListComponent } from './wall/post-list/post-list.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SinglePostComponent } from './wall/single-post/single-post.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { CreateAPostComponent } from './wall/create-a-post/create-a-post.component';
import { UpdateAPostComponent } from './wall/update-a-post/update-a-post.component';
import { CreateACommentComponent } from './comments/create-a-comment/create-a-comment.component';
import { CommentComponent } from './comments/comment/comment.component';
import { UpdateACommentComponent } from './comments/update-a-comment/update-a-comment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { MostPopularComponent } from './wall/most-popular/most-popular.component';
import { LoadingComponent } from './loading/loading.component';
import { InfoBoxComponent } from './info-box/info-box.component';
import { AuthGuardInterceptor } from './auth-guard.interceptor';
import { FilterPipe } from './filter.pipe';
import { ReportedPostListComponent } from './wall/reported-post-list/reported-post-list.component';
import { CommentListComponent } from './comments/comment-list/comment-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    PostListComponent,
    HeaderComponent,
    LandingPageComponent,
    SinglePostComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ProfileUpdateComponent,
    CreateAPostComponent,
    UpdateAPostComponent,
    CreateACommentComponent,
    CommentComponent,
    UpdateACommentComponent,
    AdminDashboardComponent,
    MostPopularComponent,
    LoadingComponent,
    InfoBoxComponent,
    FilterPipe,
    ReportedPostListComponent,
    CommentListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR'},
    { provide: HTTP_INTERCEPTORS, useClass: AuthGuardInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}