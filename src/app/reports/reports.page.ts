import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../survey/survey.service';
import { Survey } from '../models/survey.model';
import { UserService } from '../users/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  surveys: Survey[];
  users: User[];
  total: number;
  completed = [];

  constructor(
    private surveyService: SurveyService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.getSurveys();
  }

  getSurveys() {
    this.surveyService.getSurveys().subscribe(
      (surveys: Survey[]) => {
         this.surveys = surveys;
         this.getUsers();
      }
    );
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
         this.users = users;
         this.total = users.filter(user => user != null).length;
         this.completedSurvey();
      }
    );
  }

  completedSurvey() {
    let comp = [];
    this.surveys.forEach((survey, i) => {
      if (survey) {
          comp = this.users.filter((user ,j) => {
          if (user && user.survey[i] && user.survey[i].answers ) {
            return user.survey[i].surveyFlag === true;
          } else {
            return false;
          }
        });
      }
      this.completed.push(comp.length);
    });
  }

  onUpdate() {
    this.init();
  }
}
