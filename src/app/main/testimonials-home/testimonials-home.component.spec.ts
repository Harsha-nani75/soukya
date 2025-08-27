import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialsHomeComponent } from './testimonials-home.component';

describe('TestimonialsHomeComponent', () => {
  let component: TestimonialsHomeComponent;
  let fixture: ComponentFixture<TestimonialsHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestimonialsHomeComponent]
    });
    fixture = TestBed.createComponent(TestimonialsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
