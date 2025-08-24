import { Component, AfterViewInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-home-banner-slider',
  templateUrl: './home-banner-slider.component.html',
  styleUrls: ['./home-banner-slider.component.css']
})
export class HomeBannerSliderComponent implements AfterViewInit {
  current = 0;
  private intervalId: any;
  activeSlide: string = 'elder';
  slides = [
    {
      id: 'elder',
      image: 'assets/home/geriatric-care.jpg',
      alt: 'elder care',
      heading: 'Compassionate Care for Seniors',
      text: 'Elderly Care Providing Compassionate Support and Specialized Services.',
      headingClass: 'text-primary',
      sideTitle: 'ELDER CARE',
      sideText: 'Specialized Care for Seniors<br>Ensuring Comfort and Quality of Life',
      aosImage: { type: 'fade-down', duration: 1200 },
      aosCaption: { type: 'fade-right', delay: 500 }
    },
    {
      id: 'medical',
      image: 'assets/home/medical-tourism.jpg',
      alt: 'medical tourism',
      heading: 'Medical Tourism',
      text: 'Medical Tourism Seeking Treatment Beyond Borders for Better Care.',
      headingClass: 'text-danger',
      sideTitle: 'MEDICAL TOURISM',
      sideText: 'Quality Healthcare, Affordable Prices.<br>Explore Treatments with Expert Guidance',
      aosImage: { type: 'fade-up', duration: 1200 },
      aosCaption: { type: 'fade-left', delay: 500 }
    }
  ];

  ngOnit(){
    this.intervalId = setInterval(() => {
      this.current = (this.current + 1) % this.slides.length;
    }, 4000);

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

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: false, // animate every time it comes into view
    })
    this.onHomeRightSideContent()
  }


  refreshAOS() {
    setTimeout(() => AOS.refresh(), 100); // refresh AOS after slide transition
  }

  // setActive(slide: 'elder' | 'medical') {
  //   this.activeSlide = slide;
  // }

  setActive(id: string) {
    this.activeSlide = id;
  }
  onHomeRightSideContent(){
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
}
