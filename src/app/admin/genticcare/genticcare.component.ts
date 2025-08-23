import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Patient } from './patient.model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-genticcare',
  templateUrl: './genticcare.component.html',
  styleUrls: ['./genticcare.component.css']
})
export class GenticcareComponent  implements OnInit {

  packageDetails: any = {
    integral: ["Basic Cover", "Family Cover"],
    prime: ["Extended Cover", "International Cover"],
    elite: ["VIP Cover", "All-Inclusive Cover"]
  };


 patient: any = {};
caretakers: { name: string, phone: string, email: string, relation: string, address: string }[] = [];
  habits: any = {};
  questions: any = {
    q1: { answer: '', details: '' },
    q2: { answer: '', details: '' },
    q3: { answer: '', details: '' }
  };
  insuranceDetails: any = {
    hospitals: [{}]
  };
previewUrl: string | ArrayBuffer | null = null;

  selectedPhoto: File | null = null;
  addressFile: File | null = null;
  policyFiles: File[] = [];

  isEditMode = false;
  patientId: number | null = null;
  editMode = false;
  patientIds! :string;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  
  // ngOnInit(): void {
  //   this.route.paramMap.subscribe(params => {const id = params.get('id');
  //     if (id) { this.editMode = true;
  //       this.patientIds = id;
  //       this.fetchPatient(this.patientIds as unknown as number);
  //     }});
    
  
  //   this.patientId = this.route.snapshot.params['id'];
  //   if (this.patientId) {
  //     this.isEditMode = true;
  //     this.patientService.getPatientById(this.patientId).subscribe((res) => {
  //       console.log(res,'res checking..');
        
  //       // load patient data into form
  //       this.patient = res.patient;
  //       // this.address = res.address;
  //       this.caretakers = res.careTaker;
  //       this.habits = res.habits;
  //       this.questions = res.questions;
  //       this.insuranceDetails = res.insuranceDetails;
  //     });
  //   }
  // }
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (id) {
      this.isEditMode = true;
      this.patientId = +id;

      // 1. Patient core details
      this.patientService.getPatientById(this.patientId).subscribe((res: any) => {
        this.patient = {
          name: res.name || '',
          lname: res.lname || '',
          sname: res.sname || '',
          abb: res.abb || '',
          abbname: res.abbname || '',
          gender: res.gender || '',
          dob: res.dob ? res.dob.substring(0, 10) : '',
          age: res.age || '',
          ocupation: res.ocupation || '',
          phone: res.phone || '',
          email: res.email || '',
          rstatus: res.rstatus || '',
          raddress: res.raddress || '',
          rcity: res.rcity || '',
          rstate: res.rstate || '',
          rzipcode: res.rzipcode || '',
          paddress: res.paddress || '',
          pcity: res.pcity || '',
          pstate: res.pstate || '',
          pzipcode: res.pzipcode || '',
          addressTextProof: res.addressTextProof || '',
          idnum: res.idnum || '',
          photo: res.photo ? `http://localhost:4865${res.photo}` : '../../../assets/image.png',
          proofFile: res.proofFile ? [`http://localhost:4865${res.proofFile}`] : [],
          policyFiles: res.policyFiles ? [`http://localhost:4865${res.policyFiles}`] : []
        };

        // Caretakers (string to array, robust parsing)
        this.caretakers = [];
        if (res.caretakers) {
          res.caretakers.split('||').forEach((ct: string) => {
            const parts = ct.split(' - ');
            // Format: Name (Relation) - Phone - Email - Address (optional)
            let name = '', relation = '', phone = '', email = '', address = '';
            if (parts.length >= 3) {
              const nameRel = parts[0].split('(');
              name = nameRel[0]?.trim() || '';
              relation = nameRel[1] ? nameRel[1].replace(')', '').trim() : '';
              phone = parts[1]?.trim() || '';
              email = parts[2]?.trim() || '';
              address = parts[3]?.trim() || '';
            }
            this.caretakers.push({ name, relation, phone, email, address });
          });
        }

        // Habits (string to object, robust parsing)
        this.habits = {};
        if (res.habits) {
          res.habits.split('||').forEach((h: string) => {
            const [codeAnswer, yearsStr] = h.split('-');
            const [code, answer] = codeAnswer.split(':');
            if (code && answer) {
              this.habits[code.trim()] = answer.trim();
              if (yearsStr) {
                const yearsMatch = yearsStr.match(/(\d+)/);
                this.habits[`${code.trim()}Years`] = yearsMatch ? parseInt(yearsMatch[1]) : 0;
              }
            }
          });
        }

        // Questions (string to object, robust parsing)
        this.questions = { q1: { answer: '', details: '' }, q2: { answer: '', details: '' }, q3: { answer: '', details: '' } };
        if (res.questions) {
          res.questions.split('||').forEach((q: string) => {
            // Format: q1: yes (details)
            const codeMatch = q.match(/(q\d):\s*(yes|no)(?:\s*\(([^)]*)\))?/);
            if (codeMatch) {
              const code = codeMatch[1];
              const answer = codeMatch[2];
              const details = codeMatch[3] || '';
              this.questions[code] = { answer, details };
            }
          });
        }

        // Insurance details
        this.insuranceDetails = {
          insuranceCompany: res.insuranceCompany || '',
          periodInsurance: res.periodInsurance || '',
          sumInsured: res.sumInsured || '',
          policyFiles: res.policyFiles ? [`http://localhost:4865${res.policyFiles}`] : [],
          declinedCoverage: res.declinedCoverage || '',
          similarInsurances: res.similarInsurances || '',
          package: res.package || '',
          packageDetail: res.packageDetail || '',
          hospitals: []
        };

        // Hospital preferences (string to array, robust parsing)
        this.insuranceDetails.hospitals = [];
        if (res.insurance_hospitals) {
          res.insurance_hospitals.split('||').forEach((h: string) => {
            const [hospitalName, hospitalAddress] = h.split(' - ');
            this.insuranceDetails.hospitals.push({
              hospitalName: hospitalName ? hospitalName.trim() : '',
              hospitalAddress: hospitalAddress ? hospitalAddress.trim() : ''
            });
          });
        }

        // Final log for verification
        console.log('Patient Loaded:', this.patient);
        console.log('Caretakers:', this.caretakers);
        console.log('Habits:', this.habits);
        console.log('Questions:', this.questions);
        console.log('Insurance Details:', this.insuranceDetails);
      });
    }
  });
}



  fetchPatient(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (res: any) => {
        this.patient = {
          ...res,
          photo: res.photo
            ? `http://localhost:4865/${res.photo.replace(/\\/g, '/')}`
            : '../../../assets/image.png',
          proofFile: res.proofFile
            ? res.proofFile
                .toString()
                .split(',')
                .map((f: string) =>
                  f ? `http://localhost:4865/${f.replace(/\\/g, '/')}` : null
                )
                .filter((f: string | null): f is string => f !== null)
            : [],
          policyFiles: res.policyFiles
            ? res.policyFiles
                .toString()
                .split(',')
                .map((f: string) =>
                  f ? `http://localhost:4865/${f.replace(/\\/g, '/')}` : null
                )
                .filter((f: string | null): f is string => f !== null)
            : []
        };

        // caretakers string → array
        if (this.patient?.caretakers) {
          this.caretakers = this.patient.caretakers
            .split("||")
            .map((ct: string) => {
              const parts = ct.split(" - ").map(p => p.trim());
              return {
                name: parts[0] || '',
                phone: parts[1] || '',
                email: parts[2] || '',
                relation: parts[3] || '',
                address: parts[4] || ''
              };
            });
        }
        this.patientService.getCareById(this.patientId as number).subscribe((res)=>{
          this.caretakers=res;
          console.log(this.caretakers);
        })
        this.patientService.getHabitsById(this.patientId as number).subscribe((res)=>{
          this.habits=res;
          console.log(this.habits);
        })
        this.patientService.getQuestionsById(this.patientId as number).subscribe((res)=>{ 
          this.questions=res;
          console.log(this.questions);
        }
        )
        this.patientService.getInsuranceDetailsById(this.patientId as number).subscribe((res)=>{
          this.insuranceDetails=res;
          console.log(this.insuranceDetails);
        } )
        this.patientService.getInsuranceHospitalsById(this.patientId as number).subscribe((res)=>{
          this.insuranceDetails.hospitals=res;
          console.log(this.insuranceDetails.hospitals);
        } )

        // load other nested objects
       // this.habits = res.habits || {};
       // this.questions = res.questions || this.questions;
       // this.insuranceDetails = res.insuranceDetails || { hospitals: [{}] };
       // console.log('Patient data loaded:', this.patient);
      },
      error: (err) => {
        console.error('Error fetching patient:', err);
        Swal.fire('Error', 'Failed to load patient data', 'error');
      }
    });
  }

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result; // Show preview
    };
    reader.readAsDataURL(file);

  }
}


  onAddressFileSelected(event: any) {
    this.addressFile = event.target.files[0];
  }

  onFileChange(event: any) {
    this.policyFiles = Array.from(event.target.files);
  }

  // 📌 Age calculation
  calculateAge() {
    if (this.patient.dob) {
      const today = new Date();
      const birthDate = new Date(this.patient.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.patient.age = age;
    }
  }

// 📌 Add/Remove hospital preferences
addHospital() {
  if (this.insuranceDetails.hospitals.length < 5) {
    this.insuranceDetails.hospitals.push({ hospitalName: '', hospitalAddress: '' });
  }
}

removeHospital(i: number) {
  this.insuranceDetails.hospitals.splice(i, 1);
}
//add caretaker
addCaretaker(): void {
  if (this.caretakers.length < 5) {
    this.caretakers.push({ name: '', phone: '', email: '', relation: '', address: '' });
  }
}

removeCaretaker(index: number): void {
  this.caretakers.splice(index, 1);
}

// 📌 Submit
onSubmit() {
  const formData = new FormData();

  // JSON.stringify objects/arrays
  formData.append('patient', JSON.stringify(this.patient));
  formData.append('careTaker', JSON.stringify(this.caretakers || []));
  formData.append('habits', JSON.stringify(this.habits || []));
  formData.append('questions', JSON.stringify(this.questions || []));
  formData.append('insurance', JSON.stringify(this.insuranceDetails || {}));
  formData.append('insuranceHospitals', JSON.stringify(this.insuranceDetails?.hospitals || []));

  // Files
  if (this.selectedPhoto) {
    formData.append('photo', this.selectedPhoto);
  }
  if (this.addressFile) {
    formData.append('proofFile', this.addressFile);
  }
  if (this.policyFiles.length > 0) {
    this.policyFiles.forEach((file) => {
      formData.append('policyFiles', file); // multiple files, same key
    });
  }

  // ✅ Print all formData content to console
//   console.log("🚀 Sending FormData:");
// formData.forEach((value, key) => {
//   console.log(key, value);
// });


  if (this.isEditMode && this.patientId) {
    this.patientService.updatePatient(this.patientId, formData).subscribe({
      next: () => {
        alert('Patient updated successfully');
        this.router.navigate(['/patients']);
      },
      error: (err) => console.error(err)
    });
  } else {
    this.patientService.addPatient(formData).subscribe({
      next: () => {
Swal.fire({
      icon: 'success',
      title: 'Saved!',
      text: 'Patient details have been saved successfully.',
      showConfirmButton: false,
      timer: 2000
    })
            this.router.navigate(['/admin/gentic']);
      },
      error: (err) => console.error("Submit Error:", err)
    });
  }

  
}

}
