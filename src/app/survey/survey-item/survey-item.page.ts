import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Survey } from '../../models/survey.model';
import { SurveyService } from '../survey.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-survey-item',
  templateUrl: './survey-item.page.html',
  styleUrls: ['./survey-item.page.scss'],
})
export class SurveyItemPage implements OnInit {
  subscription: Subscription;
  survey: Survey;
  id: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('surveyId')) {
          this.navCtrl.navigateBack('/survey');
          return;
        }
        this.id = +paramMap.get('surveyId')
        this.subscription = this.surveyService.getSurvey(this.id).subscribe(
          survey => this.survey = survey
        );
      }
    );
  }

}
