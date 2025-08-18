import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardiacSurgeryIndiaComponent } from './cardiac-surgery-india.component';

describe('CardiacSurgeryIndiaComponent', () => {
  let component: CardiacSurgeryIndiaComponent;
  let fixture: ComponentFixture<CardiacSurgeryIndiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardiacSurgeryIndiaComponent]
    });
    fixture = TestBed.createComponent(CardiacSurgeryIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
