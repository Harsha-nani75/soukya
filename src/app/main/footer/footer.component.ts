import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
 url:string = window.location.href;
title = document.title;

packagesButton = true;

private listenerFn: (() => void) | undefined;
constructor(private renderer: Renderer2) {}

ngAfterViewInit(): void {
  this.listenerFn = this.renderer.listen(document, 'shown.bs.tab', (event: any) => {
    // Remove active_tab from all
    document.querySelectorAll('#enquiryTabs .nav-link').forEach(btn => {
      btn.classList.remove('active_tab');
    });

    // Add to the one just activated
    event.target.classList.add('active_tab');
  });
}

ngOnDestroy(): void {
  if (this.listenerFn) {
    this.listenerFn(); // cleanup listener
  }
}

onShare(){
    if (navigator.share) {
        navigator.share({
            title: this.title,
            url: this.url
        }).then(() => {
            console.log('Thanks for sharing!');
        }).catch(console.error);
    } else {
        alert('Web Share API is not supported in your browser.');
    }
}
}
