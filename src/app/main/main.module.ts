import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FooterComponent } from './footer/footer.component';
import { EldercareComponent } from './eldercare/eldercare.component';
import { BlogComponent } from './blog/blog.component';
import { FormsModule } from '@angular/forms';
import { MedicalTourismComponent } from './medicaltourism/medical-tourism.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { HeaderComponent } from './header/header.component';
import { HomeBannerSliderComponent } from '../home-banner-slider/home-banner-slider.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { TestimonialsHomeComponent } from './testimonials-home/testimonials-home.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    AboutUsComponent,
    ContactUsComponent,
    FooterComponent,
    EldercareComponent,
    MedicalTourismComponent,
    BlogComponent,
    MainLayoutComponent,
    HeaderComponent,
    HomeBannerSliderComponent,
    TestimonialsComponent,
    TestimonialsHomeComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,FormsModule,RecaptchaModule
  ]
})
export class MainModule { }
