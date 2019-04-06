import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyPage } from './survey.page';

const routes: Routes = [
  {path: '', children: [
    {path: '', component: SurveyPage},
    
    {path: 'new', children: [
      {path: '', loadChildren: './survey-edit/survey-edit.module#SurveyEditPageModule'},
      {path: 'questions', loadChildren: './survey-edit/survey-questions/survey-questions.module#SurveyQuestionsPageModule' },
    ]},
    
    {path: 'edit', children: [
      {path: 'questions/:surveyId', loadChildren: './survey-edit/survey-questions/survey-questions.module#SurveyQuestionsPageModule' },
      {path: ':surveyId', loadChildren: './survey-edit/survey-edit.module#SurveyEditPageModule'},
    ]},
    
    // {path: ':userId', children: [
    //   {path: 'questions/:surveyId', loadChildren: './survey-item/survey-questions/survey-questions.module#SurveyQuestionsPageModule' },
    //   {path: ':surveyId', loadChildren: './survey-item/survey-item.module#SurveyItemPageModule'},
    // ]}
    
  ]},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule {}