import { Injectable } from '@angular/core';
import { Patient } from '../admin/genticcare/patient.model'; // Assuming you have a Patient model defined
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError } from 'rxjs';
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
  updatePatientData(id: number, patientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patient-update/patient/${id}`, patientData);
  }

  // Update caretakers for a patient
  updateCaretakers(id: number, caretakers: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patient-update/caretakers/${id}`, { caretakers });
  }

  // Update photo for a patient
  updatePhoto(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patient-update/photo/${id}`, formData);
  }

  // Update habits for a patient
  updateHabits(id: number, habits: any): Observable<any> {
    console.log('Sending habits data to backend:', habits);
    
    // Send habits array directly as backend expects array format
    return this.http.put<any>(`${this.apiUrl}/patient-update/habits/${id}`, habits)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Habits update error:', error);
          throw error;
        })
      );
  }

  // Update insurance details for a patient
  updateInsurance(id: number, insurance: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patient-update/insurance/${id}`, { insurance });
  }

  // Update questions for a patient
  updateQuestions(id: number, questions: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patient-update/questions/${id}`, { questions });
  }
  // 🔹 Delete patient
  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/patients/${id}`);
  }
}
