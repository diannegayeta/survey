import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SurveyQuestionsPage } from './survey-questions.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyQuestionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SurveyQuestionsPage]
})
export class SurveyQuestionsPageModule {}
