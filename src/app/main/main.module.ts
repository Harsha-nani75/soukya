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
import { MedicaltourismComponent } from './medicaltourism/medicaltourism.component';
import { BlogComponent } from './blog/blog.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    AboutUsComponent,
    ContactUsComponent,
    FooterComponent,
    EldercareComponent,
    MedicaltourismComponent,
    BlogComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,FormsModule
  ]
})
export class MainModule { }
