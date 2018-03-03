import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2'
import * as firebase from 'firebase/app'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import {Horse} from './horse'

@Injectable()
export class UploadService {
  constructor(private af: FirebaseApp, private db: AngularFirestore) { }

  private basePath:string = '/uploads';
  private uploadTask: firebase.storage.UploadTask;
  private key: string;

  pushUpload(upload: Upload, formGroup: FormGroup, imageFormKey: string) {
    let storageRef = firebase.storage().ref();
    this.key = imageFormKey;
    this.uploadTask = storageRef.child(`${this.basePath}/${upload.name}`).put(upload.file);

    return this.uploadTask;
    
  }

}

export class Upload{
  file: Blob;
  url: string;
  name: string;

  constructor(file:Blob, filename: string) {
    this.file = file;
    this.name = filename;
  }
}