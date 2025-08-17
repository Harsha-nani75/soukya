import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenticcareComponent } from './genticcare.component';

describe('GenticcareComponent', () => {
  let component: GenticcareComponent;
  let fixture: ComponentFixture<GenticcareComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenticcareComponent]
    });
    fixture = TestBed.createComponent(GenticcareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
