import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userRole: string = '';
  isDropdownOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Load user data from localStorage
  loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const name = user.name || user.fullName || user.username || 'User';
        this.userName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        this.userEmail = user.email || '';
        this.userRole = user.role || '';
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.userName = 'User';
      }
    }
  }

  // Toggle dropdown
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown when clicking outside
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  // Navigate to profile page
  goToProfile(): void {
    this.closeDropdown();
    // You can implement navigation to profile page here
    // this.router.navigate(['/admin/profile']);
    console.log('Navigate to profile page');
  }

  // Logout functionality
  logout(): void {
    this.closeDropdown();
    
    // Clear all local storage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // Handle click outside dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile-dropdown')) {
      this.closeDropdown();
    }
  }

  // Handle escape key to close dropdown
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdown();
  }
}
