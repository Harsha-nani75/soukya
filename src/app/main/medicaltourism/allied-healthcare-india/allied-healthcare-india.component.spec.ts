import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlliedHealthcareIndiaComponent } from './allied-healthcare-india.component';

describe('AlliedHealthcareIndiaComponent', () => {
  let component: AlliedHealthcareIndiaComponent;
  let fixture: ComponentFixture<AlliedHealthcareIndiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlliedHealthcareIndiaComponent]
    });
    fixture = TestBed.createComponent(AlliedHealthcareIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
