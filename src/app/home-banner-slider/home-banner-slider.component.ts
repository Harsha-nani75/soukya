import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home-banner-slider',
  templateUrl: './home-banner-slider.component.html',
  styleUrls: ['./home-banner-slider.component.css']
})
export class HomeBannerSliderComponent {
  activeSlide: 'elder' | 'medical' = 'elder';

  ngOnInit(): void {
    const carousel = document.getElementById('carouselExample');
    if (carousel) {
      carousel.addEventListener('slid.bs.carousel', () => {
        const activeItem = carousel.querySelector('.carousel-item.active');
        if (activeItem?.textContent?.includes('Compassionate Care')) {
          this.activeSlide = 'elder';
        } else {
          this.activeSlide = 'medical';
        }
      });
    }
  }

  setActive(slide: 'elder' | 'medical') {
    this.activeSlide = slide;
  }
}
