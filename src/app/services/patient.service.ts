import { Injectable } from '@angular/core';
import { Patient } from '../admin/genticcare/patient.model'; // Assuming you have a Patient model defined
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError } from 'rxjs';
import { environment } from './environment';
// const STORAGE_KEY = 'PatientData';


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

  getPatientById(id: number) {
    return this.http.get(`${this.apiUrl}/patients/genetic-care/${id}`);
  }
  
  // 2️⃣ Get habits
  getHabitsById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patients/${id}/habits`);
  }

  // 3️⃣ Get questions
  getQuestionsById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patients/${id}/questions`);
  }

  // 4️⃣ Get insurance (with hospitals)
  getInsuranceById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patients/${id}/insurance`);
  }

  
  getCareById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/genetic-care/${id}`).pipe(
      timeout(15000), // 15 second timeout
      catchError((error: any) => {
        console.error('Error fetching patient data:', error);
        throw error;
      })
    );
  }
  
  getInsuranceHospitalsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/insuranceHospitals/${id}`).pipe(
      timeout(15000), // 15 second timeout
      catchError((error: any) => {
        console.error('Error fetching insurance hospitals:', error);
        throw error;
      })
    );
  }
  getInsuranceDetailsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/insuranceDetails/${id}`).pipe(
      timeout(15000), // 15 second timeout
      catchError((error: any) => {
        console.error('Error fetching insurance details:', error);
        throw error;
      })
    );
  }

  // 🔹 Create patient (with file uploads)
  addPatient(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patients/genetic-care`, formData);
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
    console.log('🔄 Sending insurance data to backend:', insurance);
    console.log('📊 Data structure:', {
      hasInsuranceCompany: !!insurance.insuranceCompany,
      hasPeriodInsurance: !!insurance.periodInsurance,
      hasSumInsured: !!insurance.sumInsured,
      hasHospitals: Array.isArray(insurance.hospitals),
      hospitalsCount: insurance.hospitals?.length || 0
    });
    
    // Send insurance data directly as backend expects direct fields
    return this.http.put<any>(`${this.apiUrl}/patient-update/insurance/${id}`, insurance)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Insurance update error:', error);
          throw error;
        })
      );
  }

  // Update questions for a patient
  updateQuestions(id: number, questions: any): Observable<any> {
    console.log('Sending questions data to backend:', questions);
    
    // Send questions data directly as backend expects the questions object
    return this.http.put<any>(`${this.apiUrl}/patient-update/questions/${id}`, questions)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Questions update error:', error);
          throw error;
        })
      );
  }

  // Update selected diseases for a patient
  updateSelectedDiseases(id: number, selectedDiseases: any[]): Observable<any> {
    console.log('Sending selected diseases data to backend:', selectedDiseases);
    
    // Send selected diseases array directly as backend expects array format
    return this.http.put<any>(`${this.apiUrl}/patient-update/selectedDiseases/${id}`, selectedDiseases)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Selected diseases update error:', error);
          throw error;
        })
      );
  }

  // Update multiple proof files
  updateProofFiles(patientId: string, formData: FormData): Observable<any> {
    console.log('Sending proof files to backend via FormData');
    
    return this.http.put<any>(`${this.apiUrl}/patient-update/proof-files/${patientId}`, formData)
      .pipe(
        timeout(60000), // 60 second timeout for file uploads
        catchError((error: any) => {
          console.error('Proof files update error:', error);
          throw error;
        })
      );
  }

  // Upload individual files with file type (new API)
  uploadIndividualFiles(patientId: string, files: File[], fileType: 'photo' | 'proof' | 'policy'): Observable<any> {
    console.log(`Uploading ${files.length} files of type '${fileType}' for patient ${patientId}`);
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('file_type', fileType);
    
    return this.http.post<any>(`${this.apiUrl}/patients/files/${patientId}`, formData)
      .pipe(
        timeout(60000), // 60 second timeout for file uploads
        catchError((error: any) => {
          console.error(`${fileType} files upload error:`, error);
          throw error;
        })
      );
  }

  

  // Update multiple policy files
  updatePolicyFiles(id: number, formData: FormData): Observable<any> {
    console.log('Sending policy files to backend via FormData');
    
    return this.http.put<any>(`${this.apiUrl}/patient-update/policy-files/${id}`, formData)
      .pipe(
        timeout(60000), // 60 second timeout for file uploads
        catchError((error: any) => {
          console.error('Policy files update error:', error);
          throw error;
        })
      );
  }

  // Update both proof and policy files at once
  updateAllFiles(id: number, proofFiles: File[], policyFiles: File[]): Observable<any> {
    console.log('Sending all files to backend:', proofFiles.length, 'proof files,', policyFiles.length, 'policy files');
    
    const formData = new FormData();
    proofFiles.forEach((file, index) => {
      formData.append('proofFiles', file);
    });
    policyFiles.forEach((file, index) => {
      formData.append('policyFiles', file);
    });
    
    return this.http.put<any>(`${this.apiUrl}/patient-update/files/${id}`, formData)
      .pipe(
        timeout(60000), // 60 second timeout for file uploads
        catchError((error: any) => {
          console.error('All files update error:', error);
          throw error;
        })
      );
  }

  // Get all files for a patient
  getAllFiles(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient-update/files/${id}`)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Error fetching files:', error);
          throw error;
        })
      );
  }

  // Get files by type for a patient (photo, proof, policy)
  getFilesByType(id: number, fileType: 'photo' | 'proof' | 'policy'): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patient-update/files/${id}/${fileType}`)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error(`Error fetching ${fileType} files:`, error);
          throw error;
        })
      );
  }

  // Delete proof file by fileId
  // deleteProofFile(fileId: string): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/patient-update/proof-file/${fileId}`)
  //     .pipe(
  //       timeout(30000), // 30 second timeout
  //       catchError((error: any) => {
  //         console.error('Error deleting proof file:', error);
  //         throw error;
  //       })
  //     );
  // }


  // Delete individual file by file ID (new API)
  deleteFile(fileId: number): Observable<any> {
    console.log(`🗑️ Deleting file with ID: ${fileId}`);
    
    return this.http.delete<any>(`${this.apiUrl}/patients/file/${fileId}`)
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Error deleting file:', error);
          throw error;
        })
      );
  }

  // Delete file by path (alternative method when file ID is not available)
  deleteFileByPath(patientId: string, filePath: string, fileType: 'photo' | 'proof' | 'policy'): Observable<any> {
    console.log(`🗑️ Deleting file by path: ${filePath} for patient ${patientId}`);
    
    const payload = {
      patientId: patientId,
      filePath: filePath,
      fileType: fileType
    };
    
    return this.http.delete<any>(`${this.apiUrl}/file-by-path`, { body: payload })
      .pipe(
        timeout(30000), // 30 second timeout
        catchError((error: any) => {
          console.error('Error deleting file by path:', error);
          throw error;
        })
      );
  }

  // Get file ID by path (to resolve file ID when only path is available)
  getFileIdByPath(patientId: string, filePath: string, fileType: 'photo' | 'proof' | 'policy'): Observable<any> {
    console.log(`🔍 Getting file ID by path: ${filePath} for patient ${patientId}`);
    
    const params = {
      patientId: patientId,
      filePath: filePath,
      fileType: fileType
    };
    
    return this.http.get<any>(`${this.apiUrl}/file-id-by-path`, { params })
      .pipe(
        timeout(15000), // 15 second timeout
        catchError((error: any) => {
          console.error('Error getting file ID by path:', error);
          throw error;
        })
      );
  }

  // Parse file response from new patient_files table structure
  parseFileResponse(response: any): any {
    if (response && response.files) {
      return {
        message: response.message,
        files: response.files.map((file: any) => ({
          id: file.id,
          patient_id: file.patient_id,
          file_type: file.file_type,
          file_path: file.file_path,
          original_name: file.original_name,
          size: file.size,
          mimetype: file.mimetype,
          folder: file.folder,
          fullUrl: `http://localhost:4870/${file.file_path}`
        })),
        count: response.count,
        folder: response.folder,
        timestamp: response.timestamp
      };
    }
    return response;
  }

  // 🔹 Delete patient
  deletePatient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/patients/${id}`);
  }
}
