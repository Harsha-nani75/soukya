import { Component, HostListener } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  menuOpen = false;
  showDropdown = false;

  ngOnInit(){
    AOS.init();
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const navbar = document.querySelector('.main-nav');
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    setTimeout(() => AOS.refresh(), 100);
  }
}

