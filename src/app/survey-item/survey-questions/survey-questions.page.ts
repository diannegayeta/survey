import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormGroup, FormControl, Validators} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Survey } from 'src/app/models/survey.model';
import { User } from 'src/app/models/user.model';
import { UserSurvey } from 'src/app/models/userSurvey.model';
import { SurveyService } from 'src/app/survey/survey.service';
import { UserService } from 'src/app/users/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.page.html',
  styleUrls: ['./survey-questions.page.scss'],
})

export class SurveyQuestionsPage implements OnInit, OnDestroy {
  user: User;
  survey: Survey;
  surveyId: number;
  userId: number;
  answerForm: FormGroup;
  subscription: Subscription;
  answerArray = new FormArray([]);
  isDone = false;
  isUserSurvey = false;


  constructor(
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private userService: UserService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('surveyId') && paramMap.has('userId')) {
          this.surveyId = +paramMap.get('surveyId');
          this.userId = +paramMap.get('userId');
          this.getUserandSurvey();
          this.initForm();
        }
      }
    );
  }

  getUserandSurvey() {
    this.subscription = this.surveyService.getSurvey(this.surveyId).subscribe(
      survey => {
        this.survey = survey;
        this.getUser();
      }
    );
  }

  getUser() {
    this.subscription = this.userService.getUser(this.userId).subscribe(
      user => {
        this.user = user
        this.getUserSurvey()
      }
    );
  }

  getUserSurvey() {
    const userSurvey = this.user.survey[this.surveyId]
    if (userSurvey && userSurvey.answers) {
      this.isUserSurvey = true;
      this.isDone = userSurvey.surveyFlag;
      userSurvey.answers.forEach(answer => {
        this.pushFormValue(answer);
      });
    } else {
      this.survey.questions.forEach(el => {
        this.pushFormValue(null);
      });
      // this.user.survey[this.surveyId].surveyFlag = false;
    }
  }

  pushFormValue(answer: string) {
    this.answerArray.push(
      new FormControl(answer, [Validators.required])
    );
  }

  initForm() {
    this.answerForm = new FormGroup({
      answers: this.answerArray
    });
  }

  onSubmit() {
    if (this.isUserSurvey) {
      // if (this.user.survey[this.surveyId].surveyFlag) {return; }
      this.user.survey[this.surveyId].surveyFlag = this.answerForm.valid;
      this.user.survey[this.surveyId].answers = (<FormArray>this.answerForm.get('answers')).value;
    } else {
      this.createNewUserSurvey();
    }
    this.updateUser();
  }

  createNewUserSurvey() {
    const newSurvey = new UserSurvey(
      this.answerForm.valid,
      (<FormArray>this.answerForm.get('answers')).value
      );
      this.user.survey[this.surveyId] = newSurvey;
  }

  updateUser() {
      this.subscription = this.userService.updateUser(this.userId, this.user).subscribe(
        () => {
          console.log(`Email sent to ${this.user.email} with "You have completed ${this.survey.title} survey"`);
          this.navCtrl.navigateBack(`/userSurvey/${this.userId}/${this.surveyId}`);
        }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
