import { Component } from '@angular/core';
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
}
@Component({
  selector: 'app-pt-list',
  templateUrl: './pt-list.component.html',
  styleUrls: ['./pt-list.component.css']
})
export class PtListComponent {
  patients: Patient[] = [];
  loading: boolean = false;

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
      // Normalize photo paths for browser
      this.patients = res.map(p => ({
        ...p,
       photo: p.photo ? `http://localhost:4865/${p.photo.replace(/\\/g, '/')}` : '../../../assets/image.png'
}));
      this.loading = false;
      console.log('Patients fetched successfully:', this.patients);
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
