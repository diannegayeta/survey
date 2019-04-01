import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyItemPage } from './survey-item.page';

describe('SurveyItemPage', () => {
  let component: SurveyItemPage;
  let fixture: ComponentFixture<SurveyItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
