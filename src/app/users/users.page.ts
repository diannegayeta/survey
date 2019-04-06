import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { NgForm } from '@angular/forms';
import { UserSurvey } from '../models/userSurvey.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit, OnDestroy {
  // user: User;
  users: User[];
  subscribe: Subscription;
  
  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.subscribe = this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );
  }

  onDeleteUser(id: number) {
    this.subscribe = this.userService.deleteUser(id).subscribe(
      () => this.getUsers()
    )
  }

  onSubmit(form: NgForm) {
    const newUser = new User(
      form.value.email,
      [new UserSurvey(false, [])]
    )
    this.userService.saveUser(newUser).subscribe(
      () => this.getUsers ()
    )
    form.reset();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe()
  }
}
