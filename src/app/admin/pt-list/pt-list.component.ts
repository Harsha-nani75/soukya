import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';



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
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(patientId).subscribe({
        next: () => {
          alert('Patient deleted successfully');
          this.patients = this.patients.filter(p => p.id !== patientId);
        },
        error: (err) => console.error('Delete error:', err)
      });
    }
  }

}
