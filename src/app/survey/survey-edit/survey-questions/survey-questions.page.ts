import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController} from '@ionic/angular';
import { SurveyService } from '../../survey.service';
import { Survey } from '../../../models/survey.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/users/user.service';


@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.page.html',
  styleUrls: ['./survey-questions.page.scss'],
})
export class SurveyQuestionsPage implements OnInit, OnDestroy {
  questionForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  survey: Survey;
  id: number;

   questionsArray = new FormArray([]);
   questionTitle = '';
   questionChoices: FormArray;

  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveyService,
    private userService: UserService,
    private alertCtrl: AlertController
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (paramMap.has('surveyId')) {
          this.editMode = true;
          this.id = +paramMap.get('surveyId');
          this.getSurvey();
        } else {
          if (!this.surveyService.survey) {
            this.navCtrl.navigateBack('/survey');
          }
          this.survey = this.surveyService.survey;
          this.setValue();
        }
      }
    );
  }

  getSurvey() {
    this.surveyService.getSurvey(this.id).subscribe(
      (survey: Survey) => {
        this.survey = survey;
        this.setValue();
      }
    );
  }

  onSave() {
    this.survey.questions = this.questionForm.get('questions').value;
    this.editMode ? this.alert() : this.addSurvey();
  }

  alert() {
    this.alertCtrl.create({
      header: 'Warning!',
      message: 'Updating this questionnaire will delete all responses for this survey',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Continue',
          handler: () => {
            this.updateSurvey();
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  updateSurvey() {
    this.deleteUserSurvey();
    this.subscription = this.surveyService.updateSurvey(this.id, this.survey).subscribe(
      () => this.navCtrl.navigateBack('/survey')
    );
  }

  deleteUserSurvey() {
    for (let i = 0; i < this.userService.userLength; i++) {
      this.subscription = this.userService.deleteUserSurvey(i, this.id).subscribe(
        error => console.log(error)
      );
    }
  }

  addSurvey() {
    this.subscription = this.surveyService.addSurvey(this.survey).subscribe(
      () => this.navCtrl.navigateBack('/survey')
    );
  }

  onReset() {
    const len = this.questionsArray.length;
    for (let i = 0; i < len; i++) {
      this.onDeleteQuestion(0);
    }
    this.setValue();
  }

  setValue() {
    if (this.editMode) {
      for (const question of this.survey.questions) {
        this.questionTitle = question.questionTitle;
        if (question.questionChoices) {
          this.parseQuestion(question);
        }
        this.pushFormValue();
      }
    } else {
      this.initNewForm();
    }
    this.initForm();
  }

  parseQuestion(question) {
    this.questionChoices = new FormArray([]);
    for (const questionChoice of question.questionChoices) {
      this.questionChoices.push(
         new FormControl(questionChoice, [Validators.required])
      );
    }
  }

  pushFormValue() {
    this.questionsArray.push(
      new FormGroup({
        questionTitle: new FormControl(this.questionTitle, [Validators.required]),
        questionChoices: this.questionChoices
      })
    );
  }

  initForm() {
    this.questionForm = new FormGroup({
      questions: this.questionsArray
    });
  }

  initNewForm() {
    this.questionsArray.push(
      new FormGroup({
        questionTitle: new FormControl(null, [Validators.required]),
        questionChoices: new FormArray([new FormControl(null, [Validators.required])])
      })
    );
  }

  getQuestionsControls() {
    return (<FormArray>this.questionForm.get('questions')).controls;
  }

  getChoiceControls(question) {
    return (<FormArray>question.get('questionChoices')).controls;
  }

  onAddQuestion() {
    (<FormArray>this.questionForm.get('questions')).push(
      new FormGroup({
        questionTitle: new FormControl(null, [Validators.required]),
        questionChoices: new FormArray([new FormControl(null, [Validators.required])])
      })
    );
  }

  onAddChoice(question) {
    (<FormArray>question.get('questionChoices')).push(
      new FormControl(null, [Validators.required])
    );
  }

  onDeleteQuestion(id: number) {
    (<FormArray>this.questionForm.get('questions')).removeAt(id);
  }

  onDeleteChoice(question, id: number) {
    (<FormArray>question.get('questionChoices')).removeAt(id);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
