import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SurveyService } from '../survey.service';
import { Survey } from '../../models/survey.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-survey-edit',
  templateUrl: './survey-edit.page.html',
  styleUrls: ['./survey-edit.page.scss'],
})
export class SurveyEditPage implements OnInit, OnDestroy {
  surveyForm: FormGroup;
  subscription: Subscription;
  survey: Survey;
  id: number;
  editMode = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('surveyId')) {
          this.editMode = true;
          this.id = +paramMap.get('surveyId')
          this.subscription = this.surveyService.getSurvey(this.id).subscribe(
            survey => {
              this.survey = survey;
            }
          );
        }
        this.initForm();
      }
    );
  }

  initForm() {
    let surveyTitle = '';
    let surveyDescription = '';
    let surveyDateFrom = '';
    let surveyDateTo = '';
    let surveyImgUrl = '';

    if (this.editMode) {
      surveyTitle = this.survey.title;
      surveyDescription = this.survey.description;
      surveyDateFrom = this.survey.dateFrom;
      surveyDateTo = this.survey.dateTo;
      surveyImgUrl = this.survey.imgUrl;
    }

    this.surveyForm = new FormGroup({
      title: new FormControl(surveyTitle, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(surveyDescription, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateFrom: new FormControl(surveyDateFrom, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(surveyDateTo, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      imgUrl: new FormControl(surveyImgUrl, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
    });
  }

  onNext() {
    this.setValue();
    console.log(this.survey)
    if (this.editMode) {
      this.navCtrl.navigateForward(`/survey/edit/questions/${this.id}`);
    } else {
      this.navCtrl.navigateForward(`/survey/new/questions`);
    }
  }

  setValue() {
    if (this.editMode) {
      const question = this.survey.questions;
      this.survey = this.surveyForm.value;
      this.survey.questions = question;
    } else {
      this.survey = this.surveyForm.value;
      this.survey.questions = [];
    }
    this.surveyService.survey = this.survey;
  }

  ngOnDestroy() {
    console.log('ondestroy');
    // this.subscription.unsubscribe()
  }

}
