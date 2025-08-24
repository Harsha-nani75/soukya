import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './environment';

export interface Enquiry {
  name: string;
  email: string;
  phoneNo: string;
  address?: string;
  message?: string;
  serviceType: 'elder care' | 'medical tourism';
  treatmentIssue?: string | null;
}

interface ContactForm {
  fullName: string;
  phone: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEnquires(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enquiry`);
  }
  
  createEnquiry(enquiry: Enquiry): Observable<any> {
    return this.http.post(`${this.apiUrl}/enquiry/enquiries`, enquiry);
  }
  sendContactEmail(formData: ContactForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/enquiry/send-contact-email`, formData);
  }
  
}
