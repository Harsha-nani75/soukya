import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalTourismComponent } from './medical-tourism.component';

describe('MedicalTourismComponent', () => {
  let component: MedicalTourismComponent;
  let fixture: ComponentFixture<MedicalTourismComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalTourismComponent]
    });
    fixture = TestBed.createComponent(MedicalTourismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
