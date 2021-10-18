import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemiesPageComponent } from './enemies-page.component';

describe('EnemiesPageComponent', () => {
  let component: EnemiesPageComponent;
  let fixture: ComponentFixture<EnemiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnemiesPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
