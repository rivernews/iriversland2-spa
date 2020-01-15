import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorytellingHighlightComponent } from './storytelling-highlight.component';

describe('StorytellingHighlightComponent', () => {
  let component: StorytellingHighlightComponent;
  let fixture: ComponentFixture<StorytellingHighlightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorytellingHighlightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorytellingHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
