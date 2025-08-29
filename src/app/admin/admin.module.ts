import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { GenralenquiryComponent } from './genralenquiry/genralenquiry.component';
import { GenticcareComponent } from './genticcare/genticcare.component';
import { TestmonialsComponent } from './testmonials/testmonials.component';
import { MedicaltourismComponent } from './medicaltourism/medicaltourism.component';
import { PackagesComponent } from './packages/packages.component';
import { BrochersComponent } from './brochers/brochers.component';
import { BlogsComponent } from './blogs/blogs.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './layout/layout.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { PtViewComponent } from './pt-view/pt-view.component';
import { PtListComponent } from './pt-list/pt-list.component';

@NgModule({
  declarations: [
    DashboardComponent,
    NavbarComponent,
    SidebarComponent,
    GenralenquiryComponent,
    GenticcareComponent,
    TestmonialsComponent,
    MedicaltourismComponent,
    PackagesComponent,
    BrochersComponent,
    BlogsComponent,
    LayoutComponent,
    PtViewComponent,
    PtListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,NgxPaginationModule,FormsModule,NgChartsModule,ReactiveFormsModule,CommonModule
  ]
})
export class AdminModule { }
