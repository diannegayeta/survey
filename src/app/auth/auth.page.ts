import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  signinForm: FormGroup;
  errorMessage: string;

  constructor(
    private authService: AuthService,
      ) { }

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyB9B5N5Sa6ygx2EYA5W5pCW8WmMeWwbFgM",
      authDomain: "ng-http-9356b.firebaseapp.com",
    })

    this.signinForm = new FormGroup ({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    }) 

    this.authService.errorMessage.subscribe(
      (errorMessage: string) => {
        this.errorMessage = errorMessage;
      }
    )
  }

  onSubmit() {
    const email = this.signinForm.value['email'];
    const password = this.signinForm.value['password'];
    this.authService.signinUser(email, password);
    this.signinForm.reset();

  }
}
