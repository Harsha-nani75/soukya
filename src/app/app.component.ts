import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'soukya';

  ngOnInit() {
    AOS.init();
  }
}
