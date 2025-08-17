import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EldercareComponent } from './eldercare.component';

describe('EldercareComponent', () => {
  let component: EldercareComponent;
  let fixture: ComponentFixture<EldercareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EldercareComponent]
    });
    fixture = TestBed.createComponent(EldercareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
