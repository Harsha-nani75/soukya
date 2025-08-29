import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

import Swal from 'sweetalert2';



interface Patient {
  id: number;
  name: string;
  lname: string;
  phone: string;
  email: string;
  photo?: string;
  files?: {
    photo: {
      id: number;
      file_path: string;
    } | null;
    proof: Array<{
      id: number;
      file_path: string;
    }>;
    policy: Array<{
      id: number;
      file_path: string;
    }>;
  };
}
@Component({
  selector: 'app-pt-list',
  templateUrl: './pt-list.component.html',
  styleUrls: ['./pt-list.component.css']
})
export class PtListComponent implements OnInit {
  patients: Patient[] = [];
  loading: boolean = false;

  // Computed properties for template
  get totalPatients(): number {
    return this.patients.length;
  }

  get patientsWithPhotos(): number {
    return this.patients.filter(p => (p.files?.photo && p.files.photo.file_path) || p.photo).length;
  }

  get patientsWithNewFileStructure(): number {
    return this.patients.filter(p => p.files).length;
  }

  // Safe photo URL getter
  getSafePhotoUrl(patient: Patient): string {
    if (patient.files?.photo && patient.files.photo.file_path) {
      const photoPath = patient.files.photo.file_path.replace(/\\/g, '/');
      return `http://localhost:4870/${photoPath}`;
    } else if (patient.photo) {
      const photoPath = patient.photo.replace(/\\/g, '/');
      return `http://localhost:4870/${photoPath}`;
    }
    return '../../../assets/images/image.png';
  }

  constructor(
    private patientService: PatientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchPatients();
  }
fetchPatients(): void {
  this.loading = true;
  this.patientService.getPatients().subscribe({
    next: (res: Patient[]) => {
      // Process patients with new file structure
      this.patients = res.map(p => {
        let photoUrl = '../../../assets/images/image.png'; // Default image
        
        // Check new files structure first
        if (p.files?.photo && p.files.photo.file_path) {
          const photoPath = p.files.photo.file_path.replace(/\\/g, '/');
          photoUrl = `http://localhost:4870/${photoPath}`;
        }
        // Fallback to old photo structure
        else if (p.photo) {
          const photoPath = p.photo.replace(/\\/g, '/');
          photoUrl = `http://localhost:4870/${photoPath}`;
        }
        
        return {
          ...p,
          photo: photoUrl
        };
      });
      
      this.loading = false;

      // console.log('Patients fetched successfully:', this.patients);
      
      // Debug: Log file structure for first few patients
      this.patients.slice(0, 3).forEach((patient, index) => {
        // console.log(`Patient ${index + 1} (${patient.name}):`, {
        //   id: patient.id,
        //   name: patient.name,
        //   hasFiles: !!patient.files,
        //   filesPhoto: patient.files?.photo,
        //   filesPhotoPath: patient.files?.photo?.file_path,
        //   oldPhoto: patient.photo,
        //   finalPhotoUrl: patient.photo,
        //   safePhotoUrl: this.getSafePhotoUrl(patient)
        // });
      });
      
      // Log summary
      // console.log('📊 Patient Data Summary:', {
      //   total: this.totalPatients,
      //   withPhotos: this.patientsWithPhotos,
      //   withNewFileStructure: this.patientsWithNewFileStructure,
      //   backendUrl: 'http://localhost:4870'
      // });

      console.log('Patients fetched successfully:', this.patients);
      
      // Debug: Log file structure for first few patients
      this.patients.slice(0, 3).forEach((patient, index) => {
        console.log(`Patient ${index + 1} (${patient.name}):`, {
          id: patient.id,
          name: patient.name,
          hasFiles: !!patient.files,
          filesPhoto: patient.files?.photo,
          filesPhotoPath: patient.files?.photo?.file_path,
          oldPhoto: patient.photo,
          finalPhotoUrl: patient.photo,
          safePhotoUrl: this.getSafePhotoUrl(patient)
        });
      });
      
      // Log summary
      console.log('📊 Patient Data Summary:', {
        total: this.totalPatients,
        withPhotos: this.patientsWithPhotos,
        withNewFileStructure: this.patientsWithNewFileStructure,
        backendUrl: 'http://localhost:4870'
      });

    },
    error: (err) => {
      console.error('Error fetching patients:', err);
      this.loading = false;
    }
  });
}


  onView(patientId: number): void {
    this.router.navigate(['/admin/ptview', patientId]); // navigate to patient view page
  }

  onEdit(patient: Patient): void {
this.router.navigate(['/admin/gentic',patient.id]); // navigate to edit page
  }


  // Helper method to get photo URL for a patient
  getPatientPhotoUrl(patient: Patient): string {
    // Check new files structure first
    if (patient.files?.photo && patient.files.photo.file_path) {
      const photoPath = patient.files.photo.file_path.replace(/\\/g, '/');
      return `http://localhost:4870/${photoPath}`;
    }
    // Fallback to old photo structure
    else if (patient.photo) {
      const photoPath = patient.photo.replace(/\\/g, '/');
      return `http://localhost:4870/${photoPath}`;
    }
    // Default image
    return '../../../assets/images/image.png';
  }

  // Handle image loading errors
  onImageError(event: any, patient: Patient): void {

    // console.log(`Image failed to load for patient ${patient.name}:`, event.target.src);
    console.log(`Image failed to load for patient ${patient.name}:`, event.target.src);

    
    // Set fallback image
    event.target.src = '../../../assets/images/image.png';
    event.target.alt = `${patient.name} - Default profile image`;
    
    // Log the error for debugging

    // console.warn(`Patient ${patient.name} (ID: ${patient.id}) photo failed to load:`, {
    //   originalSrc: event.target.src,
    //   patientData: {
    //     hasFiles: !!patient.files,
    //     filesPhoto: patient.files?.photo,
    //     filesPhotoPath: patient.files?.photo?.file_path,
    //     oldPhoto: patient.photo
    //   }
    // });

    console.warn(`Patient ${patient.name} (ID: ${patient.id}) photo failed to load:`, {
      originalSrc: event.target.src,
      patientData: {
        hasFiles: !!patient.files,
        filesPhoto: patient.files?.photo,
        filesPhotoPath: patient.files?.photo?.file_path,
        oldPhoto: patient.photo
      }
    });

  }

  // Handle successful image loading
  onImageLoad(event: any, patient: Patient): void {
    console.log(`Image loaded successfully for patient ${patient.name}:`, event.target.src);
  }

  // Test backend connection
  testBackendConnection(): void {

    // console.log('Testing backend connection...');

    console.log('Testing backend connection...');

    
    fetch('http://localhost:4870/health')
      .then(response => {
        if (response.ok) {

          // console.log('✅ Backend is accessible');
          console.log('✅ Backend is accessible');

          Swal.fire('Success', 'Backend connection is working!', 'success');
        } else {
          console.warn('⚠️ Backend responded with status:', response.status);
          Swal.fire('Warning', `Backend responded with status: ${response.status}`, 'warning');
        }
      })
      .catch(error => {
        console.error('❌ Backend connection failed:', error);
        Swal.fire('Error', 'Backend connection failed. Please check if your server is running on http://localhost:4870', 'error');
      });
  }

  // Refresh patient data
  refreshPatients(): void {
    console.log('Refreshing patient data...');
    this.loading = true;
    this.fetchPatients();
  }

  onDelete(patientId: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action will permanently delete the patient and related data.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.patientService.deletePatient(patientId).subscribe({
        next: () => {
          Swal.fire('Deleted!', 'Patient deleted successfully.', 'success');
          this.patients = this.patients.filter(p => p.id !== patientId);
        },
        error: (err) => {
          console.error('Delete error:', err);
          Swal.fire('Error!', 'Failed to delete patient.', 'error');
        }
      });
    }
  });
}


}
