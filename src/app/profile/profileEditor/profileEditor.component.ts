import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import { User } from '../../user'
@Component({
  selector: 'app-profileEditor',
  templateUrl: './profileEditor.component.html',
  styleUrls: ['./profileEditor.component.css'],
})

export class ProfileEditorComponent implements OnInit {
  contactInfoForm: FormGroup;
  loggedInUser: Observable<firebase.User>;
  user: Observable<User>;
  uid: string;
  isNewUser: boolean;
  doc:  AngularFirestoreDocument<User>;
  areaTypes = areaTypes;
  isSaving: boolean;
  isSaved: boolean;
  completedSaving: boolean;
  hasSaved: boolean;


  constructor(private afs: AngularFirestore, private auth: AngularFireAuth, private fb: FormBuilder) {
    this.uid = auth.auth.currentUser.uid;
    this.createForm();
    this.doc = afs.doc<User>('users/' + auth.auth.currentUser.uid);
    this.user = this.doc.valueChanges();
    
    this.user.subscribe(u =>
        this.contactInfoForm.reset({
          adressEmail: u.adressEmail,
          adressStreet: u.adressStreet,
          adressPostcode: u.adressPostcode,
          adressNumber: u.adressNumber,
          adressTelephone: u.adressTelephone,
          adressName: u.adressName,
          area: u.area,
          adressWeb: u.adressWeb,
          adressCity: u.adressCity,
          uid: u.uid,
        }));

    this.loggedInUser = auth.authState;
  }

  ngOnInit() {
  }


  onSubmit() {
    this.isSaving = true;
    var doc = this.afs.doc<User>("users/" + this.uid);
    var userToBeSaved = { 
      adressEmail: this.contactInfoForm.value.adressEmail,
      adressStreet: this.contactInfoForm.value.adressStreet,
      adressPostcode: this.contactInfoForm.value.adressPostcode,
      adressNumber: this.contactInfoForm.value.adressNumber,
      adressTelephone: this.contactInfoForm.value.adressTelephone,
      adressName: this.contactInfoForm.value.adressName,
      area: this.contactInfoForm.value.area,
      adressCity: this.contactInfoForm.value.adressCity,
      adressWeb: this.contactInfoForm.value.adressWeb,
      uid: this.uid,
    };

    doc.set(userToBeSaved).then(x => {
      this.isSaving = false;
      this.isSaved = true
    }); 
  }

  createForm() {
    this.contactInfoForm = this.fb.group({
      adressName: '',
      adressStreet: '',
      adressPostcode: '',
      adressNumber: '',
      adressTelephone: '',
      adressEmail: '',
      adressCity: '',
      area: '',
      adressWeb: '',
      uid: this.uid,
    })
  }


}

export const areaTypes = ['Sjælland', 'Fyn', 'Sønderjylland', 'Nordjylland', 'Midtjylland', 'Østjylland', 'Island', 'Andet land'];