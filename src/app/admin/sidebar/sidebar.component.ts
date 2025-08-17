import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  activeMenu: string | null = null;

toggleMenu(menu: string) {
  this.activeMenu = this.activeMenu === menu ? null : menu;
}

   constructor(public auth: AuthService, private router: Router) {}
  
logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
