import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { UserSurvey } from 'src/app/models/userSurvey.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userLength = 0;

  constructor(private httpClient: HttpClient ) { }

  getUsers() {
    return this.httpClient.get<User[]>(`https://ng-http-9356b.firebaseio.com/users.json` )
    .pipe(map(
      (users: User[]) => {
        if (users) {
          this.userLength = users.length;
        }
        return users;
      }
    ));
  }

  getUser(id: number) {
    return this.httpClient.get<User>(`https://ng-http-9356b.firebaseio.com/users/${id}.json` )
    .pipe(map(
        (user: User) => {
          return user;
        }
    ));
  }

  updateUser(id: number, user: User) {
    return this.httpClient.put<User>(`https://ng-http-9356b.firebaseio.com/users/${id}.json`, user)
  }

  saveUser(user: User) {
    return this.httpClient.put<User>(`https://ng-http-9356b.firebaseio.com/users/${this.userLength}.json`, user)
  }

  deleteUser(userId: number) {
    return this.httpClient.delete<User>(`https://ng-http-9356b.firebaseio.com/users/${userId}.json`)
  }

  deleteUserSurvey(userId: number, surveyId: number) {
    return this.httpClient.delete<User>(`https://ng-http-9356b.firebaseio.com/users/${userId}/survey/${surveyId}/answers.json`)
  }

}
