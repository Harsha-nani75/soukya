import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  showLayout = true;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const noLayoutRoutes = ['/login']; // 👈 routes where header/footer should be hidden
      this.showLayout = !noLayoutRoutes.includes(event.urlAfterRedirects);
    });
  }

}
