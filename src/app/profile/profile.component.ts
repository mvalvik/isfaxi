import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Horse } from '../horse'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { User } from '../user'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  loggedInUser: Observable<firebase.User>;
  itemsCollection: AngularFirestoreCollection<Horse>;
  horses: Observable<Horse[]>;

  constructor(private auth: AngularFireAuth, private afs: AngularFirestore) 
  { 
     this.itemsCollection = afs.collection<Horse>('horses', ref => ref.where('uid', "==", auth.auth.currentUser.uid));
     this.horses = this.itemsCollection.valueChanges();

     this.loggedInUser = auth.authState;
     
  }

  ngOnInit() {
  }

}
