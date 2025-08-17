import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
// import { NavbarComponent } from './navbar/navbar.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
// import { GenralenquiryComponent } from './genralenquiry/genralenquiry.component';
// import { GenticcareComponent } from './genticcare/genticcare.component';
// import { TestmonialsComponent } from './testmonials/testmonials.component';
// import { MedicaltourismComponent } from './medicaltourism/medicaltourism.component';
// import { PackagesComponent } from './packages/packages.component';
// import { BrochersComponent } from './brochers/brochers.component';
// import { BlogsComponent } from './blogs/blogs.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DashboardComponent,
    // NavbarComponent,
    // SidebarComponent,
    // GenralenquiryComponent,
    // GenticcareComponent,
    // TestmonialsComponent,
    // MedicaltourismComponent,
    // PackagesComponent,
    // BrochersComponent,
    // BlogsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
