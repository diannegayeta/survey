import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'survey', pathMatch: 'full' },
  { path: 'survey', loadChildren: './survey/survey.module#SurveyPageModule', canLoad: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsPageModule', canLoad: [AuthGuard]  },
  { path: 'users', loadChildren: './users/users.module#UsersPageModule', canLoad: [AuthGuard] },
  {path: 'userSurvey/:userId', children: [
    {path: ':surveyId', loadChildren: './survey-item/survey-item.module#SurveyItemPageModule'},
    {path: 'questions/:surveyId', loadChildren: './survey-item/survey-questions/survey-questions.module#SurveyQuestionsPageModule' },
  ]},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
