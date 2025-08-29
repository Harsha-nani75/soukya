import { Component, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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

packagesButton = true;
captchaToken: string | null = null;
isSubmitting = false; // Track submission state

onCaptchaResolved(token: string) {
  this.captchaToken = token;
  console.log("Captcha resolved:", token);
}


private listenerFn: (() => void) | undefined;
constructor(private renderer: Renderer2,private enquiryService:EnquiryService,private router: Router) {}

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

    const formValue: Enquiry = form.value;

    // 🔹 Attach service type
    formValue.serviceType = serviceType;

    // 🔹 Handle Elder Care logic
    if (serviceType === 'elder care') {
      formValue.treatmentIssue = null;
    }

    // Additional validation for required fields
    if (!this.validateRequiredFields(formValue, serviceType)) {
      return;
    }

    // Set submission state
    this.isSubmitting = true;

    // Show loading state
    Swal.fire({
      title: 'Submitting Enquiry...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    console.log('Submitting enquiry:', formValue);
    
    this.enquiryService.createEnquiry(formValue).subscribe({
      next: (response) => {
        console.log('Enquiry submitted successfully:', response);
        this.isSubmitting = false; // Reset submission state
        this.showSuccessAndReset(form, serviceType);
      },
      error: (error) => {
        console.error('Enquiry submission failed:', error);
        this.isSubmitting = false; // Reset submission state
        this.showSubmissionError(error, serviceType);
      }
    });
  }

  // Enhanced validation for required fields
  private validateRequiredFields(formValue: any, serviceType: string): boolean {
    const errors: string[] = [];

    // Check name
    if (!formValue.name || formValue.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    // Check email
    if (!formValue.email || !this.isValidEmail(formValue.email)) {
      errors.push('Please enter a valid email address');
    }

    // Check phone
    if (!formValue.phoneNo || formValue.phoneNo.trim().length < 10) {
      errors.push('Phone number must be at least 10 digits');
    }

    // Check address for elder care
    if (serviceType === 'elder care' && (!formValue.address || formValue.address.trim().length < 10)) {
      errors.push('Address must be at least 10 characters long');
    }

    // Check treatment issue for medical tourism
    if (serviceType === 'medical tourism' && (!formValue.treatmentIssue || formValue.treatmentIssue.trim().length < 5)) {
      errors.push('Please describe your treatment issue (at least 5 characters)');
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
        } else if (control.errors['email']) {
          errors.push(`${this.getFieldLabel(key)} must be a valid email`);
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
  private showSubmissionError(error: any, serviceType: string): void {
    let errorMessage = 'Something went wrong while submitting your enquiry.';
    let errorTitle = 'Submission Failed';

    // Check for specific error messages from backend
    if (error.error && typeof error.error === 'object') {
      if (error.error.error === 'Invalid phone number format') {
        this.showPhoneNumberError();
        return; // Return early to show custom phone error popup
      } else if (error.error.error) {
        errorTitle = 'Validation Error';
        errorMessage = error.error.error;
      }
    } else if (error.status === 400) {
      errorTitle = 'Invalid Data';
      errorMessage = 'Please check your information and try again.';
    } else if (error.status === 409) {
      errorTitle = 'Duplicate Enquiry';
      errorMessage = 'An enquiry with this information already exists.';
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
              <strong>Service:</strong> ${serviceType}
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

  // Show specific phone number format error with helpful guidance
  private showPhoneNumberError(): void {
    Swal.fire({
      icon: 'warning',
      title: '📱 Invalid Phone Number Format',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px; color: #856404; font-size: 16px;">
            <strong>Please enter a valid phone number</strong>
          </p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin-bottom: 20px;">
            <h6 style="color: #856404; margin-bottom: 15px;">📋 Phone Number Requirements:</h6>
            <ul style="text-align: left; color: #856404; margin: 0; padding-left: 20px;">
              <li>Must be at least <strong>10 digits</strong> long</li>
              <li>Should contain <strong>only numbers (0-9)</strong></li>
              <li>No spaces, dashes, or special characters</li>
              <li>Examples: <code>9876543210</code>, <code>1234567890</code></li>
            </ul>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; border-left: 4px solid #17a2b8;">
            <p style="margin: 0; color: #0c5460; font-size: 14px;">
              <strong>💡 Tip:</strong> Remove any spaces, dashes, or brackets from your phone number
            </p>
          </div>
        </div>
      `,
      confirmButtonText: 'I\'ll Fix It',
      confirmButtonColor: '#ffc107',
      showCancelButton: true,
      cancelButtonText: 'Cancel & Reset Form',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "I'll Fix It" - do nothing, let them fix and resubmit
        console.log('User will fix the phone number');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User clicked "Cancel & Reset Form" - reset the form
        console.log('User cancelled phone number fix, resetting form');
        this.resetFormAfterError();
      }
    });
  }

  // Show additional phone number help
  private showPhoneNumberHelp(): void {
    Swal.fire({
      icon: 'info',
      title: '📞 Phone Number Help',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 15px;">Here are some examples of correct phone number formats:</p>
          
          <div style="background: #e2e3e5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h6 style="color: #495057; margin-bottom: 15px;">✅ Correct Formats:</h6>
            <div style="text-align: left; color: #495057;">
              <p><strong>• Indian Mobile:</strong> <code>9876543210</code></p>
              <p><strong>• Landline:</strong> <code>04012345678</code></p>
              <p><strong>• International:</strong> <code>1234567890</code></p>
            </div>
          </div>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px;">
            <h6 style="color: #721c24; margin-bottom: 15px;">❌ Avoid These:</h6>
            <div style="text-align: left; color: #721c24;">
              <p><strong>• With spaces:</strong> <code>987 654 3210</code></p>
              <p><strong>• With dashes:</strong> <code>987-654-3210</code></p>
              <p><strong>• With brackets:</strong> <code>(987) 654-3210</code></p>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: 'Got It!',
      confirmButtonColor: '#17a2b8'
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
            <p style="margin: 5px 0;"><strong>📧 Email:</strong> support@soukhya.com</p>
            <p style="margin: 5px 0;"><strong>📞 Phone:</strong> +91-XXXXXXXXXX</p>
            <p style="margin: 5px 0;"><strong>🕒 Hours:</strong> Mon-Fri, 9 AM - 6 PM</p>
          </div>
        </div>
      `,
      confirmButtonText: 'Got It',
      confirmButtonColor: '#17a2b8'
    });
  }

  // Helper method to get field labels
  private getFieldLabel(key: string): string {
    const labels: { [key: string]: string } = {
      name: 'Full Name',
      email: 'Email Address',
      phoneNo: 'Phone Number',
      address: 'Address',
      message: 'Message',
      treatmentIssue: 'Treatment Issue',
      countryCode: 'Country Code'
    };
    return labels[key] || key;
  }

  // Email validation helper
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
  }

  // Reset form after error and stop submission process
  private resetFormAfterError(): void {
    // Reset submission state
    this.isSubmitting = false;
    
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
  private showSuccessAndReset(form: NgForm, serviceType: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Enquiry Submitted Successfully! 🎉',
      text: `Your ${serviceType} enquiry has been submitted. We'll get back to you soon!`,
      confirmButtonText: 'Great!',
      confirmButtonColor: '#28a745',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      }
    }).then(() => {
      this.resetForm(form);
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
goToPackages() {
  this.router.navigate(['/eldercare'], { fragment: 'packages' });
}
}
