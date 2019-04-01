import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEditPage } from './survey-edit.page';

describe('SurveyEditPage', () => {
  let component: SurveyEditPage;
  let fixture: ComponentFixture<SurveyEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
