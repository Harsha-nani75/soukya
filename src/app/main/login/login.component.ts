import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  remember: boolean = false;
  isLoading: boolean = false;

  // Card states
  currentCard: 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password' = 'login';

  // Registration
  registerData = { name: '', email: '', phnum: '', password: '' };
  enteredOtp: string = '';

  // Forgot password
  forgot = { email: '' };
  otp: string = '';
  otpVerified: boolean = false;

  // Timer
  resendDisabled: boolean = true;
  timer: any;
  timeLeft: number = 60;

  // Reset password
  newPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const role = user.role;
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'customer') {
        this.router.navigate(['/customer']);
      }
    }
  }

  // ==================== VALIDATION METHODS ====================
  
  // Email validation
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone number validation (10 digits, can start with +91)
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  // Password validation (minimum 6 characters)
  isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // Name validation (not empty, only letters and spaces)
  isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return name.trim().length > 0 && nameRegex.test(name.trim());
  }

  // ==================== FORM VALIDATION HELPERS ====================
  
  // Check if register form is valid
  isRegisterFormValid(): boolean {
    return this.isValidName(this.registerData.name) &&
           this.isValidEmail(this.registerData.email) &&
           this.isValidPhone(this.registerData.phnum) &&
           this.isValidPassword(this.registerData.password);
  }

  // ==================== REAL-TIME VALIDATION METHODS ====================
  
  validateLoginEmail(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  validateRegisterName(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  validateRegisterEmail(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  validateRegisterPhone(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  validateRegisterPassword(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  validateForgotEmail(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  validateNewPassword(): void {
    // This method is called on blur for real-time validation
    // The validation is handled by the template binding
  }

  // ==================== LOGIN VALIDATION & SUBMISSION ====================
  
  onLogin() {
    // Validate email
    if (!this.email.trim()) {
      Swal.fire('Validation Error', 'Please enter your email address', 'warning');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      Swal.fire('Validation Error', 'Please enter a valid email address', 'warning');
      return;
    }

    // Validate password
    if (!this.password.trim()) {
      Swal.fire('Validation Error', 'Please enter your password', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Logging in...',
      text: 'Please wait while we authenticate you',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        if (this.remember) {
          localStorage.setItem('rememberMe', 'true');
        }

        Swal.fire('Success', 'Login successful!', 'success');
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/customer']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login error:', err);
        Swal.fire('Error', err.error?.message || 'Invalid credentials. Please try again!', 'error');
      }
    });
  }

  // ==================== REGISTER VALIDATION & SUBMISSION ====================
  
  onRegister() {
    // Validate name
    if (!this.isValidName(this.registerData.name)) {
      Swal.fire('Validation Error', 'Please enter a valid full name (letters and spaces only)', 'warning');
      return;
    }

    // Validate email
    if (!this.registerData.email.trim()) {
      Swal.fire('Validation Error', 'Please enter your email address', 'warning');
      return;
    }

    if (!this.isValidEmail(this.registerData.email)) {
      Swal.fire('Validation Error', 'Please enter a valid email address', 'warning');
      return;
    }

    // Validate phone number
    if (!this.registerData.phnum.trim()) {
      Swal.fire('Validation Error', 'Please enter your phone number', 'warning');
      return;
    }

    if (!this.isValidPhone(this.registerData.phnum)) {
      Swal.fire('Validation Error', 'Please enter a valid 10-digit phone number (can start with +91)', 'warning');
      return;
    }

    // Validate password
    if (!this.registerData.password.trim()) {
      Swal.fire('Validation Error', 'Please enter a password', 'warning');
      return;
    }

    if (!this.isValidPassword(this.registerData.password)) {
      Swal.fire('Validation Error', 'Password must be at least 6 characters long', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Creating Account...',
      text: 'Please wait while we create your account',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.currentCard = 'otp';
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: 'We have sent a verification code to your email. Please check your inbox.',
          confirmButtonText: 'OK'
        });
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        Swal.fire('Error', err.error?.message || 'Registration failed. Please try again!', 'error');
      }
    });
  }

  // ==================== OTP VERIFICATION ====================
  
  verifyRegisterOtp() {
    if (!this.enteredOtp.trim()) {
      Swal.fire('Validation Error', 'Please enter the OTP sent to your email', 'warning');
      return;
    }

    if (this.enteredOtp.length !== 6) {
      Swal.fire('Validation Error', 'OTP must be 6 digits', 'warning');
      return;
    }

    const payload = {
      email: this.registerData.email,
      otp: String(this.enteredOtp)
    };

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Verifying OTP...',
      text: 'Please wait while we verify your OTP',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.verifyRegisterOtp(payload).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Your account has been created successfully. You can now login.',
          confirmButtonText: 'Login Now'
        }).then(() => {
          this.switchCard('login');
          // Clear registration data
          this.registerData = { name: '', email: '', phnum: '', password: '' };
          this.enteredOtp = '';
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('OTP verification error:', err);
        Swal.fire('Error', err.error?.message || 'Invalid OTP. Please try again!', 'error');
      }
    });
  }

  // ==================== FORGOT PASSWORD ====================
  
  onForgot() {
    if (!this.forgot.email.trim()) {
      Swal.fire('Validation Error', 'Please enter your email address', 'warning');
      return;
    }

    if (!this.isValidEmail(this.forgot.email)) {
      Swal.fire('Validation Error', 'Please enter a valid email address', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Sending OTP...',
      text: 'Please wait while we send the verification code to your email',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.forgotPassword(this.forgot).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          text: 'We have sent a verification code to your email. Please check your inbox.',
          confirmButtonText: 'OK'
        });
        this.switchCard('otp');
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Forgot password error:', err);
        Swal.fire('Error', err.error?.message || 'Something went wrong. Please try again!', 'error');
      }
    });
  }

  verifyForgotOtp() {
    if (!this.otp.trim()) {
      Swal.fire('Validation Error', 'Please enter the OTP sent to your email', 'warning');
      return;
    }

    if (this.otp.length !== 6) {
      Swal.fire('Validation Error', 'OTP must be 6 digits', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Verifying OTP...',
      text: 'Please wait while we verify your OTP',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.verifyForgotOtp({ email: this.forgot.email, otp: this.otp }).subscribe({
      next: () => {
        this.isLoading = false;
        this.otpVerified = true;
        this.switchCard('reset-password');
        Swal.fire({
          icon: 'success',
          title: 'OTP Verified!',
          text: 'Please enter your new password',
          confirmButtonText: 'Continue'
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Forgot OTP verification error:', err);
        Swal.fire('Error', err.error?.message || 'Invalid OTP. Please try again!', 'error');
      }
    });
  }

  resetPassword() {
    if (!this.newPassword.trim()) {
      Swal.fire('Validation Error', 'Please enter a new password', 'warning');
      return;
    }

    if (!this.isValidPassword(this.newPassword)) {
      Swal.fire('Validation Error', 'Password must be at least 6 characters long', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Resetting Password...',
      text: 'Please wait while we reset your password',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.resetPassword({ email: this.forgot.email, newPassword: this.newPassword }).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'Your password has been reset successfully. You can now login with your new password.',
          confirmButtonText: 'Login Now'
        }).then(() => {
          this.switchCard('login');
          // Clear forgot password data
          this.forgot = { email: '' };
          this.otp = '';
          this.newPassword = '';
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Password reset error:', err);
        Swal.fire('Error', err.error?.message || 'Failed to reset password. Please try again!', 'error');
      }
    });
  }

  // ==================== RESEND OTP ====================
  
  resendOtp() {
    if (!this.registerData.email.trim()) {
      Swal.fire('Validation Error', 'Please enter your email address first', 'warning');
      return;
    }

    if (!this.isValidEmail(this.registerData.email)) {
      Swal.fire('Validation Error', 'Please enter a valid email address', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Resending OTP...',
      text: 'Please wait while we resend the verification code',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.resendOtp({ email: this.registerData.email }).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'OTP Resent!',
          text: 'We have sent a new verification code to your email.',
          confirmButtonText: 'OK'
        });
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Resend OTP error:', err);
        Swal.fire('Error', err.error?.message || 'Failed to resend OTP. Please try again!', 'error');
      }
    });
  }

  resendForgotOtp() {
    if (!this.forgot.email.trim()) {
      Swal.fire('Validation Error', 'Please enter your email address first', 'warning');
      return;
    }

    if (!this.isValidEmail(this.forgot.email)) {
      Swal.fire('Validation Error', 'Please enter a valid email address', 'warning');
      return;
    }

    this.isLoading = true;

    // Show loading state
    Swal.fire({
      title: 'Resending OTP...',
      text: 'Please wait while we resend the verification code',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.resendForgotOtp({ email: this.forgot.email }).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'OTP Resent!',
          text: 'We have sent a new verification code to your email.',
          confirmButtonText: 'OK'
        });
        this.startTimer();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Resend forgot OTP error:', err);
        Swal.fire('Error', err.error?.message || 'Failed to resend OTP. Please try again!', 'error');
      }
    });
  }

  // ==================== TIMER ====================
  
  startTimer() {
    this.resendDisabled = true;
    this.timeLeft = 30;
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  // ==================== CARD SWITCHING ====================
  
  switchCard(card: 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password') {
    this.currentCard = card;
    
    // Clear validation errors when switching cards
    this.errorMessage = '';
    
    // Clear timer if switching away from OTP
    if (card !== 'otp' && this.timer) {
      clearInterval(this.timer);
      this.resendDisabled = false;
    }
  }
}
