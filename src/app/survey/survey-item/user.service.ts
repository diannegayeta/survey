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

  private _users = new BehaviorSubject<User[]>([
      new User(
      'test@test.com',
      [
        new UserSurvey(
          true,
          [
              'no',
              'right'
          ]
        ),
        new UserSurvey(
          false,
          [
              'center',
              null,
              'no',
              'right'
          ]
        ),
      ]
    ),
    new User(
      'test1@test.com',
      [
        new UserSurvey(
          true,
          [
              'yes',
              'right'
          ]
        ),
      ]
    )

  ]);

  get users() {
    return this._users.asObservable();
  }

  constructor(private httpClient: HttpClient ) { }

  getUser(userId: number,) {
    return this.users.pipe(
      take(1),
      map(users => {
        return { ...users[userId] };
      })
    );
  }

  updateUser(id: number, user: User) {
    return this.users.pipe(
      take(1),
      map(users => {
        users[id] = user;
      })
    );
  }

}


