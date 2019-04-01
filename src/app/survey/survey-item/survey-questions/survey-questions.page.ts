import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../survey.service';
import { Survey } from 'src/app/models/survey.model';
import { FormArray, FormGroup, FormControl, Validators} from '@angular/forms';
import { UserService } from '../user.service';
import { User } from 'src/app/models/user.model';
import { UserSurvey } from 'src/app/models/userSurvey.model';

@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.page.html',
  styleUrls: ['./survey-questions.page.scss'],
})

export class SurveyQuestionsPage implements OnInit {
  user: User;
  survey: Survey;
  surveyId: number;
  userId: number;
  answerForm: FormGroup;
  answerArray = new FormArray([]);
  isDone = false;
  isUserSurvey = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('surveyId') && paramMap.has('userId')) {
          this.surveyId = +paramMap.get('surveyId');
          this.userId = +paramMap.get('userId');
          this.getUserandSurvey();
          this.getUserSurvey();
          this.initForm();
        }
      }
    );
  }

  getUserandSurvey() {
    this.surveyService.getSurvey(this.surveyId).subscribe(
      survey => this.survey = survey
    );
    this.userService.getUser(this.userId).subscribe(
      user => this.user = user
    );
  }

  getUserSurvey() {
    const userSurvey = this.user.survey[this.surveyId];
    if (userSurvey) {
      this.isUserSurvey = true;
      this.isDone = userSurvey.surveyFlag;
      userSurvey.answers.forEach(answer => {
        this.pushFormValue(answer);
      });
    } else {
      this.survey.questions.forEach(el => {
        this.pushFormValue(null);
      })
    }
  }

  pushFormValue(answer: string) {
    this.answerArray.push(
      new FormControl(answer, [Validators.required])
    )
  }

  initForm() {
    this.answerForm = new FormGroup({
      answers: this.answerArray
    });
  }

  onSubmit() {
    if (this.isUserSurvey) {
      if (this.user.survey[this.surveyId].surveyFlag) {return; }
      this.user.survey[this.surveyId].surveyFlag = this.answerForm.valid;
      this.user.survey[this.surveyId].answers = (<FormArray>this.answerForm.get('answers')).value;
    } else {
      this.createNewUserSurvey();
    }
  }

  createNewUserSurvey() {
    const newSurvey = new UserSurvey(
      this.answerForm.valid,
      (<FormArray>this.answerForm.get('answers')).value
    )
    this.user.survey[this.surveyId] = newSurvey;
  }

  onUpdateUser() {
    this.userService.updateUser(this.userId, this.user).subscribe(
      error => {
        return console.log(error);
      }
    )
  }

}
