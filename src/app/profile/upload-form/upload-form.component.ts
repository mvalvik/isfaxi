import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UploadService, Upload } from '../../upload-service.service'
import { FormControl, FormGroup, FormBuilder } from '@angular/forms'
import {Horse} from '../../horse'
import {ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import { UUID } from 'angular2-uuid';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css'],
})


export class UploadFormComponent implements OnInit {
  data: any;
  inputImage: any;
  cropperSettings: CropperSettings;
  fileName: string;

  @ViewChild('cropper', undefined)
  cropper:ImageCropperComponent;

  @Input('formGroup')
  public formGroup: FormGroup;

  @Input('imageFormKey')
  public imageFormKey: string;

  @Input('horse')
  public horse: Horse;
  constructor(private uploadService: UploadService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 800;
    this.cropperSettings.croppedHeight = 800;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.minWithRelativeToResolution = true;
    this.cropperSettings.noFileInput = true;
    this.data = {};
    this.data.image = '/assets/default.jpg';
   }

  selectedFiles: FileList;
  currentUpload: Upload;
  uploadTask: firebase.storage.UploadTask;
  editMode: boolean = true;

  detectFiles(event) {
      this.selectedFiles = event.target.files;
      this.uploadSingle();
  }

  ngOnChanges(){
    this.editMode = false;
    this.data.image = this.formGroup.get(this.imageFormKey).value
  }

  uploadSingle() {
      let filename = UUID.UUID() + "_" + this.fileName;
      this.currentUpload = new Upload(this.base64toBlob(this.data.image), filename);
      this.uploadTask = this.uploadService.pushUpload(this.currentUpload, this.formGroup, this.imageFormKey);
    
      this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) =>  {
          // upload in progress
        },
        (error) => {
          // upload failed
          console.log(error)
        },
        () => {
          // upload success
          this.currentUpload.url = this.uploadTask.snapshot.downloadURL;
          this.formGroup.get(this.imageFormKey).patchValue(this.currentUpload.url);
          this.formGroup.get(this.imageFormKey).markAsDirty();

          this.editMode = false;
        }
      );
  }
  
  setEditMode(){
    this.editMode = true;
  }

  submitFromForm(){
    if(this.data != null){
    }
  }

  fileChangeListener($event) {
    var image:any = new Image();
    var file:File = $event.target.files[0];
    this.fileName = file.name;
    var myReader:FileReader = new FileReader();
    var that = this;
    myReader.onload = function (loadEvent:any) {
      image.src = loadEvent.target.result;
      
      image.onload = function (imageEvent: any){
        that.cropper.setImage(image);

      }
    };

    myReader.readAsDataURL(file);
  }

  ngOnInit() {
  }

  base64toBlob(base64Data) {
    var contentType = base64Data.split(";")[0];
    var sliceSize = 1024;
    base64Data = base64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}

}
