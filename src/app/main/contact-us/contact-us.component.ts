import { Component } from '@angular/core';
import { EnquiryService } from 'src/app/services/enquiry.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  formData = {
    fullName: '',
    phone: '',
    message: ''
  };
  constructor(private contactService: EnquiryService) {}

  onSubmit(form: any) {
    // Check if form is valid
    if (!this.formData.fullName || !this.formData.phone || !this.formData.message) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please enter all fields!',
        confirmButtonText: 'Ok'
      });
      return;
    }

    this.contactService.sendContactEmail(this.formData).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Thank You!',
          text: 'Thank you for contacting us. We will reach you soon.',
          confirmButtonText: 'Ok'
        });
        // Reset form
        this.formData = { fullName: '', phone: '', message: '' };
        form.resetForm(); // Reset ngForm
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Failed to send message. Please try again later.',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}
