import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenralenquiryComponent } from './genralenquiry.component';

describe('GenralenquiryComponent', () => {
  let component: GenralenquiryComponent;
  let fixture: ComponentFixture<GenralenquiryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenralenquiryComponent]
    });
    fixture = TestBed.createComponent(GenralenquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
