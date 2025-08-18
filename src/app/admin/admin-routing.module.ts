import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GenralenquiryComponent } from './genralenquiry/genralenquiry.component';
import { authGuard } from '../services/auth.guard';
import { roleGuard } from '../services/role.guard';
import { MedicaltourismComponent } from './medicaltourism/medicaltourism.component';
import { GenticcareComponent } from './genticcare/genticcare.component';
import { BlogsComponent } from './blogs/blogs.component';
import { LayoutComponent } from './layout/layout.component';
import { PackagesComponent } from './packages/packages.component';
import { PtViewComponent } from './pt-view/pt-view.component';

const routes: Routes = [
    {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard, roleGuard],  // ✅ Protect all child routes
    data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'medicaltourism', component: MedicaltourismComponent },
      { path: 'gentic', component: GenticcareComponent },
      { path: 'ptview/:id', component: PtViewComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'generalenq', component: GenralenquiryComponent },
      { path: 'blog', component: BlogsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
