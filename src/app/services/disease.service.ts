import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class DiseaseService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all disease systems
  getDiseaseSystems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/disease-systems`);
  }

  // Get categories by system
  getCategoriesBySystem(systemId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/disease-categories/system/${systemId}`);
  }

  // Get diseases by category
  getDiseasesByCategory(categoryId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/diseases/category/${categoryId}`);
  }

  // Get all diseases with category and system info
  getAllDiseasesWithDetails(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/diseases/with-details`);
  }

  // Get all diseases from the diseases API endpoint
  getAllDiseases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/diseases`);
  }

  // Get patient disease history
  getPatientDiseaseHistory(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patient-diseases/${patientId}`);
  }

  // Save patient disease history
  savePatientDiseaseHistory(patientId: number, diseaseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/patient-diseases/${patientId}`, diseaseData);
  }

  // Update patient disease history
  updatePatientDiseaseHistory(historyId: number, diseaseData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/patient-diseases/${historyId}`, diseaseData);
  }

  // Delete patient disease history
  deletePatientDiseaseHistory(historyId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/patient-diseases/${historyId}`);
  }

  // Search diseases by name
  searchDiseases(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/diseases/search?q=${query}`);
  }

  // Get diseases by system
  getDiseasesBySystem(systemId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/diseases/system/${systemId}`);
  }

  // Get disease statistics
  getDiseaseStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/diseases/statistics`);
  }

  // Import diseases from JSON (admin only)
  importDiseasesFromJson(diseaseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/diseases/import`, diseaseData);
  }

  // Export diseases to JSON
  exportDiseasesToJson(): Observable<any> {
    return this.http.get(`${this.baseUrl}/diseases/export`);
  }
}
