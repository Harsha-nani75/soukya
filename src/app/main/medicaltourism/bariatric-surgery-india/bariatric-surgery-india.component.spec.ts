import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BariatricSurgeryIndiaComponent } from './bariatric-surgery-india.component';

describe('BariatricSurgeryIndiaComponent', () => {
  let component: BariatricSurgeryIndiaComponent;
  let fixture: ComponentFixture<BariatricSurgeryIndiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BariatricSurgeryIndiaComponent]
    });
    fixture = TestBed.createComponent(BariatricSurgeryIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
