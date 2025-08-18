import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CosmeticAndPlasticSurgeryIndiaComponent } from './cosmetic-and-plastic-surgery-india.component';

describe('CosmeticAndPlasticSurgeryIndiaComponent', () => {
  let component: CosmeticAndPlasticSurgeryIndiaComponent;
  let fixture: ComponentFixture<CosmeticAndPlasticSurgeryIndiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CosmeticAndPlasticSurgeryIndiaComponent]
    });
    fixture = TestBed.createComponent(CosmeticAndPlasticSurgeryIndiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
