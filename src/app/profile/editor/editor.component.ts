import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FirebaseApp } from 'angularfire2'
import { AngularFireAuth } from 'angularfire2/auth'
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UploadFormComponent } from '../upload-form/upload-form.component'
import { Horse } from '../../horse'
import { User } from '../../user'
import { GMapsService}  from '../../google-maps.service'
import { Ng2ImgMaxService  } from 'ng2-img-max'
import { Ng2ImgToolsService } from 'ng2-img-tools';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UploadService, Upload } from '../../upload-service.service'
import * as firebase from 'firebase/app'

import 'firebase/storage'

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})

export class EditorComponent {
  @Input() horse: Horse;

  @ViewChild('imageComponent1', undefined)
  imageComponent1:UploadFormComponent;

  @ViewChild('imageComponent2', undefined)
  imageComponent2:UploadFormComponent;

  @ViewChild('imageComponent3', undefined)
  imageComponent4:UploadFormComponent;

  @ViewChild('imageComponent4', undefined)
  imageComponent3:UploadFormComponent;
  breedingAssement: boolean;
  horseForm: FormGroup;
  genderTypes = genderTypes;
  gaitTypes = gaitTypes;
  areaTypes = areaTypes;
  horseCategory = horseCategory;
  invalidFormSubmit: boolean;
  uid: string;
  displayName: string;
  selectedHorse: Horse;
  image1: string = "image1";
  image2: string = "image2";
  image3: string = "image3";
  image4: string = "image4";
  hideSelectedHorse: boolean;
  doc: AngularFirestoreDocument<Horse>;
  isSaving: boolean;
  uploadedImage2: any;
  uploadedImage3: any;
  uploadedImage4: any;
  uploadedImage5: any;
  
  private itemsCollection: AngularFirestoreCollection<Horse>;
  horses: Observable<Horse[]>;
  firebase: FirebaseApp;
  userInfo: Observable<User>;

  constructor(private afs: AngularFirestore, private uploadService: UploadService, private sanitizer: DomSanitizer, private ng2ImgToolsService: Ng2ImgToolsService, private auth: AngularFireAuth, firebaseApp: FirebaseApp, private fb: FormBuilder, private router: Router, private gMapsService: GMapsService) {
      
    this.createForm();
    
    this.itemsCollection = afs.collection<Horse>('horses');
    this.horses = this.itemsCollection.valueChanges();
    this.uid = auth.auth.currentUser.uid;
    var userDoc = afs.doc<User>('users/' + auth.auth.currentUser.uid);
    this.userInfo = userDoc.valueChanges();
    this.uid = auth.auth.currentUser.uid;

    this.horseForm.controls.age.valueChanges.subscribe(age => {
      this.setHorseCategory(age, this.horseForm.controls.genderType.value);
    });
    
    this.horseForm.controls.genderType.valueChanges.subscribe(gender => {
           this.setHorseCategory(this.horseForm.controls.age.value, gender);
    });
 
  }

  private setHorseCategory(age: any, gender: any){
    if(age != ''){
      if(age < 3){
        this.horseForm.controls.horseCategory.patchValue('Føl');
      }

      else if(age > 2 && age < 6){
        this.horseForm.controls.horseCategory.patchValue('Unghest');
      }
      else if(gender != ''){
        this.horseForm.controls.horseCategory.patchValue(gender);
      }
    }
    else if(gender != ''){
      this.horseForm.controls.horseCategory.patchValue(gender);
    }
    else {
      this.horseForm.controls.horseCategory.patchValue('');
    }
      
  }

  ngOnChanges() {
    this.horseForm = new FormGroup({ 
      'headline': new FormControl(this.horse.headline, [Validators.required]),
      'feifNr': new FormControl(this.horse.feifNr),
      'name': new FormControl(this.horse.name),
      'age': new FormControl(this.horse.age),
      'blup': new FormControl(this.horse.blup),
      'breedingAssesment': new FormControl(this.horse.breedingAssesment),
      'total_breedingAssesment': new FormControl(this.horse.total_breedingAssesment),
      'rid_breedingAssesment': new FormControl(this.horse.rid_breedingAssesment),
      'build_breedingAssesment': new FormControl(this.horse.build_breedingAssesment),
      'gaitType': new FormControl(this.horse.gaitType),
      'horseCategory': new FormControl(this.horse.horseCategory),
      'genderType': new FormControl(this.horse.genderType),
      'price': new FormControl(this.horse.price, [Validators.required]),
      'height': new FormControl(this.horse.height),
      'image1': new FormControl(this.horse.image1),
      'image2': new FormControl(this.horse.image2),
      'image3': new FormControl(this.horse.image3),
      'image4': new FormControl(this.horse.image4),
      'area': new FormControl(this.horse.area, [Validators.required]),
      'adressName': new FormControl(this.horse.adressName),
      'adressStreet': new FormControl(this.horse.adressStreet),
      'adressPostcode': new FormControl(this.horse.adressPostcode),
      'adressNumber': new FormControl(this.horse.adressNumber),
      'adressTelephone': new FormControl(this.horse.adressTelephone),
      'adressEmail': new FormControl(this.horse.adressEmail),
      'adressWeb': new FormControl(this.horse.adressWeb),
      'adressCity': new FormControl(this.horse.adressCity),
      'lat': new FormControl(this.horse.lat),
      'lng': new FormControl(this.horse.lng),
      'description': new FormControl(this.horse.description),
      'uid': new FormControl(this.horse.uid),
      'lastUpdated': new FormControl(this.horse.lastUpdated),
      'created': new FormControl(this.horse.created),
      'videoUrl': new FormControl(this.horse.videoUrl) });

      if(this.horse.image2){
        this.uploadedImage2 = this.horse.image2;
      }
      if(this.horse.image3){
        this.uploadedImage3 = this.horse.image3;
      }

      if(this.horse.image4){
        this.uploadedImage4 = this.horse.image4
      }
      this.hideSelectedHorse = false;
  }

  createForm() {
    this.horseForm = new FormGroup({ 
      'headline': new FormControl('', [Validators.required]),
      'feifNr': new FormControl(''),
      'name': new FormControl(''),
      'age': new FormControl(''),
      'blup': new FormControl(''),
      'breedingAssesment': new FormControl(false),
      'total_breedingAssesment': new FormControl(''),
      'rid_breedingAssesment': new FormControl(''),
      'build_breedingAssesment': new FormControl(''),

      'gaitType': new FormControl(''),
      'genderType': new FormControl('Hoppe'),
      'horseCategory': new FormControl(''),
      'price': new FormControl('', [Validators.required]),
      'height': new FormControl(''),
      'image1': new FormControl('/assets/default.png'),
      'image2': new FormControl('/assets/default.png'),
      'image3': new FormControl('/assets/default.png'),
      'image4': new FormControl('/assets/default.png'),
      'area': new FormControl('', [Validators.required]),
      'adressName': new FormControl(''),
      'adressStreet': new FormControl(''),
      'adressPostcode': new FormControl(''),
      'adressNumber': new FormControl(''),
      'adressTelephone': new FormControl(''),
      'adressEmail': new FormControl(''),
      'adressWeb': new FormControl(''),
      'adressCity': new FormControl(''),
      'lat': new FormControl(''),
      'lng': new FormControl(''),
      'description': new FormControl(''),
      'uid': new FormControl(this.uid),
      'lastUpdated': new FormControl(''),
      'created': new FormControl(''),
      'videoUrl': new FormControl('') },);
  }

  onImage2Change(event, imageFormKey: string) {
    let image = event.target.files as FileList;
    let tt = Array.from(image);
    this.ng2ImgToolsService.compress(tt, 3).subscribe( result =>
    {
      console.log("Resize exact fill result:", result);
      var upload = new Upload(result, tt[0].name);
      var uploadTask = this.uploadService.pushUpload(upload, this.horseForm, imageFormKey);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
        },
        (error) => {
          // upload failed
          console.log(error)
        },
        () => {
          // upload success
          var downloadUrl = uploadTask.snapshot.downloadURL;
          this.horseForm.get(imageFormKey).patchValue(downloadUrl);
          this.horseForm.get(imageFormKey).markAsDirty();
          if(imageFormKey == 'image2'){
            this.uploadedImage2 = downloadUrl;
          }
          if(imageFormKey == 'image3'){
            this.uploadedImage3 = downloadUrl;
          }
          if(imageFormKey == 'image4'){
            this.uploadedImage4 = downloadUrl;
          }
          if(imageFormKey == 'image5'){
            this.uploadedImage5 = downloadUrl;
          }
        }
      );
     }, error => {
          console.error("Resize exact fill error:", error);
     });
  }

  deleteImage(id: Number){
    if(id === 2){
      this.uploadedImage2 = null;
      this.horseForm.controls.image2.patchValue('');
    }

    if(id === 3){
      this.uploadedImage3 = null;
      this.horseForm.controls.image3.patchValue('');
    }

    if(id === 4){
      this.uploadedImage4 = null;
      this.horseForm.controls.image4.patchValue('');
    }
  }

  onSubmit() {
    
    if(!this.horseForm.valid){ 
      this.invalidFormSubmit = true;
      return;
    }

    this.isSaving = true;
        
      if(this.doc != null){
        this.horseForm.value.uid = this.uid;

        if(this.horseForm.value.videoUrl){
          if(this.horseForm.value.videoUrl.split("v=").length > 0){
            this.horseForm.value.videoUrl = "https://www.youtube.com/embed/" + this.horseForm.value.videoUrl.split("v=")[1];
          }
        }
  
        this.doc.update(this.horseForm.value).then(x => {
          this.isSaving = false;
          this.selectedHorse = null;

          this.router.navigate(['/detail', this.horse.id]);
        });
      }
  
      else{
        this.horseForm.value.lastUpdated = Date.now();

        if(this.horseForm.value.videoUrl){
          if(this.horseForm.value.videoUrl.split("v=").length > 0){
            this.horseForm.value.videoUrl = "https://www.youtube.com/embed/" + this.horseForm.value.videoUrl.split("v=")[1];
          }
        }
        
        this.resetImagesIfNotDirty(this.horseForm);
        this.horse = this.horseForm.value;
        this.horse.uid = this.uid;
        this.horse.lastUpdated = Date.now();
        this.itemsCollection.add(this.horse).then(doc => {
          this.horse.id = doc.id;
          doc.update(this.horse).then(x => {
            this.isSaving = false;
            this.selectedHorse = null;
            
            this.router.navigate(['/profile/profileEditor']);
          });
        });  
      }
   //   })
    
  }

  private resetImagesIfNotDirty(horseForm: FormGroup){
    if(!this.horseForm.controls.image1.dirty){
      this.horseForm.controls.image1.patchValue('/assets/default.png');
    }
    if(!this.horseForm.controls.image2.dirty){
      this.horseForm.controls.image2.patchValue('');
    }
    if(!this.horseForm.controls.image3.dirty){
      this.horseForm.controls.image3.patchValue('');
    }
    if(!this.horseForm.controls.image4.dirty){
      this.horseForm.controls.image4.patchValue('');
    }
  }

  breedingAssmentChanged(){
    this.breedingAssement = !this.breedingAssement;    
  }
  ngOnInit() {
    document.body.scrollTop = 0;
    
    if(this.horse != null && this.horse.id != null){
      this.doc = this.afs.doc<Horse>("horses/" + this.horse.id + "/");
      
    }
    else{
      this.userInfo.subscribe(u => {
        if(u == null){
          return;
        }
        this.horseForm.patchValue({adressName: u.adressName});
        this.horseForm.patchValue({adressStreet: u.adressStreet}),
        this.horseForm.patchValue({adressPostcode: u.adressPostcode}),
        this.horseForm.patchValue({adressTelephone: u.adressTelephone}),
        this.horseForm.patchValue({adressEmail: u.adressEmail}),
        this.horseForm.patchValue({adressWeb: u.adressWeb}),
        this.horseForm.patchValue({adressCity: u.adressCity}),
        this.horseForm.patchValue({area: u.area})
      });
  
    }
    
  }
}

export const genderTypes = ['Hoppe', 'Hingst', 'Vallak'];
export const gaitTypes = ['4-gænger','4½-gænger', '5-gænger'];
export const horseCategory = ['Føl', 'Unghest', 'Hoppe', 'Hingst', 'Vallak'];
export const areaTypes = ['Sjælland', 'Fyn', 'Sønderjylland', 'Nordjylland', 'Midtjylland', 'Østjylland', 'Island', 'Andet land'];

