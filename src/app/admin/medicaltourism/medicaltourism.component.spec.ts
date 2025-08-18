import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicaltourismComponent } from './medicaltourism.component';

describe('MedicaltourismComponent', () => {
  let component: MedicaltourismComponent;
  let fixture: ComponentFixture<MedicaltourismComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedicaltourismComponent]
    });
    fixture = TestBed.createComponent(MedicaltourismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
