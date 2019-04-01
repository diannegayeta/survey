import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { SurveyPage } from './survey.page';
import { SurveyRoutingModule } from './survey-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    SurveyRoutingModule
  ],
  declarations: [SurveyPage]
})
export class SurveyPageModule {}
