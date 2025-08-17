import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
username = '';
email = '';
  password = '';
  errorMessage = '';
  remember:boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.authService.login(this.email, this.password)) {
      const role = this.authService.getRole();
      if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'customer') {
        this.router.navigate(['/customer']);
      } else {
        this.router.navigate(['/']); // fallback
      }
    } else {
      // this.errorMessage = 'Invalid username or password';
      Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid credentials. Please try again!',
    });
    }}
    
}
