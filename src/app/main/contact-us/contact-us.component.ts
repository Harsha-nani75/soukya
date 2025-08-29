import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  
  isSubmitting = false; // Track submission state
  
  constructor(private contactService: EnquiryService) {}

  onSubmit(form: NgForm) {
    // Prevent multiple submissions
    if (this.isSubmitting) {
      console.log('Submission already in progress, ignoring duplicate click');
      return;
    }

    // Enhanced form validation with specific error messages
    if (form.invalid) {
      this.showFormValidationErrors(form);
      return;
    }

    // Additional validation for required fields
    if (!this.validateRequiredFields()) {
      return;
    }

    // Set submission state
    this.isSubmitting = true;

    // Show loading state
    Swal.fire({
      title: 'Sending Message...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    console.log('Submitting contact form:', this.formData);
    
    this.contactService.sendContactEmail(this.formData).subscribe({
      next: (res) => {
        console.log('Contact message sent successfully:', res);
        this.isSubmitting = false; // Reset submission state
        this.showSuccessAndReset(form);
      },
      error: (err) => {
        console.error('Contact form submission failed:', err);
        this.isSubmitting = false; // Reset submission state
        this.showSubmissionError(err);
      }
    });
  }

  // Enhanced validation for required fields
  private validateRequiredFields(): boolean {
    const errors: string[] = [];

    // Check full name
    if (!this.formData.fullName || this.formData.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    // Check phone
    if (!this.formData.phone || this.formData.phone.trim().length < 10) {
      errors.push('Phone number must be at least 10 digits');
    } else if (!this.isValidPhoneNumber(this.formData.phone)) {
      errors.push('Phone number should contain only numbers (0-9)');
    }

    // Check message
    if (!this.formData.message || this.formData.message.trim().length < 5) {
      errors.push('Message must be at least 5 characters long');
    }

    if (errors.length > 0) {
      this.showValidationErrors(errors);
      return false;
    }

    return true;
  }

  // Show form validation errors
  private showFormValidationErrors(form: NgForm): void {
    const errors: string[] = [];
    
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      if (control.invalid && control.errors) {
        if (control.errors['required']) {
          errors.push(`${this.getFieldLabel(key)} is required`);
        }
      }
    });

    if (errors.length > 0) {
      this.showValidationErrors(errors);
    }
  }

  // Show validation errors in a user-friendly way
  private showValidationErrors(errors: string[]): void {
    const errorList = errors.map(error => `• ${error}`).join('\n');
    
    Swal.fire({
      icon: 'warning',
      title: 'Please Fix the Following Issues',
      html: `<div style="text-align: left; font-size: 14px;">
        <p style="margin-bottom: 10px; color: #856404;">Please correct the following errors:</p>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
          ${errorList.replace(/\n/g, '<br>')}
        </div>
      </div>`,
      confirmButtonText: 'I\'ll Fix These',
      confirmButtonColor: '#ffc107',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    });
  }

  // Show submission error with specific details
  private showSubmissionError(error: any): void {
    // Check for specific backend error messages
    if (error.error && error.error.error === 'Invalid phone number format') {
      this.showPhoneNumberError();
      return;
    }

    let errorMessage = 'Something went wrong while sending your message.';
    let errorTitle = 'Submission Failed';

    if (error.status === 400) {
      errorTitle = 'Invalid Data';
      errorMessage = 'Please check your information and try again.';
    } else if (error.status === 500) {
      errorTitle = 'Server Error';
      errorMessage = 'Our servers are experiencing issues. Please try again later.';
    } else if (error.status === 0 || error.status === 503) {
      errorTitle = 'Connection Error';
      errorMessage = 'Unable to connect to our servers. Please check your internet connection.';
    }

    Swal.fire({
      icon: 'error',
      title: errorTitle,
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px; color: #721c24;">${errorMessage}</p>
          <div style="background: #f8d7da; padding: 10px; border-radius: 5px; border-left: 4px solid #dc3545; margin-top: 15px;">
            <small style="color: #721c24;">
              <strong>Error Code:</strong> ${error.status || 'Unknown'}<br>
              <strong>Service:</strong> Contact Form
            </small>
          </div>
        </div>
      `,
      confirmButtonText: 'Try Again',
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: 'Cancel & Reset Form',
      showDenyButton: true,
      denyButtonText: 'Contact Support',
      denyButtonColor: '#6c757d',
      showClass: {
        popup: 'animate__animated animate__shakeX'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Try Again" - do nothing, let them fix and resubmit
        console.log('User wants to try again');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "Cancel & Reset Form" - reset the form and stop any ongoing processes
        console.log('User cancelled, resetting form');
        this.resetFormAfterError();
      } else if (result.isDenied) {
        // User clicked "Contact Support"
        console.log('User wants to contact support');
        this.showContactSupport();
      }
    });
  }

  // Show contact support information
  private showContactSupport(): void {
    Swal.fire({
      icon: 'info',
      title: 'Contact Support',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px;">If the problem persists, please contact our support team:</p>
          <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8;">
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> support@soukhya.health</p>
            <p style="margin: 5px 0;"><strong>📞 Phone:</strong> +91-812-111-3711</p>
            <p style="margin: 5px 0;"><strong>🕒 Hours:</strong> 9 AM - 9 PM</p>
          </div>
        </div>
      `,
      confirmButtonText: 'Got It',
      confirmButtonColor: '#17a2b8'
    });
  }

  // Reset form after error and stop submission process
  private resetFormAfterError(): void {
    // Reset submission state
    this.isSubmitting = false;
    
    // Reset form data
    this.formData = { fullName: '', phone: '', message: '' };
    
    // Show confirmation that form has been reset
    Swal.fire({
      icon: 'info',
      title: 'Form Reset',
      text: 'The form has been reset. You can now make changes and submit again.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#17a2b8',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    });
  }

  // Show success message and reset form
  private showSuccessAndReset(form: NgForm): void {
    Swal.fire({
      icon: 'success',
      title: 'Message Sent Successfully! 🎉',
      text: 'Thank you for contacting us. We will get back to you soon!',
      confirmButtonText: 'Great!',
      confirmButtonColor: '#28a745',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    }).then(() => {
      this.resetForm(form);
    });
  }

  // Reset form and clear validation states
  private resetForm(form: NgForm): void {
    form.resetForm();
    // Reset validation states
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsUntouched();
      control.markAsPristine();
    });
    // Reset form data
    this.formData = { fullName: '', phone: '', message: '' };
  }

  // Helper method to get field labels
  private getFieldLabel(key: string): string {
    const labels: { [key: string]: string } = {
      fullName: 'Full Name',
      phone: 'Phone Number',
      message: 'Message'
    };
    return labels[key] || key;
  }

  // Phone number validation helper
  private isValidPhoneNumber(phone: string): boolean {
    // Remove any spaces, dashes, or other characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it contains only digits and has valid length
    return /^\d{10,15}$/.test(cleanPhone);
  }

  // Show specific phone number format error
  private showPhoneNumberError(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Phone Number Format',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px; color: #856404;">Please enter a valid phone number format:</p>
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin-bottom: 15px;">
            <p style="margin: 5px 0; color: #856404;"><strong>✅ Correct Formats:</strong></p>
            <p style="margin: 3px 0; color: #856404;">• 9876543210</p>
            <p style="margin: 3px 0; color: #856404;">• 98765432101</p>
            <p style="margin: 3px 0; color: #856404;">• 987654321012</p>
            <p style="margin: 8px 0; color: #856404;"><strong>❌ Avoid:</strong></p>
            <p style="margin: 3px 0; color: #856404;">• +91-9876543210</p>
            <p style="margin: 3px 0; color: #856404;">• (987) 654-3210</p>
            <p style="margin: 3px 0; color: #856404;">• 987 654 3210</p>
          </div>
          <p style="margin-top: 15px; color: #856404; font-size: 14px;">
            <strong>Requirements:</strong> Only numbers (0-9), 10-15 digits long
          </p>
        </div>
      `,
      confirmButtonText: 'I\'ll Fix This',
      confirmButtonColor: '#ffc107',
      showCancelButton: true,
      cancelButtonText: 'Cancel & Reset Form',
      showDenyButton: true,
      denyButtonText: 'Need Help?',
      denyButtonColor: '#6c757d',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "I'll Fix This" - do nothing, let them fix and resubmit
        console.log('User will fix the phone number');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "Cancel & Reset Form" - reset the form and stop any ongoing processes
        console.log('User cancelled, resetting form');
        this.resetFormAfterError();
      } else if (result.isDenied) {
        // User clicked "Need Help?" - show help information
        console.log('User needs help with phone number format');
        this.showPhoneNumberHelp();
      }
    });
  }

  // Show phone number help information
  private showPhoneNumberHelp(): void {
    Swal.fire({
      icon: 'info',
      title: 'Phone Number Help',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px;">Here's how to format your phone number correctly:</p>
          <div style="background: #d1ecf1; padding: 15px; border-radius: 5px; border-left: 4px solid #17a2b8; margin-bottom: 15px;">
            <p style="margin: 5px 0; color: #17a2b8;"><strong>📱 What to do:</strong></p>
            <p style="margin: 3px 0; color: #17a2b8;">• Remove all spaces, dashes, and brackets</p>
            <p style="margin: 3px 0; color: #17a2b8;">• Remove country codes (like +91)</p>
            <p style="margin: 3px 0; color: #17a2b8;">• Enter only the digits</p>
            <p style="margin: 3px 0; color: #17a2b8;">• Ensure it's 10-15 digits long</p>
          </div>
          <div style="background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin-bottom: 15px;">
            <p style="margin: 5px 0; color: #155724;"><strong>💡 Examples:</strong></p>
            <p style="margin: 3px 0; color: #155724;">• Instead of: +91-987-654-3210</p>
            <p style="margin: 3px 0; color: #155724;">• Use: 9876543210</p>
            <p style="margin: 3px 0; color: #155724;">• Instead of: (987) 654-3210</p>
            <p style="margin: 3px 0; color: #155724;">• Use: 9876543210</p>
          </div>
        </div>
      `,
      confirmButtonText: 'Got It!',
      confirmButtonColor: '#28a745',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    });
  }
}
