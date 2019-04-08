import { Component, OnDestroy } from '@angular/core';
import { IonItemSliding, NavController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Survey } from '../models/survey.model';
import { SurveyService } from './survey.service';
import { User } from '../models/user.model';
import { UserService } from '../users/user.service';
import { UsersPage } from '../users/users.page';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnDestroy {
  isAdmin = true;
  users: User[];
  userId: number;
  surveys: Survey[];
  surveySub: Subscription;
  subscription: Subscription;

  constructor(
    private navCtrl: NavController,
    private surveyService: SurveyService,
    private userService: UserService,
    private alertCtrl: AlertController
  ) { }

  ionViewDidEnter() {
    this.getSurveyList();
    this.getUsers();
  }

  getSurveyList() {
    this.subscription = this.surveyService.getSurveys().subscribe(
      (surveys: Survey[]) => {
        this.surveys = surveys;
    });
  }

  getUsers() {
    this.subscription = this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      }
    );
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.navCtrl.navigateForward(`/survey/edit/${id}`);
  }

  deleteSurvey(surveyId: number) {
    this.subscription = this.surveyService.deleteSurvey(surveyId).subscribe(
      () => {
        this.getSurveyList();
      }
    );
    this.deleteUserSurvey(surveyId);
  }

  deleteUserSurvey(surveyId: number) {
    for (let i = 0; i < this.userService.userLength; i++) {
      this.subscription = this.userService.deleteUserSurvey(i, surveyId).subscribe(
        error => console.log(error)
      );
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onDeleteSurvey(surveyId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: `Do you really want to delete ${this.surveys[surveyId].title} survey?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteSurvey(surveyId);
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  onSend(surveyId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.alertCtrl.create({
      header: `${this.surveys[surveyId].title}`,
      message: `This survey will be sent to all participants`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Continue',
          handler: () => {
            this.sendSurvey(surveyId);
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  sendSurvey(surveyId: number) {
    this.users.forEach((user, i) => {
      if (user) {
          console.log(`Email sent to ${user.email} with http://localhost:8100/userSurvey/${i}/${surveyId} link`)
      }
    });

  }
}
