import { Injectable } from '@angular/core';
import { Patient } from '../admin/genticcare/patient.model'; // Assuming you have a Patient model defined
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
const STORAGE_KEY = 'PatientData';


@Injectable({
  providedIn: 'root'
})
export class PatientService {
    private apiUrl = environment.apiUrl;
  
   constructor(private http: HttpClient) {}

  // 🔹 Get all patients
  getPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`);
  }

  // 🔹 Get patient by ID (with relations)
  getPatientById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/${id}`);
  }
  getCareById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/care/${id}`);
  }
  getHabitsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/habits/${id}`);
  }
  getQuestionsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/questions/${id}`);
  }
  getInsuranceHospitalsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/insuranceHospitals/${id}`);
  }
  getInsuranceDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/insuranceDetails/${id}`);
  }

  // 🔹 Create patient (with file uploads)
  addPatient(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patients`, formData);
  }

  // 🔹 Update patient
  updatePatient(id: number, patientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patient-update/${id}`, patientData);
  }

  // 🔹 Delete patient
  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/patients/${id}`);
  }
}
