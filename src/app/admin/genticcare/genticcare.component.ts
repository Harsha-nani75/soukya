import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


interface Patient {
  id: number;
  name: string;
  lname: string;
  sname: string;
  abb: string;
  abbname: string;
  gender: string;
  dob: string;
  age: number;
  ocupation: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-genticcare',
  templateUrl: './genticcare.component.html',
  styleUrls: ['./genticcare.component.css']
})
export class GenticcareComponent {

   patient: any = {};
  patients: Patient[] = [];
  idCounter = 1;

  constructor(private router: Router) {}

  onSubmit() {
    // calculate age
    if (this.patient.dob) {
      const birthDate = new Date(this.patient.dob);
      const today = new Date();
      this.patient.age = today.getFullYear() - birthDate.getFullYear();
    }

    // assign id
    this.patient.id = this.idCounter++;
    this.patients.push({ ...this.patient });

    console.log('Patient Data JSON:', this.patient);

    Swal.fire({
      icon: 'success',
      title: 'Patient Saved!',
      text: 'Patient details added successfully.'
    });

    this.patient = {}; // reset form
  }

  onView(id: number) {
    this.router.navigate(['/ptview/', id]);
  }

  onEdit(p: Patient) {
    this.patient = { ...p };
  }

  onDelete(id: number) {
    this.patients = this.patients.filter(p => p.id !== id);
    Swal.fire({
      icon: 'warning',
      title: 'Deleted!',
      text: 'Patient deleted successfully.'
    });
  }


}
