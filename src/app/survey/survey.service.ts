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
  surveyLenght = 0;

  constructor(private httpClient: HttpClient) { }

  getSurveys() {
    return this.httpClient.get<Survey[]>(`https://ng-http-9356b.firebaseio.com/survey.json` )
    .pipe(map(
        (survey: Survey[]) => {
          if (survey) {
            this.surveyLenght = survey.length;
          }
          return survey;
        }
    ));
  }

  getSurvey(id: number) {
    return this.httpClient.get<Survey>(`https://ng-http-9356b.firebaseio.com/survey/${id}.json` )
    .pipe(map(
        (survey: Survey) => {
          return survey;
        }
    ));
  }

  setSurvey(survey) {
    this.survey = survey;
  }

  updateSurvey(id: number, survey: Survey) {
    return this.httpClient.put<Survey>(`https://ng-http-9356b.firebaseio.com/survey/${id}.json`, survey)
  }

  deleteSurvey(id: number) {
    return this.httpClient.delete<Survey>(`https://ng-http-9356b.firebaseio.com/survey/${id}.json`)
  }

  addSurvey(survey: Survey) {
    return this.httpClient.put<Survey>(`https://ng-http-9356b.firebaseio.com/survey/${this.surveyLenght}.json`, survey)
  }

}

