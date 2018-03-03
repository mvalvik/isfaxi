import { Component, OnInit, HostBinding } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { moveIn } from '../router.animations';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  error: any;
  hasError: boolean;
  email: string;
  password: string;
  constructor(public af: AngularFireAuth,private router: Router) {
  }

  loginFb() {
    this.af.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(u => {
      if(u){
        this.router.navigateByUrl('/');
      }
      else{ alert("no user??" + u)}
    }).catch(
        (err) => {
          alert("error:" + err);
        this.error = err;
        console.log("Error:" + err);
      })
      
  }

  loginGoogle() {
    this.af.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then(
        (success) => {
        this.router.navigate(['/editor']);
      }).catch(
        (err) => {
        this.error = err;
      })
  }

  onSubmit(formData) {
    if(formData.valid) {
      console.log(formData.value);
      this.af.auth.signInWithEmailAndPassword(formData.value.email, formData.value.password).then(
        (success) => {
        console.log(success);
        this.router.navigate(['/editor']);
      }).catch(
        (err) => {
        console.log(err);
        this.hasError = true;
        this.error = err;
      })
    }
  }

  onSignUpSubmit(formData){
    if(formData.valid) {
      console.log(formData.value);
      this.af.auth.createUserWithEmailAndPassword(formData.value.email, formData.value.password).then(
        (success) => {
        this.router.navigate(['/editor'])
      }).catch(
        (err) => {
        this.error = err;
        this.hasError = true;
      })
    }
  }
}
