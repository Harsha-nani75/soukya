import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogComponent } from './blog/blog.component';
// import { MedicaltourismComponent } from './medicaltourism/medicaltourism.component';
import { EldercareComponent } from './eldercare/eldercare.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

const routes: Routes = [
   { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutUsComponent },
  {path: 'contact-us', component: ContactUsComponent },
  {path: 'eldercare', component: EldercareComponent },
  // {path: 'medical-tourism', component: MedicaltourismComponent },
  { path: 'blog', component: BlogComponent }
  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
