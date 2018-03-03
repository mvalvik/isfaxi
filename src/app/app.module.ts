import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SuiModule} from 'ng2-semantic-ui';
import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { Routes, RouterModule} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormsModule }   from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchComponent } from './search/search.component';

import { UploadService } from './upload-service.service';
import { SignupComponent } from './signup/signup.component';
import { EmailComponent } from './email/email.component'

import { ProfileModule } from './profile/profile.module'

import { AuthGuard } from './auth.service';
import { ProfileComponent } from './profile/profile.component';

import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from '@agm/core';
import { DetailComponent } from './detail/detail.component';
import { GMapsService } from './google-maps.service'
import { OwlModule } from 'ng2-owl-carousel';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    LoginComponent,
    SignupComponent,
    EmailComponent,
    DetailComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    SuiModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ProfileModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWCWPk-yallrSBt1UF2DhOWUmsBJ7fZGc'
    }),
    OwlModule,
    HttpModule,
    //CookieModule
    

  ],
  providers: [AuthGuard, AngularFireAuth, UploadService, GMapsService ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
