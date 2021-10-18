import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTopicPageComponent } from './add-topic-page.component';

describe('AddTopicPageComponent', () => {
  let component: AddTopicPageComponent;
  let fixture: ComponentFixture<AddTopicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTopicPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTopicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
