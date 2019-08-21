import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLangSystemComponent } from './design-lang-system.component';

describe('DesignLangSystemComponent', () => {
  let component: DesignLangSystemComponent;
  let fixture: ComponentFixture<DesignLangSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignLangSystemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLangSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
