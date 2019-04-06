import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    token: string;
    errorMessage = new Subject<string>();

    constructor(private router: Router) {};

    signupUser(email: string, password: string) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(
            response => {
                console.log(response)
                this.signinUser(email, password);
            }
        )
        .catch(
            error => {
            console.log(error.message)
            this.errorMessage.next(error.message)
            }
        )
    }

    signinUser(email: string, password: string) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
            response => {
                this.router.navigate(['/survey']);
                firebase.auth().currentUser.getIdToken()
                    .then(
                        (token: string) => this.token = token
                    )
            }
        )
        .catch(
            error => this.errorMessage.next(error.message)
        );
    }

    logout() {
        firebase.auth().signOut();
        this.token = null;
        this.router.navigate(['/auth']);
    }

    isAuthenticated() {
        return this.token != null;
    }

}