import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTimeComponent } from './new-time.component';

describe('NewTimeComponent', () => {
  let component: NewTimeComponent;
  let fixture: ComponentFixture<NewTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
