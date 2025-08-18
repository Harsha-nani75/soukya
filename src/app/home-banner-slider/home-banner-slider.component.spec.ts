import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBannerSliderComponent } from './home-banner-slider.component';

describe('HomeBannerSliderComponent', () => {
  let component: HomeBannerSliderComponent;
  let fixture: ComponentFixture<HomeBannerSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeBannerSliderComponent]
    });
    fixture = TestBed.createComponent(HomeBannerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
