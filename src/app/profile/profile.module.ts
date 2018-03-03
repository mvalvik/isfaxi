import { NgModule }       from '@angular/core';
import { FormsModule }    from '@angular/forms';
import { CommonModule }   from '@angular/common';
import { SuiModule} from 'ng2-semantic-ui';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { EditorComponent } from './editor/editor.component'
import { HorsesListComponent } from './horsesList/horsesList.component';
import { UploadFormComponent } from './upload-form/upload-form.component'
import { ProfileEditorComponent } from './profileEditor/profileEditor.component'


import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent }     from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ImageCropperModule } from 'ng2-img-cropper/src/imageCropperModule';

import { Ng2ImgToolsService, Ng2ImgToolsModule } from 'ng2-img-tools';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProfileRoutingModule,
    SuiModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ImageCropperModule,
    Ng2ImgToolsModule

  ],
  declarations: [ 
    ProfileComponent,
    EditorComponent,
    HorsesListComponent,
    UploadFormComponent,
    ProfileEditorComponent
  ],
  providers: [    
  ]
})
export class ProfileModule {}