import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  desktopItems = [
    {
      icon: `<path d="M15 22.75H9C3.57 ... Z" fill="#FFF"></path>`, // your full svg path
      text: 'Highest level of commitment and best repute in serving international patients.'
    },
    {
      icon: `<path d="M15 22.75H9C3.57 ... Z" fill="#FFF"></path>`,
      text: 'We maintain strict privacy and confidentiality regarding medical records.'
    },
    {
      icon: `<path d="M15 22.75H9C3.57 ... Z" fill="#FFF"></path>`,
      text: `<strong>Soukhya.Health</strong> offers a transparent pricing policy. We organize medical treatment at <span class="pack-button" (click)="goToPackages()">affordable prices</span>.`
    }
  ];
  mobileItems = this.desktopItems; 
  counters = [
    {
      icon: 'assets/home/red_heart.png',
      count: 100,
      label: 'Happy smiles'
    },
    {
      icon: 'assets/home/global.png',
      count: 50,
      label: 'GlobalCare'
    },
    {
      icon: 'assets/home/happiness.png',
      count: 100,
      label: 'Hospitals'
    }
  ];

  goToPackages(){
    
  }
}
