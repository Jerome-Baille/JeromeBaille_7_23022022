import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SingleFaceSnapComponent } from './single-face-snap/single-face-snap.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
    { path: 'facesnaps/:id', component: SingleFaceSnapComponent},
    { path: 'facesnaps', component: BlogListComponent },
    { path: '', component: LandingPageComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent }
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