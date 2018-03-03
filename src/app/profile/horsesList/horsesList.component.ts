import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2'
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth'
import { Router } from '@angular/router';

import 'firebase/storage'

@Component({
  selector: 'app-horsesList',
  templateUrl: './horsesList.component.html',
  styleUrls: ['./horsesList.component.css']
})

export class HorsesListComponent {
  horseTypes = horseTypes;
  selectedHorse: Horse;
  displayName: string;

  private itemsCollection: AngularFirestoreCollection<Horse>;
  horses: Observable<Horse[]>;
  firebase:FirebaseApp;
  
  constructor(private afs: AngularFirestore, firebaseApp: FirebaseApp, private auth: AngularFireAuth, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){ return false;}
    this.itemsCollection = afs.collection<Horse>('horses', ref => ref.where('uid', "==", auth.auth.currentUser.uid));
    this.horses = this.itemsCollection.valueChanges();
    
    this.displayName = auth.auth.currentUser.displayName;
    this.getHorses();
  }

  getHorses(){
    this.itemsCollection = this.afs.collection<Horse>('horse');
    this.selectedHorse = undefined;
  }

  select(horse: Horse){
    this.selectedHorse = horse;
  }

  createNew(){
    var newHorse = new Horse();
    newHorse.name = "Ny hest";
    this.selectedHorse = newHorse;
  }

  delete(horse: Horse){
    var doc = this.afs.doc<Horse>("horses/" + horse.id + "/");
    doc.delete();
  }

  ngOnInit() {
  }
}

export const horseTypes = ['Hoppe', 'Hingst', 'Vallak', 'ODIN'];

export class Horse{
    id: number;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    image5: string;

    name: string;
    type: string;
    age: number;
}




