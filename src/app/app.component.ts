import { Component, AfterViewInit } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { SuiDropdownModule, SuiSidebarModule} from 'ng2-semantic-ui';
import * as jQuery from 'jquery';
import 'semantic-ui/dist/semantic.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  isFrontpage: boolean;
  router: Router;
  loggedInUser: Observable<firebase.User>;

  constructor(private auth: AngularFireAuth, router: Router) {
    this.loggedInUser = this.auth.authState;
    this.router = router;
  }

  logout(){
    this.auth.auth.signOut();
  }

  ngAfterViewInit() {
    
  }
}
