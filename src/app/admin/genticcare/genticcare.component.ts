import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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


 patient: any = {
    name: '',
    lname: '',
    sname: '',
    abb: 's/o', // Default value
    abbname: '',
    gender: 'male', // Default value
    dob: '',
    age: '',
    ocupation: '',
    phone: '',
    email: '',
    rstatus: 'Resident', // Default value
    raddress: '',
    rcity: '',
    rstate: '',
    rzipcode: '',
    paddress: '',
    pcity: '',
    pstate: '',
    pzipcode: '',
    addressTextProof: '',
    idnum: '',
    photo: '../../../assets/images/image.png',
    proofFile: [],
    policyFiles: []
  };
  
  caretakers: { name: string, phone: string, email: string, relation: string, address: string }[] = [
    { name: '', phone: '', email: '', relation: 'Son', address: '' } // Default first caretaker
  ];
  
  habits: any = {
    tobacco: 'no',
    tobaccoYears: 1,
    smoking: 'no',
    smokingYears: 1,
    alcohol: 'no',
    alcoholYears: 1,
    drugs: 'no',
    drugYears: 1
  };

  // Computed properties for habit duration ranges based on age
  get maxHabitDuration(): number {
    if (!this.patient.age || this.patient.age <= 10) {
      return 1; // Minimum value if age is not available or too young
    }
    return Math.max(1, this.patient.age - 10); // Age - 10, minimum 1
  }
  
  questions: any = {
    q1: { answer: 'no', details: '' },
    q2: { answer: 'no', details: '' },
    q3: { answer: 'no', details: '' }
  };
  
  insuranceDetails: any = {
    insuranceCompany: '',
    periodInsurance: '',
    sumInsured: '',
    policyFiles: [],
    declinedCoverage: 'no', // Default value
    similarInsurances: '',
    package: 'integral', // Default value
    packageDetail: '',
    hospitals: [{ hospitalName: '', hospitalAddress: '' }] // Default first hospital
  };
previewUrl: string | ArrayBuffer | null = null;

  selectedPhoto: File | null = null;
  addressFile: File | null = null;
  policyFiles: File[] = [];

  // Disease selection properties
  diseases: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  selectedDisease: string = '';
  diseaseDescription: string = '';
  selectedDiseases: any[] = [];
  categoryField: string = 'category_name'; // Store the actual field name from API

  isEditMode = false;
  patientId: number | null = null;
  editMode = false;
  patientIds! :string;

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
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
          photo: res.photo ? `http://localhost:4870${res.photo}` : '../../../assets/image.png',
          proofFile: res.proofFile ? [`http://localhost:4870${res.proofFile}`] : [],
          policyFiles: res.policyFiles ? [`http://localhost:4870${res.policyFiles}`] : []
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
          policyFiles: res.policyFiles ? [`http://localhost:4870${res.policyFiles}`] : [],
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
        //console.log('Patient Loaded:', this.patient);
        //console.log('Caretakers:', this.caretakers);
        //console.log('Habits:', this.habits);
        //console.log('Questions:', this.questions);
        //console.log('Insurance Details:', this.insuranceDetails);
      });
    }
  });
  
  // Load diseases data from API
  this.loadDiseases();
}



  // Load diseases from API
  loadDiseases(): void {
    this.http.get('http://localhost:4870/api/diseases').subscribe({
      next: (data: any) => {
        //console.log('Diseases loaded successfully:', data.length, 'diseases found');
        
        this.diseases = data;
        
        // Extract unique categories - handle different possible field names
        let categoryField = 'category_name';
        if (data.length > 0) {
          // Check which field contains category information
          if (data[0].category_name) {
            categoryField = 'category_name';
          } else if (data[0].category) {
            categoryField = 'category';
          } else if (data[0].categoryName) {
            categoryField = 'categoryName';
          }
        }
        
        const uniqueCategories = [...new Set(data.map((d: any) => d[categoryField]))];
        this.categories = uniqueCategories.filter(cat => cat);
        //console.log('Categories extracted:', this.categories.length, 'categories');
        
        // Store the category field name for later use
        this.categoryField = categoryField;
      },
      error: (error) => {
        console.error('Error loading diseases:', error);
      }
    });
  }

  // Filter diseases by selected category
  onCategoryChange(): void {
    this.selectedDisease = '';
    this.diseaseDescription = '';
    console.log('Category selected:', this.selectedCategory);
    
    // Force change detection to refresh dropdown
    setTimeout(() => {
      this.diseases = [...this.diseases];
    }, 100);
  }

  // Filter diseases by selected disease
  onDiseaseChange(): void {
    if (this.selectedDisease) {
      const disease = this.diseases.find(d => d.disease_name === this.selectedDisease);
      if (disease) {
        // Pre-populate with basic info but allow user to edit
        this.diseaseDescription = `Code: ${disease.code} | Category: ${disease.category_name} | System: ${disease.system_name}`;
        console.log('Disease selected:', disease);
        console.log('Disease description pre-filled, user can now edit:', this.diseaseDescription);
      }
    }
  }

  // Add selected disease to the list
  addDisease(): void {
    if (this.selectedDisease && this.selectedCategory) {
      // Find the full disease object
      const fullDisease = this.diseases.find(d => d.disease_name === this.selectedDisease);
      
      const diseaseData = {
        disease_id: fullDisease?.disease_id || 0,
        code: fullDisease?.code || '',
        category: this.selectedCategory,
        disease: this.selectedDisease,
        description: this.diseaseDescription,
        system_name: fullDisease?.system_name || ''
      };
      
      // Check if disease already exists
      const exists = this.selectedDiseases.some(d => 
        d.disease === this.selectedDisease && d.category === this.selectedCategory
      );
      
      if (!exists) {
        this.selectedDiseases.push(diseaseData);
        console.log('Disease added:', diseaseData);
        console.log('All selected diseases:', this.selectedDiseases);
        
        // Reset form
        this.selectedDisease = '';
        this.diseaseDescription = '';
      } else {
        Swal.fire('Warning', 'This disease is already selected', 'warning');
      }
    } else {
      Swal.fire('Warning', 'Please select both category and disease', 'warning');
    }
  }

  // Remove disease from selected list
  removeDisease(index: number): void {
    this.selectedDiseases.splice(index, 1);
    console.log('Disease removed. Updated list:', this.selectedDiseases);
  }

  // Clear and allow editing of disease description
  clearDescription(): void {
    this.diseaseDescription = '';
    console.log('Disease description cleared for editing');
  }

  // Get filtered diseases by category
  getDiseasesByCategory(): any[] {
    if (!this.selectedCategory) return [];
    
    const filteredDiseases = this.diseases.filter(d => {
      const categoryValue = d[this.categoryField];
      return categoryValue === this.selectedCategory;
    });
    
    console.log(`Found ${filteredDiseases.length} diseases for category: ${this.selectedCategory}`);
    return filteredDiseases;
  }



  fetchPatient(id: number): void {
    this.patientService.getPatientById(id).subscribe({
      next: (res: any) => {
        this.patient = {
          ...res,
          photo: res.photo
            = `http://localhost:4870/${res.photo.replace(/\\/g, '/')}`
            ,
          proofFile: res.proofFile
            ? res.proofFile
                .toString()
                .split(',')
                .map((f: string) =>
                  f ? `http://localhost:4870/${f.replace(/\\/g, '/')}` : null
                )
                .filter((f: string | null): f is string => f !== null)
            : [],
          policyFiles: res.policyFiles
            ? res.policyFiles
                .toString()
                .split(',')
                .map((f: string) =>
                  f ? `http://localhost:4870/${f.replace(/\\/g, '/')}` : null
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
          //console.log(this.caretakers);
        })
        this.patientService.getHabitsById(this.patientId as number).subscribe((res)=>{
          this.habits=res;
          //console.log(this.habits);
        })
        this.patientService.getQuestionsById(this.patientId as number).subscribe((res)=>{ 
          this.questions=res;
          //console.log(this.questions);
        }
        )
        this.patientService.getInsuranceDetailsById(this.patientId as number).subscribe((res)=>{
          this.insuranceDetails=res;
         // console.log(this.insuranceDetails);
        } )
        this.patientService.getInsuranceHospitalsById(this.patientId as number).subscribe((res)=>{
          this.insuranceDetails.hospitals=res;
         // console.log(this.insuranceDetails.hospitals);
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

// onFileSelected(event: any): void {
//   const file = event.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = () => {
//       this.previewUrl = reader.result; // Show preview
//     };
//     reader.readAsDataURL(file);

//   }
// }


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
      
      // Adjust habit years after age calculation
      this.adjustHabitYears();
    }
  }

  // Adjust habit years based on new age
  private adjustHabitYears(): void {
    const maxDuration = this.maxHabitDuration;
    
    // Adjust tobacco years
    if (this.habits.tobaccoYears > maxDuration) {
      this.habits.tobaccoYears = maxDuration;
    }
    
    // Adjust smoking years
    if (this.habits.smokingYears > maxDuration) {
      this.habits.smokingYears = maxDuration;
    }
    
    // Adjust alcohol years
    if (this.habits.alcoholYears > maxDuration) {
      this.habits.alcoholYears = maxDuration;
    }
    
    // Adjust drug years
    if (this.habits.drugYears > maxDuration) {
      this.habits.drugYears = maxDuration;
    }
  }

  // Handle habit years change to ensure they don't exceed age-based limit
  onHabitYearsChange(habitType: string): void {
    const maxDuration = this.maxHabitDuration;
    
    if (this.habits[habitType] > maxDuration) {
      this.habits[habitType] = maxDuration;
    }
  }

  // Handle age change to adjust habit years accordingly
  onAgeChange(): void {
    this.adjustHabitYears();
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
onSubmit() {
  // Log all form data including diseases to console
  //console.log('=== FORM SUBMISSION DATA ===');
  //console.log('Patient Data:', this.patient);
  //console.log('Caretakers:', this.caretakers);
  //console.log('Habits:', this.habits);
  //console.log('Questions:', this.questions);
  //console.log('Insurance Details:', this.insuranceDetails);
  //console.log('Selected Diseases:', this.selectedDiseases);
  //console.log('Total Diseases Selected:', this.selectedDiseases.length);
  
  // Create complete JSON object for console
  const completeFormData = {
    patient: this.patient,
    caretakers: this.caretakers || [],
    habits: this.habits || [],
    questions: this.questions || [],
    insurance: this.insuranceDetails || {},
    selectedDiseases: this.selectedDiseases,
    timestamp: new Date().toISOString()
  };
  
  //console.log('=== COMPLETE FORM DATA (JSON) ===');
  //console.log(JSON.stringify(completeFormData, null, 2));
  //console.log('=== END FORM DATA ===');

  const formData = new FormData();

  // Append JSON data
  formData.append('patient', JSON.stringify(this.patient));
  formData.append('careTaker', JSON.stringify(this.caretakers || []));
  formData.append('habits', JSON.stringify(this.habits || []));
  formData.append('questions', JSON.stringify(this.questions || []));
  formData.append('insurance', JSON.stringify(this.insuranceDetails || {}));
  formData.append('insuranceHospitals', JSON.stringify(this.insuranceDetails?.hospitals || []));
  formData.append('selectedDiseases', JSON.stringify(this.selectedDiseases || []));

  // --- PHOTO (array of paths) ---
  if (this.selectedPhoto) {
    // If new photo is chosen, upload it
    formData.append('photo', this.selectedPhoto);
    // Send existing photo paths as array (for backend to update/delete as needed)
    if (this.isEditMode && Array.isArray(this.patient.photo)) {
      formData.append('photoPaths', JSON.stringify(this.patient.photo));
    } else if (this.isEditMode && typeof this.patient.photo === 'string' && this.patient.photo) {
      formData.append('photoPaths', JSON.stringify([this.patient.photo]));
    }
  } else if (this.isEditMode && this.patient?.photo) {
    // If no new photo, send only the array of photo paths
    if (Array.isArray(this.patient.photo)) {
      formData.append('photoPaths', JSON.stringify(this.patient.photo));
    } else if (typeof this.patient.photo === 'string' && this.patient.photo) {
      formData.append('photoPaths', JSON.stringify([this.patient.photo]));
    }
  } else {
    // For new patient with no photo, fallback to default
    formData.append('photo', new File([], 'default.png'));
  }

  // --- PROOF FILE (array of paths) ---
  if (this.isEditMode && this.patient?.proofFile) {
    // Always send array of existing proof file paths
    if (Array.isArray(this.patient.proofFile)) {
      formData.append('proofFilePaths', JSON.stringify(this.patient.proofFile));
    } else if (typeof this.patient.proofFile === 'string' && this.patient.proofFile) {
      formData.append('proofFilePaths', JSON.stringify([this.patient.proofFile]));
    }
  }
  if (this.addressFile) {
    // Add new proof file
    formData.append('proofFile', this.addressFile);
  }

  // --- POLICY FILES (array of paths) ---
  if (this.isEditMode && this.insuranceDetails?.policyFiles?.length > 0) {
    formData.append('policyFilePaths', JSON.stringify(this.insuranceDetails.policyFiles));
  }
  if (this.policyFiles.length > 0) {
    this.policyFiles.forEach((file) => {
      formData.append('policyFiles', file);
    });
  }

  // --- Submit (Create / Update) ---
  //console.log('=== FORM DATA READY FOR SUBMISSION ===');
  //console.log('Selected Diseases:', this.selectedDiseases);
  //console.log('Total Diseases Selected:', this.selectedDiseases.length);
  
  if (this.isEditMode && this.patientId) {
    this.patientService.updatePatient(this.patientId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Patient details have been updated successfully.',
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (err) => {
        console.error("Update Error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed!',
          text: 'Failed to update patient details. Please try again.',
          showConfirmButton: true
        });
      }
    });
  } else {
    this.patientService.addPatient(formData).subscribe({
      next: (response) => {
        //console.log("Patient added successfully:", response);
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Patient details have been saved successfully.',
          showConfirmButton: false,
          timer: 2000
        });
        this.resetForm();
      },
      error: (err) => {
        console.error("Submit Error:", err);
        Swal.fire({
          icon: 'error',
          title: 'Save Failed!',
          text: 'Failed to save patient details. Please try again.',
          showConfirmButton: true
        });
      }
    });
  }
}
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedPhoto = file; // <-- This line is required!
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result; // Show preview
    };
    reader.readAsDataURL(file);
  }
}
resetForm() {
  this.patient = {
    name: '', lname: '', sname: '', abb: '', abbname: '', gender: '', dob: '', age: '', ocupation: '', phone: '', email: '', rstatus: '', raddress: '', rcity: '', rstate: '', rzipcode: '', paddress: '', pcity: '', pstate: '', pzipcode: '', addressTextProof: '', idnum: '', photo: '', proofFile: [], policyFiles: []
  };
  this.caretakers = [];
  this.habits = { tobacco: '', tobaccoYears: 0, smoking: '', smokingYears: 0, alcohol: '', alcoholYears: 0, drugs: '', drugYears: 0 };
  this.questions = { q1: { answer: '', details: '' }, q2: { answer: '', details: '' }, q3: { answer: '', details: '' } };
  this.insuranceDetails = { insuranceCompany: '', periodInsurance: '', sumInsured: '', policyFiles: [], declinedCoverage: '', similarInsurances: '', package: '', packageDetail: '', hospitals: [] };
  this.previewUrl = null;
  this.selectedPhoto = null;
  this.addressFile = null;
  this.policyFiles = [];
  
  // Reset disease selection
  this.selectedCategory = '';
  this.selectedDisease = '';
  this.diseaseDescription = '';
  this.selectedDiseases = [];
}

  
}


