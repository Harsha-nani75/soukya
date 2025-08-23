import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../services/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //----------------
  //local useage
  //-----------------
  // private loggedIn = false;
  // private currentUser: any = null;
  // private userRole: string | null = null;

  // constructor() {
  //   const savedUser = localStorage.getItem('user');
  //   if (savedUser) {
  //     this.currentUser = JSON.parse(savedUser);
  //     this.loggedIn = true;
  //     this.userRole = this.currentUser.role;
  //   }
  // }

  // login(username: string, password: string): boolean {
  //   // Dummy authentication
  //   if ((username === 'admin' || username === 'customer') && password === '123') {
  //     this.loggedIn = true;
  //     this.userRole = username === 'admin' ? 'admin' : 'customer';
  //     this.currentUser = {
  //       email: username + '@gmail.com',
  //       role: this.userRole
  //     };

  //     // Save to localStorage
  //     localStorage.setItem('user', JSON.stringify(this.currentUser));
  //     return true;
  //   }

  //   return false;
  // }

  // logout(): void {
  //   this.loggedIn = false;
  //   this.userRole = null;
  //   this.currentUser = null;
  //   localStorage.removeItem('user');
  // }

  // isLoggedIn(): boolean {
  //   return this.loggedIn;
  // }

  // getRole(): string | null {
  //   return this.userRole;
  // }

  // getUser(): any {
  //   return this.currentUser;
  // }
//------------------
// API usage
//------------------
  private apiUrl = environment.apiUrl;
  getRole(): string | null {
  const user = this.getUser();
  return user ? user.role : null;
}


  constructor(private http: HttpClient, private router: Router) {}

    login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // ---------- REGISTER ----------
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/register`, data);
  }

  
verifyRegisterOtp(data: { email: string; otp: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/register/verify-otp`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}

  resendOtp(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/resend-otp`, data);
  }

  // ---------- FORGOT PASSWORD ----------
  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/forgot-password`, data);
  }

  verifyForgotOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/verify-forgot-otp`, data);
  }
  resendForgotOtp(data: { email: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/register/resend-forgot-otp`, data, {
    headers: { 'Content-Type': 'application/json' }
  });
}


  resetPassword(data: { email: string; newPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/reset-password`, data);
  }

}
