import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemDetailsPageComponent } from './problem-details-page.component';

describe('ProblemDetailsPageComponent', () => {
  let component: ProblemDetailsPageComponent;
  let fixture: ComponentFixture<ProblemDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProblemDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
