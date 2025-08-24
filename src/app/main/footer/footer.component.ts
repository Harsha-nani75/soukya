import { Component, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Enquiry, EnquiryService } from 'src/app/services/enquiry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
 url:string = window.location.href;
title = document.title;

packagesButton = true;captchaToken: string | null = null;

onCaptchaResolved(token: string) {
  this.captchaToken = token;
  console.log("Captcha resolved:", token);
}


private listenerFn: (() => void) | undefined;
constructor(private renderer: Renderer2,private enquiryService:EnquiryService) {}

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

onSubmit(form: NgForm, serviceType: 'elder care' | 'medical tourism'): void {
   
    if (form.invalid) return;

    const formValue: Enquiry = form.value;

    // 🔹 Attach service type
    formValue.serviceType = serviceType;

    // 🔹 Handle Elder Care logic
    if (serviceType === 'elder care') {
      formValue.treatmentIssue = null;
    }
    //console.log (formValue)
    this.enquiryService.createEnquiry(formValue).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Enquiry Submitted',
          text: `Your ${serviceType} enquiry has been submitted successfully ✅`
        });
        form.resetForm();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Something went wrong. Please try again ❌'
        });
      }
    });
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
