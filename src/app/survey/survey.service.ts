import { Injectable } from '@angular/core';
import { Survey } from '../models/survey.model';
import { Question } from '../models/question.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { take, map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SurveyService {
  survey: Survey;
  private _surveys = new BehaviorSubject<Survey[]>([
    new Survey(
      'Survey1',
      'Survey1 description',
      '2019-04-16T18:30:00+08:00',
      '2019-04-17T09:30:00+08:00',
      'https://images.techhive.com/images/article/2014/05/red-question-mark-165419798-100265543-primary.idge.jpg',
      [
        new Question(
          'Suervey 1 Question 1, What is Question1?',
          [
            'yes',
            'no',
            'maybe'
          ]),
        new Question(
          'Survey 1 Question 2, What is Question2?',
          [
            'left',
            'right',
          ])
      ]
    ),
    new Survey(
      'Survey2',
      'Survey2 description',
      '2019-03-01T16:30:00+08:00',
      '2019-04-05T10:30:00+08:00',
      'https://www.churchtimes.co.uk/media/5604506/out-of-the-question.jpg?anchor=center&mode=crop&width=605&height=292&rnd=131457274530000000',
      [
        new Question(
          'What is Question1?',
          [
            'left',
            'right',
            'center'
          ]),
        new Question(
          'What is Question2?',
          [
            'yes',
            'no',
            'maybe',
            'no comment'
          ]),
        new Question(
          'Suervey 2 Question 3, What is Question1?',
          [
            'yes',
            'no',
            'maybe'
          ]),
        new Question(
          'Survey 12 Question 4, What is Question2?',
          [
            'left',
            'right',
          ])
      ]
    ),

  ]);

  get surveys() {
    return this._surveys.asObservable();
  }

  constructor(private httpClient: HttpClient) { }

  getSurvey(id: number) {
    return this.surveys.pipe(
      take(1),
      map(surveys => {
        return { ...surveys[id] };
      })
    );
  }

  setSurvey(survey) {
    this.survey = survey;
  }

  updateSurvey(id: number, survey: Survey) {
    console.log('edited survey', survey)
    return this.surveys.pipe(
      take(1),
      map(surveys => {
        surveys[id] = survey;
      })
    );
  } 

  deleteSurvey(id: number) {
    return this.surveys.pipe(
      take(1),
      map(surveys => {
        surveys.splice(id, 1);
      })
    );
  }

  addSurvey(survey: Survey) {
    return this.surveys.pipe(
      take(1),
      map(surveys => {
        surveys.push(survey);
      })
    );
  }

}

