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
  minDate: string;
  maxDate: string;
  survey: Survey;
  id: number;
  editMode = false;
  currDate = new Date().getTime();

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private surveyService: SurveyService,
    ) { }

  ngOnInit() {
      this.initForm();
      this.getDate();
      this.getSurveyId();
  }

  initForm() {
    this.surveyForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(180)]),
      dateFrom: new FormControl(null, [Validators.required]),
      dateTo: new FormControl(null, [Validators.required]),
      imgUrl: new FormControl(null, [Validators.required]),
    });
  }

  getDate() {
    const currDate = new Date();
    this.minDate = currDate.toISOString();
    this.maxDate = new Date(currDate.setFullYear(currDate.getFullYear() + 1)).toISOString();
  }

  getSurveyId() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('surveyId')) {
        this.editMode = true;
        this.id = +paramMap.get('surveyId');
        this.getSurvey();
        }
      }
    );
  }

  getSurvey() {
    this.subscription = this.surveyService.getSurvey(this.id).subscribe(
      survey => {
        this.survey = survey;
        this.setpatch();
      }
    );
  }

  setpatch() {
    this.surveyForm.patchValue({
      title: this.survey.title,
      description: this.survey.description,
      dateFrom: this.survey.dateFrom,
      dateTo: this.survey.dateTo,
      imgUrl: this.survey.imgUrl
    });
  }

  onNext() {
    if (this.editMode) {
      this.navCtrl.navigateForward(`/survey/edit/questions/${this.id}`);
    } else {
      this.navCtrl.navigateForward(`/survey/new/questions`);
    }
  }

  onReset() {
    this.editMode? this.getSurvey() : this.surveyForm.reset();
  }

  onSave() {
    if (this.editMode) {
      const question = this.survey.questions;
      this.survey = this.surveyForm.value;
      this.survey.questions = question;
      this.updateSurvey();
    } else {
      this.survey = this.surveyForm.value;
      this.survey.questions = [];
      this.surveyService.survey = this.survey;
    }
  }

  updateSurvey() {
    this.surveyService.updateSurvey(this.id, this.survey).subscribe(
      () => this.getSurvey()
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
