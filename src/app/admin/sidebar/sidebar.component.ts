import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() mobileOpen = false;
  @Output() closeMobileMenu = new EventEmitter<void>();
  
  activeMenu: string | null = null;

toggleMenu(menu: string) {
  this.activeMenu = this.activeMenu === menu ? null : menu;
}

   constructor(public auth: AuthService, private router: Router) {}
  
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  onCloseMobileMenu() {
    this.closeMobileMenu.emit();
  }
}
