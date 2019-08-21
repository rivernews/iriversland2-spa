import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabeledSwitchComponent } from './labeled-switch.component';

describe('LabeledSwitchComponent', () => {
  let component: LabeledSwitchComponent;
  let fixture: ComponentFixture<LabeledSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabeledSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabeledSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
