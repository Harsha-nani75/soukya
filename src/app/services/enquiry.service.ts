import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEnquires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enquiry`);
  }
}
