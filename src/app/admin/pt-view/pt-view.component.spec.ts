import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtViewComponent } from './pt-view.component';

describe('PtViewComponent', () => {
  let component: PtViewComponent;
  let fixture: ComponentFixture<PtViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PtViewComponent]
    });
    fixture = TestBed.createComponent(PtViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
