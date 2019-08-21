import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorRolesComponent } from './major-roles.component';

describe('MajorRolesComponent', () => {
  let component: MajorRolesComponent;
  let fixture: ComponentFixture<MajorRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MajorRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MajorRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
