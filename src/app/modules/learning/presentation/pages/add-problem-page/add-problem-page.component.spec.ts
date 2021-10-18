import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProblemPageComponent } from './add-problem-page.component';

describe('AddProblemPageComponent', () => {
  let component: AddProblemPageComponent;
  let fixture: ComponentFixture<AddProblemPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddProblemPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProblemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
