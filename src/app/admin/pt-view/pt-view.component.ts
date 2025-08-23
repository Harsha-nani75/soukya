import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-pt-view',
  templateUrl: './pt-view.component.html',
  styleUrls: ['./pt-view.component.css']
})
export class PtViewComponent implements OnInit {
  patient: any = null;
  loading = false;
  error: string = '';
  caretakersList: { name: string, phone: string, email: string }[] = [];


  constructor(
     private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.fetchPatient(id);
    } else {
      this.error = 'Invalid patient ID';
    }
  }

  fetchPatient(id: number): void {
    this.loading = true;
    this.patientService.getPatientById(id).subscribe({
      next: (res: any) => {
        // Normalize file paths
        this.patient = {
          ...res,
          photo: res.photo ? `http://localhost:4865/${res.photo.replace(/\\/g, '/')}` : '../../../assets/image.png',
          proofFile: res.proofFile
            ? res.proofFile
                .toString()
                .split(',')
                .map((f: string) => f ? `http://localhost:4865/${f.replace(/\\/g, '/')}` : null)
                .filter((f: string | null): f is string => f !== null)
            : [],
          policyFiles: res.policyFiles
            ? res.policyFiles
                .toString()
                .split(',')
                .map((f: string) => f ? `http://localhost:4865/${f.replace(/\\/g, '/')}` : null)
                .filter((f: string | null): f is string => f !== null)
            : []
        };

        // ✅ Parse caretakers after patient is set
        if (this.patient?.caretakers) {
          this.caretakersList = this.patient.caretakers
            .split("||")
            .map((ct: string) => {
              const parts = ct.split(" - ").map(p => p.trim());
              return {
                name: parts[0] || '',
                phone: parts[1] || '',
                email: parts[2] || ''
              };
            });
        }

        console.log('Caretakers:', this.caretakersList);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patient:', err);
        this.error = 'Failed to load patient data';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/ptlist']);
  }}

