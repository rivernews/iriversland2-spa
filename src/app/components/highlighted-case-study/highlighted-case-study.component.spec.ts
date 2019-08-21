import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightedCaseStudyComponent } from './highlighted-case-study.component';

describe('HighlightedCaseStudyComponent', () => {
  let component: HighlightedCaseStudyComponent;
  let fixture: ComponentFixture<HighlightedCaseStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightedCaseStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightedCaseStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
