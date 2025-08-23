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
 //------------
 //local useage
 //------------

  // username = '';
  // email = '';
  // password = '';
  // errorMessage = '';
  // remember: boolean = false;

  // // Card states
  // currentCard: 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password' = 'login';

  // // Registration
  // registerData = { name: '', email: '', phone: '', password: '' };
  // generatedOtp: string = '';
  // enteredOtp: string = '';

  // // Forgot password
  // forgot = { email: '' };
  // otp: string = '';
  // otpVerified: boolean = false;

  // // Timer
  // resendDisabled: boolean = true;
  // timer: any;
  // timeLeft: number = 60;

  // // Reset password
  // newPassword: string = '';

  // constructor(private authService: AuthService, private router: Router) {}

  // ngOnInit(): void {
  //   const savedUser = localStorage.getItem('user');
  //   if (savedUser) {
  //     const user = JSON.parse(savedUser);
  //     this.email = user.email;

  //     const role = user.role;
  //     // auto redirect
  //     if (role === 'admin') {
  //       this.router.navigate(['/admin']);
  //     } else if (role === 'customer') {
  //       this.router.navigate(['/customer']);
  //     }
  //   }
  // }

  // // ---------------- LOGIN ----------------
  // onLogin() {
  //   if (this.authService.login(this.email, this.password)) {
  //     const role = this.authService.getRole();

  //     if (this.remember) {
  //       localStorage.setItem(
  //         'user',
  //         JSON.stringify({ email: this.email, role: role })
  //       );
  //     } else {
  //       localStorage.removeItem('user');
  //     }

  //     if (role === 'admin') {
  //       this.router.navigate(['/admin']);
  //     } else if (role === 'customer') {
  //       this.router.navigate(['/customer']);
  //     } else {
  //       this.router.navigate(['/']);
  //     }
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Login Failed',
  //       text: 'Invalid credentials. Please try again!'
  //     });
  //   }
  // }

  // // ---------------- REGISTER (Step 1: Generate OTP) ----------------
  // onRegister() {
  //   this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  //   console.log('Registration OTP:', this.generatedOtp);

  //   this.currentCard = 'otp';
  // }

  // // ---------------- VERIFY OTP (for Registration) ----------------
  // verifyRegisterOtp() {
  //   if (this.enteredOtp === this.generatedOtp) {
  //     localStorage.setItem('user', JSON.stringify(this.registerData));
  //     Swal.fire({
  //       icon: 'success',
  //       title: 'Registration Successful',
  //       text: 'You are now registered!'
  //     }).then(() => {
  //       this.router.navigate(['/customer']);
  //     });
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid OTP',
  //       text: 'Please enter the correct OTP.'
  //     });
  //   }
  // }

  // // ---------------- FORGOT PASSWORD (Send OTP) ----------------
  // onForgot() {
  //   this.generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  //   console.log('Forgot Password OTP:', this.generatedOtp);

  //   this.switchCard('otp');
  //   this.startTimer();
  // }

  // // Timer for resend OTP
  // startTimer() {
  //   this.resendDisabled = true;
  //   this.timeLeft = 60;

  //   this.timer = setInterval(() => {
  //     this.timeLeft--;
  //     if (this.timeLeft <= 0) {
  //       clearInterval(this.timer);
  //       this.resendDisabled = false;
  //     }
  //   }, 1000);
  // }

  // // Resend OTP
  // resendOtp() {
  //   this.onForgot(); // regenerate OTP
  // }

  // // Verify OTP (Forgot Password)
  // verifyForgotOtp() {
  //   if (this.otp === this.generatedOtp) {
  //     this.otpVerified = true;
  //     this.switchCard('reset-password');
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid OTP',
  //       text: 'Please try again!'
  //     });
  //   }
  // }

  // // Reset Password
  // resetPassword() {
  //   console.log('New Password:', this.newPassword);
  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Password Reset Successful',
  //     text: 'You can now login with your new password.'
  //   }).then(() => {
  //     this.switchCard('login');
  //   });
  // }

  // // ---------------- SWITCH CARDS ----------------
  // switchCard(card: 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password') {
  //   this.currentCard = card;
  // }

  //---------------API USAGE----------------
    email = '';
  password = '';
  errorMessage = '';
  remember: boolean = false;

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

  // ---------------- LOGIN ----------------
  onLogin() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
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
      error: () => {
        Swal.fire('Error', 'Invalid credentials', 'error');
      }
    });
  }

  // ---------------- REGISTER ----------------
  onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.currentCard = 'otp';
        Swal.fire('Info', 'OTP sent to your email!', 'info');
        this.startTimer();
      },
      error: () => Swal.fire('Error', 'Registration failed', 'error')
    });
  }

verifyRegisterOtp() {
const payload = {
  email: this.registerData.email,otp: String(this.enteredOtp) // ensure it's a string
};
    console.log('Entered OTP:', payload);

  this.authService.verifyRegisterOtp({
    email: payload.email,
    otp: payload.otp // ensure it's a string
  }).subscribe({
    next: () => {
      Swal.fire('Success', 'Registration successful', 'success');
      this.switchCard('login');
    },
    error: (err) => {
      console.error(err); // see actual error from backend
      Swal.fire('Error', 'Invalid OTP', 'error');
    }
  });
}

  // ---------------- FORGOT PASSWORD ----------------
  onForgot() {
    this.authService.forgotPassword(this.forgot).subscribe({
      next: () => {
        Swal.fire('Info', 'OTP sent to your email!', 'info');
        this.switchCard('otp');
        this.startTimer();
      },
      error: () => Swal.fire('Error', 'Something went wrong', 'error')
    });
  }

  verifyForgotOtp() {
    this.authService.verifyForgotOtp({ email: this.forgot.email, otp: this.otp }).subscribe({
      next: () => {
        this.otpVerified = true;
        this.switchCard('reset-password');
      },
      error: () => Swal.fire('Error', 'Invalid OTP', 'error')
    });
  }

  resetPassword() {
    this.authService.resetPassword({ email: this.forgot.email, newPassword: this.newPassword }).subscribe({
      next: () => {
        Swal.fire('Success', 'Password reset successful', 'success');
        this.switchCard('login');
      },
      error: () => Swal.fire('Error', 'Failed to reset password', 'error')
    });
  }

  // ---------------- RESEND OTP ----------------
  resendOtp() {
    this.authService.resendOtp({ email: this.registerData.email }).subscribe({
      next: () => {
        Swal.fire('Info', 'OTP resent successfully!', 'info');
        this.startTimer();
      },
      error: () => Swal.fire('Error', 'Failed to resend OTP', 'error')
    });
  }
  //--------reend otp for forgot password--------
  resendForgotOtp() {
  this.authService.resendForgotOtp({ email: this.forgot.email }).subscribe({
    next: () => {
      Swal.fire('Info', 'OTP resent successfully!', 'info');
      this.startTimer(); // reuse timer function
    },
    error: (err) => Swal.fire('Error', err.error?.error || 'Failed to resend OTP', 'error')
  });
}


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

  // ---------------- SWITCH ----------------
  switchCard(card: 'login' | 'register' | 'forgot-password' | 'otp' | 'reset-password') {
    this.currentCard = card;
  }
}
