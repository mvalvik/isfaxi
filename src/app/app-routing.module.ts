import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component'
import { SearchComponent } from './search/search.component';
import { DetailComponent } from './detail/detail.component';

import { AuthGuard } from './auth.service';

const appRoutes: Routes = [
    { path: '', component: SearchComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'login-email', component: EmailComponent },
    { path: 'detail/:id', component: DetailComponent },
    { path: 'profile', loadChildren: 'app/profile/profile.module#ProfileModule', canActivate: [AuthGuard]}
   ];

@NgModule({
imports: [
    RouterModule.forRoot(
    appRoutes,
    {
        enableTracing: true // <-- debugging purposes only

    }
    )
],
exports: [
    RouterModule
],
providers: [AuthGuard]
})
  export class AppRoutingModule { }