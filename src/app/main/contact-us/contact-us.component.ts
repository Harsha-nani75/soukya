import { Component } from '@angular/core';

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

  onSubmit(form: any) {
    if (form.valid) {
      alert('Thank you! Your message has been sent.');
      console.log(this.formData, 'form data submitting..');
      form.resetForm();
    }
  }
}
