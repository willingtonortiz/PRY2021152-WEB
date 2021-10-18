import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemPreviewComponent } from './problem-preview.component';

describe('ProblemPreviewComponent', () => {
  let component: ProblemPreviewComponent;
  let fixture: ComponentFixture<ProblemPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProblemPreviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
