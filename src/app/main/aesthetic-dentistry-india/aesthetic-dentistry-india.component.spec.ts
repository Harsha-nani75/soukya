import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AestheticDentistryIndiaComponent } from './aesthetic-dentistry-india.component';

describe('AestheticDentistryIndiaComponent', () => {
  let component: AestheticDentistryIndiaComponent;
  let fixture: ComponentFixture<AestheticDentistryIndiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AestheticDentistryIndiaComponent]
    });
    fixture = TestBed.createComponent(AestheticDentistryIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
