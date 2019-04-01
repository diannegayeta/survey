import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController} from '@ionic/angular';
import { SurveyService } from '../../survey.service';
import { Survey } from '../../../models/survey.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-survey-questions',
  templateUrl: './survey-questions.page.html',
  styleUrls: ['./survey-questions.page.scss'],
})
export class SurveyQuestionsPage implements OnInit {
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
    ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('surveyId')) {
          // this.navCtrl.navigateBack('/survey');
          // return;
        } else {
          this.editMode = true;
          this.id = +paramMap.get('surveyId');
        }
        if (!this.surveyService.survey) {
          this.navCtrl.navigateBack('/survey');
        }
        this.survey = this.surveyService.survey;
        console.log(this.survey);
        this.setValue();
      }
    );
  }

  onSave() {
    this.survey.questions = this.questionForm.get('questions').value;
    console.log(this.survey);
    if (this.editMode) {
      this.surveyService.updateSurvey(this.id, this.survey).subscribe(
        error => {
          return console.log(error);
        }
      )
    } else {
      this.surveyService.addSurvey(this.survey).subscribe(
        error => {
          return console.log(error);
        }
      )
    }
    this.navCtrl.navigateBack('/survey');
  }

  setValue() {
    console.log('set value')
    if (this.editMode) {
      console.log(this.survey.questions)
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
    for(let questionChoice of question.questionChoices) {
      this.questionChoices.push(
         new FormControl(questionChoice, {
            updateOn: 'blur',
            validators: [Validators.required]
          })
      );
    }
  }

  pushFormValue() {
    this.questionsArray.push(
      new FormGroup({
        questionTitle: new FormControl(this.questionTitle, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
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
        questionTitle: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        questionChoices: new FormArray([new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        })])
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
        questionTitle: new FormControl(null, Validators.required),
        questionChoices: new FormArray(
          [
            new FormControl(null, {
            updateOn: 'blur',
            validators: [Validators.required],
          })])
      })
    );
  }

  onAddChoice(question) {
    (<FormArray>question.get('questionChoices')).push(
      new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    );
  }

  onDeleteQuestion(id: number) {
    (<FormArray>this.questionForm.get('questions')).removeAt(id);
  }

  onDeleteChoice(question, id: number) {
    (<FormArray>question.get('questionChoices')).removeAt(id);
  }


}
