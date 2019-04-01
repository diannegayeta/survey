import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { IonItemSliding, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Survey } from '../models/survey.model';
import { SurveyService } from './survey.service';
import { User } from '../models/user.model';
import { UserService } from './survey-item/user.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
  // isValid = false;
  isAdmin = true;
  user: User;
  userId: number;
  surveys: Survey[];
  validSurvey: Survey[] = [];
  subscription: Subscription;
  currDate = new Date().getTime();

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private userService: UserService) { }

  ngOnInit() {
    this.getSurveyList();
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('userId')) {
          this.navCtrl.navigateBack('/auth');
          return;
        }
        this.userId = +paramMap.get('userId');
        this.getUser();
      }
    );
  }

  getUser() {
    this.userService.getUser(this.userId).subscribe(
      user => this.user = user
    );
  }

  getSurveyList() {
    this.subscription = this.surveyService.surveys.subscribe(
      surveys => this.surveys = surveys
    );
    this.validSurvey = this.surveys;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    switch(event.detail.value){
      case 'all':       this.filterValidSurvey();
                        console.log(this.validSurvey);
                        break;
      case 'inProgress': this.filterInProgressSurvey();
                        console.log('inProgress');
                        break;
      case 'completed':
                        this.filterCompletedSurvey();
                        console.log('completed');
                        break;
    }
  }

  onEdit(id: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.navCtrl.navigateForward(`/survey/edit/${id}`);
  }

  onDeleteSurvey(id: number) {
    this.surveyService.deleteSurvey(id).subscribe(
      (error) => console.log(error)
    );
  }

  filterValidSurvey() {
    this.validSurvey = [];
    this.surveys.forEach(s => {
      if (s) {
        const dateFrom = new Date(s.dateFrom).getTime();
        const dateTo = new Date(s.dateTo).getTime();
        if (dateFrom <= this.currDate && dateTo >= this.currDate) {
          this.validSurvey.push(s);
        } else {
          this.validSurvey.push(null);
        }
      } else {
        this.validSurvey.push(null);
      }
    });
    this.surveys = this.validSurvey;
  }

  filterCompletedSurvey() {
    this.validSurvey = [];
    this.user.survey.forEach((s, i) => {
      if (s.surveyFlag === true) {
        this.validSurvey.push(this.surveys[i]);
      }
    });
  }

  filterInProgressSurvey() {
    this.validSurvey = [];
    this.user.survey.forEach((s, i) => {
      if (s.surveyFlag === false) {
        this.validSurvey.push(this.surveys[i]);
      }
    });
  }
}
