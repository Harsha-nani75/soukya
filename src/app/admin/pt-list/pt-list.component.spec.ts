import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtListComponent } from './pt-list.component';

describe('PtListComponent', () => {
  let component: PtListComponent;
  let fixture: ComponentFixture<PtListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PtListComponent]
    });
    fixture = TestBed.createComponent(PtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
