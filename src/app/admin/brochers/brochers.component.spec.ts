import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrochersComponent } from './brochers.component';

describe('BrochersComponent', () => {
  let component: BrochersComponent;
  let fixture: ComponentFixture<BrochersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrochersComponent]
    });
    fixture = TestBed.createComponent(BrochersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
