import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditorComponent } from './editor/editor.component';
import { HorsesListComponent } from './horsesList/horsesList.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { ProfileComponent } from './profile.component';
import { ProfileEditorComponent } from './profileEditor/profileEditor.component';


const profileRoutes: Routes = [
    {
      path: '',
      component: ProfileComponent,
      children: [
        {
          path: 'editor',
          component: EditorComponent,
          children: [
            {
              path: ':id',
              component: HorsesListComponent,
            },
            {
              path: '',
              component: HorsesListComponent
            }
          ]
        },
        {
          path: 'horsesList',
          component: HorsesListComponent
        },
        {
          path: 'profileEditor',
          component: ProfileEditorComponent
        }
      ]
    }
  ];

  @NgModule({
    imports: [
      RouterModule.forChild(profileRoutes)
    ],
    exports: [
      RouterModule
    ],
    providers: [
      //CrisisDetailResolver
    ]
  })
  export class ProfileRoutingModule { }