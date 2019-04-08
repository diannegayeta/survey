import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Survey } from '../models/survey.model';
import { SurveyService } from '../survey/survey.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-survey-item',
  templateUrl: './survey-item.page.html',
  styleUrls: ['./survey-item.page.scss'],
})
export class SurveyItemPage implements OnInit, OnDestroy {
  subscription: Subscription;
  survey: Survey;
  surveyId: number;
  userId: number;
  message: string;
  isValid = false;
  isAdmin = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    private authService: AuthService,
    ) { }

  ngOnInit() {
    this.isAdmin = this.authService.isAuthenticated();
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('surveyId') || !paramMap.has('userId')) {
          this.navCtrl.navigateBack('/survey');
          return;
        }
        this.surveyId = +paramMap.get('surveyId');
        this.userId = +paramMap.get('userId');
        this.getSurvey();
      }
      );
    }

  getSurvey() {
    this.subscription = this.surveyService.getSurvey(this.surveyId).subscribe(
      survey => {
        this.survey = survey;
        this.validSurveyFrom()
      }
    );
  }

  validSurveyFrom() {
    (new Date(this.survey.dateFrom) <= new Date()) ? this.validSurveyTo() : this.message = 'This survey is not yet available';
  }

  validSurveyTo() {
    (new Date(this.survey.dateTo) >= new Date()) ? this.isValid = true : this.message = 'This survey has already expired';
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
