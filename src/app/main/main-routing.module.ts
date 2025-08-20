import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
import { EldercareComponent } from './eldercare/eldercare.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MedicalTourismComponent } from './medicaltourism/medical-tourism.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,   
    children: [
      { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutUsComponent },
  {path: 'contact-us', component: ContactUsComponent },
  {path: 'eldercare', component: EldercareComponent },
  {path: 'medical-tourism', component:  MedicalTourismComponent},

  {path:'home', component:HomeComponent},
  { path: 'blog', component: BlogComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
