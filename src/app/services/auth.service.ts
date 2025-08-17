import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private loggedIn = false;
  private userRole: string | null = null;
  login(username: string, password: string): boolean {
    // Dummy authentication
    if (username === 'admin' && password === '123') {
      this.loggedIn = true;
      this.userRole = 'admin';
    } else if (username === 'customer' && password === '123') {
      this.loggedIn = true;
      this.userRole = 'customer';
    }
    return this.loggedIn;
  }

  logout() {
    this.loggedIn = false;
    this.userRole = null;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getRole(): string | null {
    return this.userRole;
  }


  constructor() { }
}
