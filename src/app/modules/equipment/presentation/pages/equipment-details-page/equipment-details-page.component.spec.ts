import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentDetailsPageComponent } from './equipment-details-page.component';

describe('EquipmentDetailsPageComponent', () => {
  let component: EquipmentDetailsPageComponent;
  let fixture: ComponentFixture<EquipmentDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentDetailsPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
