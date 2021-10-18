import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipmentPageComponent } from './add-equipment-page.component';

describe('AddEquipmentPageComponent', () => {
  let component: AddEquipmentPageComponent;
  let fixture: ComponentFixture<AddEquipmentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEquipmentPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEquipmentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
