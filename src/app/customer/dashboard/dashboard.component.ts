import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
 constructor(public auth: AuthService, private router: Router) {}
   onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
