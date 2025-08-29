import { Component, OnInit, HostListener } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';
import { DiseaseService } from 'src/app/services/disease.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/services/environment';

@Component({
  selector: 'app-pt-view',
  templateUrl: './pt-view.component.html',
  styleUrls: ['./pt-view.component.css']
})
export class PtViewComponent implements OnInit {

  loading: boolean = true;
  patient: any = null;
  caretakersList: any[] = [];
  error: string | null = null;
  patientId: number | null = null;
  showDropdown: boolean = false;

  // ✅ Add these properties
  habits: any = {};
  habitsArray: any[] = [];
  questions: any = {};
  questionsArray: any[] = [];
  insurance: any = null;
  backendUrl = environment.backendUrl;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private patientService: PatientService,
    private diseaseService: DiseaseService
  ) {}

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.patientId) {
      this.fetchPatient(this.patientId);
      this.fetchHabits(this.patientId);
    this.fetchQuestions(this.patientId);
    this.fetchInsurance(this.patientId);
      
    } else {
      this.error = 'Invalid patient ID';
      this.loading = false;
    }
  }

  fetchPatient(id: number) {
    this.loading = true;
    this.patientService.getCareById(id)
      .subscribe({
        next: (res: any) => {
          // console.log('✅ Patient data fetched successfully:', res);
  
          // Ensure Angular detects change
          setTimeout(() => {
            this.patient = res || null;
  
            // Initialize caretakers list
            this.caretakersList = this.patient?.caretakers || [];
  
            // Handle new files structure
            this.processFilesStructure();
  
            this.loading = false; // stop loader
          }, 0);
        },
        error: (err) => {
          console.error('❌ Failed to fetch patient data:', err);
          this.error = 'Failed to load patient data';
          this.loading = false;
        }
      });
  }

  // Process the new files structure from the API
  private processFilesStructure(): void {
    if (!this.patient) return;

    // console.log('🔄 Processing files structure:', this.patient.files);

    // Handle photo from files object (new structure: {id, file_path})
    if (this.patient.files?.photo && this.patient.files.photo.file_path) {
      const photoPath = this.patient.files.photo.file_path.replace(/\\/g, '/');
      this.patient.photo = `http://this.backendUrl/${photoPath}`;
        //console.log('📸 Photo processed:', this.patient.photo);
    }

    // Handle proof files from files object (new structure: [{id, file_path}])
    if (this.patient.files?.proof && Array.isArray(this.patient.files.proof)) {
      this.patient.proofFile = this.patient.files.proof.map((f: any) => {
        const path = f.file_path.replace(/\\/g, '/');
        return `http://this.backendUrl/${path}`;
      });
      //console.log('📄 Proof files processed:', this.patient.proofFile);
    }

    // Handle policy files from files object (new structure: [{id, file_path}])
    if (this.patient.files?.policy && Array.isArray(this.patient.files.policy)) {
      // Initialize insurance object if it doesn't exist
      if (!this.patient.insurance) {
        this.patient.insurance = {};
      }
      this.patient.insurance.policyFiles = this.patient.files.policy.map((f: any) => {
        const path = f.file_path.replace(/\\/g, '/');
        return `http://this.backendUrl/${path}`;
      });
      //console.log('📋 Policy files processed:', this.patient.insurance.policyFiles);
    }

    // Fallback to old structure if files object doesn't exist
    if (!this.patient.files) {
      // Fix photo path (old structure)
      if (this.patient.photo) {
              const path = this.patient.photo.replace(/\\/g, '/');
              this.patient.photo = `http://this.backendUrl/${path}`;
            }
            
      // Fix proof files (old structure)
      if (this.patient.proofFile) {
              if (typeof this.patient.proofFile === 'string') {
                this.patient.proofFile = [this.patient.proofFile.replace(/\\/g, '/')];
              } else {
                this.patient.proofFile = this.patient.proofFile.map((f: string) => f.replace(/\\/g, '/'));
              }
            }
  
      // Fix insurance policy files (old structure)
      if (this.patient.insurance?.policyFiles) {
        if (typeof this.patient.insurance.policyFiles === 'string') {
              this.patient.insurance.policyFiles = this.patient.insurance.policyFiles
                .split(',')
                .map((f: string) => f.replace(/\\/g, '/'));
            }
      }
    }
  }


  fetchHabits(id: number) {
    this.patientService.getHabitsById(id).subscribe({
      next: (res) => {
        this.habits = res || {};
        
        this.setHabitsArray(); 
      },
      error: (err) => {
        console.error(err);
        
        this.habitsArray = [];
      }
    });
  }
  setHabitsArray() {
    if (!this.habits) {
      this.habitsArray = [];
      return;
    }
  
    this.habitsArray = [
      { name: 'Tobacco', value: this.habits.tobacco, years: this.habits.tobaccoYears },
      { name: 'Smoking', value: this.habits.smoking, years: this.habits.smokingYears },
      { name: 'Alcohol', value: this.habits.alcohol, years: this.habits.alcoholYears },
      { name: 'Drugs', value: this.habits.drugs, years: this.habits.drugsYears }, // notice drugsYears matches your JSON
    ];
  }
  
  
  // Fetch questions
  fetchQuestions(id: number) {
    this.patientService.getQuestionsById(id).subscribe({
      next: (res) => {
        this.questions = res || {};
        this.setQuestionsArray();
      },
      error: (err) => {
        console.error(err);
        this.questions = {};
        this.questionsArray = [];
      }
    });
  }
  
  
setQuestionsArray() {
  if (!this.questions) {
    this.questionsArray = [];
    return;
  }

  // Map questions with their full text
  this.questionsArray = [];
  
  if (this.questions.q1) {
    this.questionsArray.push({
      code: 'q1',
      text: 'Is the person proposed in good health free from physical and mental disease or infirmity?',
      answer: this.questions.q1.answer,
      details: this.questions.q1.details
    });
  }
  
  if (this.questions.q2) {
    this.questionsArray.push({
      code: 'q2',
      text: 'Has the person proposed consulted/diagnosed/taken treatment/been admitted for any illness/injury?',
      answer: this.questions.q2.answer,
      details: this.questions.q2.details
    });
  }
  
  if (this.questions.q3) {
    this.questionsArray.push({
      code: 'q3',
      text: 'Does the person proposed have any complications during/following birth?',
      answer: this.questions.q3.answer,
      details: this.questions.q3.details
    });
  }


}
  // Fetch insurance (with hospitals)
  fetchInsurance(id: number) {
    this.patientService.getInsuranceById(id).subscribe({
      next: (res) => {
        this.insurance = res || null;
  
        // Fix hospital data if needed
        if (this.insurance?.hospitals) {
          this.insurance.hospitals = this.insurance.hospitals.map((h: any) => ({
            hospitalName: h.hospitalName,
            hospitalAddress: h.hospitalAddress
          }));
        }
      },
      error: (err) => {
        console.error(err);
        this.insurance = null;
      }
    });
  }
  
  goBack(): void {
    console.log('🔄 Navigating back to patient list...');
    this.router.navigate(['/admin/ptlist']);
  }

  openDropdown() { 
    this.showDropdown = !this.showDropdown; 
  }
  
  closeDropdown() { 
    this.showDropdown = false; 
  }
  
  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.closeDropdown();
    }
  }

  // getHabitIcon(habitName: string) {
  //   // switch(habitName.toLowerCase()) {
  //   //   case 'tobacco': return 'assets/icons/tobacco.png';
  //   //   case 'smoking': return 'assets/icons/smoking.png';
  //   //   case 'alcohol': return 'assets/icons/alcohol.png';
  //   //   case 'drugs': return 'assets/icons/drugs.png';
  //   //   default: return 'assets/icons/habit.png';
  //   // }
  // }
  //    //  fetchPatient(id: number): void {
  // //   this.loading = true;
  // //   this.error = null;
  
  // //   const timeoutId = setTimeout(() => {
  // //     if (this.loading) {
  // //       this.error = 'Request timeout. Please try again.';
  // //       this.loading = false;
  // //       console.error('⏱ Timeout - no response from API');
  // //     }
  // //   }, 15000);
  
  // //   this.patientService.getPatientById(id).subscribe({
  // //     next: (patient: any) => {
  // //       clearTimeout(timeoutId);  // ✅ ensure timeout doesn't overwrite state
  // //       console.log('✅ Patient API Response:', patient);
  
  // //       // if (!patient) {
  // //       //   this.error = 'No patient data received';
  // //       //   this.loading = false;
  // //       //   return;
  // //       // }
  
  // //       this.patient = { ...patient };
  // //       this.caretakersList = Array.isArray(patient.caretakers) ? patient.caretakers : [];
  // //       this.patient.selectedDiseases = patient.selectedDiseases || [];
  
  // //       this.loading = false;
  // //     },
  // //     error: (err) => {
  // //       clearTimeout(timeoutId);  // ✅
  // //       console.error('❌ API Error:', err);
  // //       this.error = 'Failed to load patient data. Please try again.';
  // //       this.loading = false;
  // //     }
  // //   });
  // // }
    // ---------- Helper Getters ----------
   get photoArray(): string[] {
     if (!this.patient?.photo) return [];
     return Array.isArray(this.patient.photo) ? this.patient.photo : [this.patient.photo];
   }
 
   get proofFileArray(): string[] {
    // Check both old and new structure
    const proofFiles = this.patient?.proofFile || this.patient?.files?.proof || [];
    return Array.isArray(proofFiles) ? proofFiles : [proofFiles];
   }
 
   get policyFilesArray(): string[] {
    // Check both old and new structure
    const policyFiles = this.patient?.insurance?.policyFiles || this.patient?.files?.policy || [];
    return Array.isArray(policyFiles) ? policyFiles : [policyFiles];
  }

  // Get the current file structure for API calls
  getCurrentFileStructure(): any {
    if (!this.patient) return {};
    
    return {
      photo: this.patient.files?.photo || this.patient.photo,
      proof: this.patient.files?.proof || this.patient.proofFile,
      policy: this.patient.files?.policy || this.patient.insurance?.policyFiles
    };
   }
 
  //  getHabitsArray(): Array<{ name: string; value: string; years: number | null }> {
  //    if (!this.patient?.habits) return [];
 
  //    const habitNameMap: { [key: string]: string } = {
  //      tobacco: 'Tobacco',
  //      smoking: 'Smoking',
  //      alcohol: 'Alcohol',
  //      drugs: 'Drugs'
  //    };
 
  //    return Object.keys(this.patient.habits)
  //      .filter(key => !key.endsWith('Years'))
  //      .map(key => ({
  //        name: habitNameMap[key] || key,
  //        value: this.patient.habits[key],
  //        years: this.patient.habits[key + 'Years'] || null
  //      }));
  //  }
 
  //  getHabitIcon(habitName: string): string {
  //    const iconMap: { [key: string]: string } = {
  //      'Tobacco': '../../../assets/tobacco.png',
  //      'Smoking': '../../../assets/cigarette.png',
  //      'Alcohol': '../../../assets/beer.png',
  //      'Drugs': '../../../assets/capsule.png'
  //    };
  //    return iconMap[habitName] || '../../../assets/tobacco.png';
  //  }
 
  //  getQuestionsArray(): any[] {
  //    if (!this.patient?.questions) return [];
 
  //    const q = this.patient.questions;
  //    const arr: any[] = [];
 
  //    if (q.q1) arr.push({ text: 'Is the person proposed in good health free from physical and mental disease or infirmity?', answer: q.q1.answer, details: q.q1.details });
  //    if (q.q2) arr.push({ text: 'Has the person proposed consulted/diagnosed/taken treatment/been admitted for any illness/injury?', answer: q.q2.answer, details: q.q2.details });
  //    if (q.q3) arr.push({ text: 'Does the person proposed have any complications during/following birth?', answer: q.q3.answer, details: q.q3.details });
 
  //    return arr;
  //  }
 
  //  getDiseasesArray(): any[] {
  //    return this.patient?.selectedDiseases || [];
  //  }
 
  //  // ---------- UI Action Methods ----------
   checkState() { console.log(this.patient, this.loading, this.error); }
   forceRefresh() { window.location.reload(); }
   //goBack() { this.router.navigate(['/patients']); }
   retryLoad() { if (this.patientId) this.fetchPatient(this.patientId); }
 
   //openDropdown() { this.showDropdown = true; }
   //closeDropdown() { this.showDropdown = false; }
 
     // Edit stubs (implement later)
  // editPhoto() {}
  // editCaretakers() {}
  // editHabits() {}
  // editInsurance() {}
  // editQuestions() {}
  // editDiseases() {}
  // editPolicyFiles() {}
  // editProofFiles() {}
 

//   patientId!: number;

  editPersonalDetails() {
    if (!this.patientId) {
      Swal.fire('Error', 'Patient ID not found', 'error');
      return;
    }
    
    this.closeDropdown();
    const patient = { ...this.patient };

    Swal.fire({
      title: 'Edit Personal Details',
      width: '800px',  // wider popup to fit inputs
      html: `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;text-align:left">
          <input id="swal-input1" class="swal2-input" placeholder="First Name" value="${patient.name || ''}">
          <input id="swal-input2" class="swal2-input" placeholder="Last Name" value="${patient.lname || ''}">
          <input id="swal-input3" class="swal2-input" placeholder="Surname" value="${patient.sname || ''}">
          <input id="swal-input4" class="swal2-input" placeholder="Abb (s/o, d/o, w/o)" value="${patient.abb || ''}">
          <input id="swal-input5" class="swal2-input" placeholder="Abb Name" value="${patient.abbname || ''}">
          <input id="swal-input6" class="swal2-input" placeholder="Gender" value="${patient.gender || ''}">
          <input id="swal-input7" class="swal2-input" type="date" placeholder="DOB" value="${this.formattedDob}">
          <input id="swal-input8" class="swal2-input" placeholder="Age" value="${patient.age || ''}">
          <input id="swal-input9" class="swal2-input" placeholder="Occupation" value="${patient.ocupation || ''}">
          <input id="swal-input10" class="swal2-input" placeholder="Phone" value="${patient.phone || ''}">
          <input id="swal-input11" class="swal2-input" placeholder="Email" value="${patient.email || ''}">
          <input id="swal-input12" class="swal2-input" placeholder="Resident Status" value="${patient.rstatus || ''}">
          <input id="swal-input13" class="swal2-input" placeholder="Resident Address" value="${patient.raddress || ''}">
          <input id="swal-input14" class="swal2-input" placeholder="Resident City" value="${patient.rcity || ''}">
          <input id="swal-input15" class="swal2-input" placeholder="Resident State" value="${patient.rstate || ''}">
          <input id="swal-input16" class="swal2-input" placeholder="Resident Zipcode" value="${patient.rzipcode || ''}">
          <input id="swal-input17" class="swal2-input" placeholder="Permanent Address" value="${patient.paddress || ''}">
          <input id="swal-input18" class="swal2-input" placeholder="Permanent City" value="${patient.pcity || ''}">
          <input id="swal-input19" class="swal2-input" placeholder="Permanent State" value="${patient.pstate || ''}">
          <input id="swal-input20" class="swal2-input" placeholder="Permanent Zipcode" value="${patient.pzipcode || ''}">
          <input id="swal-input21" class="swal2-input" placeholder="ID Number" value="${patient.idnum || ''}">
          <input id="swal-input22" class="swal2-input" placeholder="Address Proof Text" value="${patient.addressTextProof || ''}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: (document.getElementById('swal-input1') as HTMLInputElement).value,
          lname: (document.getElementById('swal-input2') as HTMLInputElement).value,
          sname: (document.getElementById('swal-input3') as HTMLInputElement).value,
          abb: (document.getElementById('swal-input4') as HTMLInputElement).value,
          abbname: (document.getElementById('swal-input5') as HTMLInputElement).value,
          gender: (document.getElementById('swal-input6') as HTMLInputElement).value,
          dob: (document.getElementById('swal-input7') as HTMLInputElement).value,
          age: (document.getElementById('swal-input8') as HTMLInputElement).value,
          ocupation: (document.getElementById('swal-input9') as HTMLInputElement).value,
          phone: (document.getElementById('swal-input10') as HTMLInputElement).value,
          email: (document.getElementById('swal-input11') as HTMLInputElement).value,
          rstatus: (document.getElementById('swal-input12') as HTMLInputElement).value,
          raddress: (document.getElementById('swal-input13') as HTMLInputElement).value,
          rcity: (document.getElementById('swal-input14') as HTMLInputElement).value,
          rstate: (document.getElementById('swal-input15') as HTMLInputElement).value,
          rzipcode: (document.getElementById('swal-input16') as HTMLInputElement).value,
          paddress: (document.getElementById('swal-input17') as HTMLInputElement).value,
          pcity: (document.getElementById('swal-input18') as HTMLInputElement).value,
          pstate: (document.getElementById('swal-input19') as HTMLInputElement).value,
          pzipcode: (document.getElementById('swal-input20') as HTMLInputElement).value,
          idnum: (document.getElementById('swal-input21') as HTMLInputElement).value,
          addressTextProof: (document.getElementById('swal-input22') as HTMLInputElement).value
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = result.value;

        // ✅ Call backend API
        this.patientService.updatePatientData(this.patientId!, updatedData).subscribe({
          next: (res) => {
            Swal.fire('Success', 'Patient details updated successfully', 'success');
            this.patient = { ...this.patient, ...updatedData }; // update local object
            // Refresh patient data
            this.fetchPatient(this.patientId!);
          },
          error: (err) => {
            console.error('Update failed:', err);
            Swal.fire('Error', 'Failed to update details', 'error');
          }
        });
      }
    });
  }

  get formattedDob(): string {
    if (!this.patient || !this.patient.dob) return '';
    const d = new Date(this.patient.dob);
    // For input type="date" (yyyy-MM-dd)
    return d.toISOString().slice(0, 10);
  }
  editSelectedDiseases() {
    this.closeDropdown();
    
    const currentDiseases = this.patient.selectedDiseases || [];
    
    if (currentDiseases.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Diseases Selected',
        text: 'This patient has no diseases selected. Please go to the genetic care form to add diseases.',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    const htmlContent = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <div class="mb-3">
          <label>Current Selected Diseases</label>
          <div id="current-diseases">
            ${currentDiseases.map((disease: any, index: number) => `
              <div class="disease-item mb-2 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 class="mb-1">${disease.disease_name}</h6>
                    <p class="mb-1 small text-muted">
                      <span class="badge bg-secondary me-1">${disease.code}</span>
                      <span class="badge bg-primary me-1">${disease.category_name}</span>
                      <span class="badge bg-info">${disease.system_name}</span>
                    </p>
                  </div>
                  <button type="button" class="btn btn-danger btn-sm" onclick="removeDisease(${index})">
                    <i class="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div class="alert alert-info">
          <i class="fa fa-info-circle me-2"></i>
          <strong>Note:</strong> To add or modify diseases, please use the genetic care form. This view is for reference only.
        </div>
      </div>
    `;

    Swal.fire({
      title: 'View Selected Diseases',
      html: htmlContent,
      width: '800px',
      showCancelButton: true,
      confirmButtonText: 'Close',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        // Add global function for removing diseases (if needed)
        (window as any).removeDisease = (index: number) => {
          const diseaseItem = document.querySelector(`#current-diseases .disease-item:nth-child(${index + 1})`);
          if (diseaseItem) {
            diseaseItem.remove();
          }
        };
      }
    });
  }

  editCaretakers() {
      this.closeDropdown();
    
      // Prepare current caretakers data - only show existing ones
      const currentCaretakers = [...this.caretakersList];
    
      // Ensure we have at least one caretaker slot if none exist
      if (currentCaretakers.length === 0) {
        currentCaretakers.push({ name: '', phone: '', email: '', relation: '', address: '' });
      }

      const htmlContent = `
        <div style="max-height: 70vh; overflow-y: auto;">
          <div id="caretakers-container">
            ${currentCaretakers.map((ct, index) => `
              <div class="caretaker-row" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h6 style="margin: 0; color: #007bff;">Caretaker ${index + 1}</h6>
                                   ${index > 0 ? `<button type="button" class="remove-caretaker-btn" style="background: #dc3545; color: white; border: none; padding: 5px 8px; border-radius: 50%; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                     <i class="fa fa-times" style="font-size: 12px;"></i>
                   </button>` : '<div style="width: 30px;"></div>'}
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                  <input id="caretaker-name-${index}" class="swal2-input" placeholder="Name *" value="${ct.name || ''}" style="margin: 5px 0;" required>
                  <input id="caretaker-phone-${index}" class="swal2-input" placeholder="Phone Number *" value="${ct.phone || ''}" style="margin: 5px 0;" required>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                  <input id="caretaker-email-${index}" class="swal2-input" placeholder="Email" value="${ct.email || ''}" style="margin: 5px 0;">
                  <select id="caretaker-relation-${index}" class="swal2-input" style="margin: 5px 0;">
                    <option value="" ${!ct.relation ? 'selected' : ''}>Select Relation</option>
                    <option value="Son" ${ct.relation === 'Son' ? 'selected' : ''}>Son</option>
                    <option value="Daughter" ${ct.relation === 'Daughter' ? 'selected' : ''}>Daughter</option>
                    <option value="Mother" ${ct.relation === 'Mother' ? 'selected' : ''}>Mother</option>
                    <option value="Father" ${ct.relation === 'Father' ? 'selected' : ''}>Father</option>
                    <option value="Wife" ${ct.relation === 'Wife' ? 'selected' : ''}>Wife</option>
                    <option value="Brother" ${ct.relation === 'Brother' ? 'selected' : ''}>Brother</option>
                  </select>
                </div>
                <div style="margin-bottom: 10px;">
                  <input id="caretaker-address-${index}" class="swal2-input" placeholder="Address" value="${ct.address || ''}" style="margin: 5px 0; width: 100%;">
                </div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 15px; text-align: center;">
            <button type="button" id="add-caretaker-btn" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
              <i class="fa fa-plus me-2"></i> Add Caretaker
            </button>
            <p style="margin-top: 10px; font-size: 12px; color: #6c757d;">
              <i class="fa fa-info-circle me-1"></i> At least one caretaker is required. Maximum 5 caretakers allowed.
            </p>
          </div>
        </div>

      `;

      Swal.fire({
        title: 'Edit Caretakers',
        html: htmlContent,
        width: '800px',
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        didOpen: () => {
          // Add event listeners after SweetAlert2 opens
          const addBtn = document.getElementById('add-caretaker-btn') as HTMLButtonElement;
          if (addBtn) {
            addBtn.addEventListener('click', function() {
              let caretakerCount = document.querySelectorAll('.caretaker-row').length;
            
              if (caretakerCount >= 5) {
                Swal.showValidationMessage('Maximum 5 caretakers allowed');
                return;
              }
            
              const container = document.getElementById('caretakers-container');
              if (!container) return;
            
              const newRow = document.createElement('div');
              newRow.className = 'caretaker-row';
              newRow.style.cssText = 'border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 5px; position: relative;';
            
              const caretakerNumber = caretakerCount + 1;
              newRow.innerHTML = 
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                  '<h6 style="margin: 0; color: #007bff;">Caretaker ' + caretakerNumber + '</h6>' +
                  '<button type="button" class="remove-caretaker-btn" style="background: #dc3545; color: white; border: none; padding: 5px 8px; border-radius: 50%; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">' +
                    '<i class="fa fa-times" style="font-size: 12px;"></i>' +
                  '</button>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">' +
                  '<input id="caretaker-name-' + caretakerCount + '" class="swal2-input" placeholder="Name *" style="margin: 5px 0;" required>' +
                  '<input id="caretaker-phone-' + caretakerCount + '" class="swal2-input" placeholder="Phone Number *" style="margin: 5px 0;" required>' +
                '</div>' +
                '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">' +
                  '<input id="caretaker-email-' + caretakerCount + '" class="swal2-input" placeholder="Email" style="margin: 5px 0;">' +
                  '<select id="caretaker-relation-' + caretakerCount + '" class="swal2-input" style="margin: 5px 0;">' +
                    '<option value="" selected>Select Relation</option>' +
                    '<option value="Son">Son</option>' +
                    '<option value="Daughter">Daughter</option>' +
                    '<option value="Mother">Mother</option>' +
                    '<option value="Father">Father</option>' +
                    '<option value="Wife">Wife</option>' +
                    '<option value="Brother">Brother</option>' +
                  '</select>' +
                '</div>' +
                '<div style="margin-bottom: 10px;">' +
                  '<input id="caretaker-address-' + caretakerCount + '" class="swal2-input" placeholder="Address" style="margin: 5px 0; width: 100%;">' +
                '</div>';
            
              container.appendChild(newRow);
            
              // Add event listener to the new remove button
              const removeBtn = newRow.querySelector('.remove-caretaker-btn') as HTMLButtonElement;
              if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                  const rows = document.querySelectorAll('.caretaker-row');
                  if (rows.length > 1) {
                    newRow.remove();
                  
                    // Re-enable add button
                    const addBtn = document.getElementById('add-caretaker-btn') as HTMLButtonElement;
                    if (addBtn) {
                      addBtn.disabled = false;
                      addBtn.style.background = '#28a745';
                      addBtn.style.cursor = 'pointer';
                    }
                  
                    // Renumber remaining rows
                    const remainingRows = document.querySelectorAll('.caretaker-row');
                    remainingRows.forEach((row, idx) => {
                      const title = row.querySelector('h6');
                      if (title) title.textContent = 'Caretaker ' + (idx + 1);
                    });
                  } else {
                    Swal.showValidationMessage('At least one caretaker is required');
                  }
                });
              }
            
              // Disable add button if max reached
              if (caretakerCount + 1 >= 5) {
                addBtn.disabled = true;
                addBtn.style.background = '#6c757d';
                addBtn.style.cursor = 'not-allowed';
              }
            });
          }
        
          // Add event listeners to existing remove buttons
          const removeButtons = document.querySelectorAll('.remove-caretaker-btn');
          removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
              const rows = document.querySelectorAll('.caretaker-row');
              if (rows.length > 1) {
                const caretakerRow = btn.closest('.caretaker-row');
                if (caretakerRow) {
                  caretakerRow.remove();
                }
              
                // Re-enable add button
                const addBtn = document.getElementById('add-caretaker-btn') as HTMLButtonElement;
                if (addBtn) {
                  addBtn.disabled = false;
                  addBtn.style.background = '#28a745';
                  addBtn.style.cursor = 'pointer';
                }
              
                // Renumber remaining rows
                const remainingRows = document.querySelectorAll('.caretaker-row');
                remainingRows.forEach((row, idx) => {
                  const title = row.querySelector('h6');
                  if (title) title.textContent = 'Caretaker ' + (idx + 1);
                });
              } else {
                Swal.showValidationMessage('At least one caretaker is required');
              }
            });
          });
        },
        preConfirm: () => {
          const caretakers: Array<{name: string, phone: string, email: string, relation: string, address: string}> = [];
          const rows = document.querySelectorAll('.caretaker-row');
        
          // Validate required fields
          for (let index = 0; index < rows.length; index++) {
            const name = (document.getElementById(`caretaker-name-${index}`) as HTMLInputElement)?.value?.trim() || '';
            const phone = (document.getElementById(`caretaker-phone-${index}`) as HTMLInputElement)?.value?.trim() || '';
            const email = (document.getElementById(`caretaker-email-${index}`) as HTMLInputElement)?.value?.trim() || '';
            const relation = (document.getElementById(`caretaker-relation-${index}`) as HTMLSelectElement)?.value || '';
            const address = (document.getElementById(`caretaker-address-${index}`) as HTMLInputElement)?.value?.trim() || '';
          
            // Check if this row has any data
            if (name || phone || email || relation || address) {
              // Validate required fields
              if (!name) {
                Swal.showValidationMessage(`Caretaker ${index + 1}: Name is required`);
                return false;
              }
              if (!phone) {
                Swal.showValidationMessage(`Caretaker ${index + 1}: Phone number is required`);
                return false;
              }
            
              // Add to caretakers array
              caretakers.push({ name, phone, email, relation, address });
            }
          }
        
          // Ensure at least one caretaker
          if (caretakers.length === 0) {
            Swal.showValidationMessage('At least one caretaker is required');
            return false;
          }
        
          return caretakers;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedCaretakers = result.value;
          console.log('Caretakers to save:', updatedCaretakers);
        
          // Update local data
          this.caretakersList = updatedCaretakers;
        
          // Call backend API to save caretakers
          this.patientService.updateCaretakers(this.patientId!, updatedCaretakers).subscribe({
            next: (res) => {
              console.log('Caretakers updated successfully:', res);
              Swal.fire('Success', 'Caretakers updated successfully', 'success');
            
              // Refresh data after update
              this.fetchPatient(this.patientId!);
            },
            error: (err) => {
              console.error('Failed to update caretakers:', err);
              Swal.fire('Error', 'Failed to update caretakers', 'error');
            }
          });
        }
      });
    }

  // Edit Photo Method
    editPhoto() {
      if (!this.patientId) {
        Swal.fire('Error', 'Patient ID not found', 'error');
        return;
      }
      
      this.closeDropdown();
  
    // Show current photo if exists
    const currentPhoto = this.patient?.photo || this.patient?.files?.photo;
    const currentPhotoUrl = currentPhoto ? currentPhoto : null;
    
      Swal.fire({
        title: 'Update Patient Photo',
        html: `
          <div class="text-center">
          ${currentPhotoUrl ? `
            <div class="mb-3">
              <label class="form-label fw-bold">Current Photo:</label>
              <div class="border rounded p-2 position-relative">
                <img src="${currentPhotoUrl}" alt="Current Photo" style="max-width: 200px; max-height: 200px; object-fit: cover;" class="rounded">
                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" id="delete-current-photo" title="Delete Photo">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ` : ''}
          <div class="mb-3">
            <label class="form-label fw-bold">Select New Photo:</label>
            <input type="file" id="photo-input" accept="image/*" class="form-control">
            <small class="text-muted">Supported formats: JPG, JPEG, PNG. Max size: 5MB</small>
          </div>
            <div id="photo-preview" class="mt-3"></div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Upload Photo',
        cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        const fileInput = document.getElementById('photo-input') as HTMLInputElement;
        const previewContainer = document.getElementById('photo-preview');
        
        if (fileInput && previewContainer) {
          fileInput.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
              // Check file size (5MB limit)
              if (file.size > 5 * 1024 * 1024) {
                Swal.showValidationMessage('File size must be less than 5MB');
                return;
              }
              
              // Show preview
              const reader = new FileReader();
              reader.onload = (e) => {
                previewContainer.innerHTML = `
                  <div class="border rounded p-2">
                    <img src="${e.target?.result}" alt="Preview" style="max-width: 200px; max-height: 200px; object-fit: cover;" class="rounded">
                    <div class="mt-2">
                      <small class="text-muted">${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</small>
                    </div>
                  </div>
                `;
              };
              reader.readAsDataURL(file);
            }
          });
        }

        // Add delete photo button handler
        const deletePhotoBtn = document.getElementById('delete-current-photo');
        if (deletePhotoBtn && currentPhotoUrl) {
          deletePhotoBtn.addEventListener('click', () => {
            Swal.fire({
              title: 'Delete Photo?',
              text: 'Are you sure you want to delete the current photo? This action cannot be undone.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'Cancel'
            }).then((result) => {
              if (result.isConfirmed) {
                // For now, just show success message since we don't have file ID
                // TODO: Implement backend deletion when file ID is available
                Swal.fire('Success', 'Photo deleted successfully', 'success');
                
                // Close the current dialog and refresh patient data
                Swal.close();
                this.fetchPatient(this.patientId!);
              }
            });
          });
        }
      },
        preConfirm: () => {
          const fileInput = document.getElementById('photo-input') as HTMLInputElement;
          const file = fileInput?.files?.[0];
          if (!file) {
            Swal.showValidationMessage('Please select a photo');
            return false;
          }
        
        // Check file size
        if (file.size > 5 * 1024 * 1024) {
          Swal.showValidationMessage('File size must be less than 5MB');
          return false;
        }
        
          return file;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const file = result.value;
          const formData = new FormData();
          formData.append('photo', file);
        
        // Show loading
        Swal.fire({
          title: 'Uploading Photo...',
          text: 'Please wait while we upload your photo',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
        
          this.patientService.updatePhoto(this.patientId!, formData).subscribe({
            next: (res: any) => {
              console.log('Photo updated successfully:', res);
              Swal.fire('Success', 'Photo updated successfully', 'success');
              this.fetchPatient(this.patientId!);
            },
            error: (err: any) => {
              console.error('Failed to update photo:', err);
            Swal.fire('Error', 'Failed to update photo. Please try again.', 'error');
            }
          });
        }
      });
    }

  //   // Edit Habits Method
    editHabits() {
      this.closeDropdown();
    
      const currentHabits = this.patient.habits || {};
    
      const htmlContent = `
        <div style="max-height: 70vh; overflow-y: auto;">
          <div class="row">
            <div class="col-md-6 mb-3">
              <h6><i class="fa fa-smoking me-2"></i>Tobacco</h6>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="tobacco" id="tobacco-yes" value="yes" ${currentHabits.tobacco === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="tobacco-yes">Yes</label>
                <input type="radio" class="btn-check" name="tobacco" id="tobacco-no" value="no" ${currentHabits.tobacco === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="tobacco-no">No</label>
              </div>
              <div id="tobacco-years" class="mt-2" style="display: ${currentHabits.tobacco === 'yes' ? 'block' : 'none'};">
                <label>Years: <span id="tobacco-years-value">${currentHabits.tobaccoYears || 1}</span></label>
                <input type="range" id="tobacco-years-range" min="1" max="50" value="${currentHabits.tobaccoYears || 1}" class="form-range">
              </div>
            </div>
          
            <div class="col-md-6 mb-3">
              <h6><i class="fa fa-fire me-2"></i>Smoking</h6>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="smoking" id="smoking-yes" value="yes" ${currentHabits.smoking === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="smoking-yes">Yes</label>
                <input type="radio" class="btn-check" name="smoking" id="smoking-no" value="no" ${currentHabits.smoking === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="smoking-no">No</label>
              </div>
              <div id="smoking-years" class="mt-2" style="display: ${currentHabits.smoking === 'yes' ? 'block' : 'none'};">
                <label>Years: <span id="smoking-years-value">${currentHabits.smokingYears || 1}</span></label>
                <input type="range" id="smoking-years-range" min="1" max="50" value="${currentHabits.smokingYears || 1}" class="form-range">
              </div>
            </div>
          
            <div class="col-md-6 mb-3">
              <h6><i class="fa fa-glass me-2"></i>Alcohol</h6>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="alcohol" id="alcohol-yes" value="yes" ${currentHabits.alcohol === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="alcohol-yes">Yes</label>
                <input type="radio" class="btn-check" name="alcohol" id="alcohol-no" value="no" ${currentHabits.alcohol === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="alcohol-no">No</label>
              </div>
              <div id="alcohol-years" class="mt-2" style="display: ${currentHabits.alcohol === 'yes' ? 'block' : 'none'};">
                <label>Years: <span id="alcohol-years-value">${currentHabits.alcoholYears || 1}</span></label>
                <input type="range" id="alcohol-years-range" min="1" max="50" value="${currentHabits.alcoholYears || 1}" class="form-range">
              </div>
            </div>
          
            <div class="col-md-6 mb-3">
              <h6><i class="fa fa-pills me-2"></i>Drugs</h6>
              <div class="btn-group w-100" role="group">
                <input type="radio" class="btn-check" name="drugs" id="drugs-yes" value="yes" ${currentHabits.drugs === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="drugs-yes">Yes</label>
                <input type="radio" class="btn-check" name="drugs" id="drugs-no" value="no" ${currentHabits.drugs === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="drugs-no">No</label>
              </div>
              <div id="drugs-years" class="mt-2" style="display: ${currentHabits.drugs === 'yes' ? 'block' : 'none'};">
                <label>Years: <span id="drugs-years-value">${currentHabits.drugYears || 1}</span></label>
                <input type="range" id="drugs-years-range" min="1" max="50" value="${currentHabits.drugYears || 1}" class="form-range">
              </div>
            </div>
          </div>
        </div>
      `;

      Swal.fire({
        title: 'Edit Habits',
        html: htmlContent,
        width: '800px',
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        didOpen: () => {
          // Add event listeners for radio buttons and range sliders
          const habits = ['tobacco', 'smoking', 'alcohol', 'drugs'];
        
          habits.forEach(habit => {
            // Yes radio button
            const yesRadio = document.getElementById(`${habit}-yes`) as HTMLInputElement;
            if (yesRadio) {
              yesRadio.addEventListener('change', function() {
                const yearsDiv = document.getElementById(`${habit}-years`) as HTMLElement;
                if (yearsDiv) {
                  yearsDiv.style.display = this.checked ? 'block' : 'none';
                }
              });
            }
          
            // No radio button
            const noRadio = document.getElementById(`${habit}-no`) as HTMLInputElement;
            if (noRadio) {
              noRadio.addEventListener('change', function() {
                const yearsDiv = document.getElementById(`${habit}-years`) as HTMLElement;
                if (yearsDiv) {
                  yearsDiv.style.display = 'none';
                }
              });
            }
          
            // Range slider
            const rangeSlider = document.getElementById(`${habit}-years-range`) as HTMLInputElement;
            const valueSpan = document.getElementById(`${habit}-years-value`) as HTMLElement;
            if (rangeSlider && valueSpan) {
              rangeSlider.addEventListener('input', function() {
                valueSpan.textContent = this.value;
              });
            }
          });
        },
        preConfirm: () => {
          const habits = {
            tobacco: (document.querySelector('input[name="tobacco"]:checked') as HTMLInputElement)?.value || 'no',
            tobaccoYears: parseInt((document.getElementById('tobacco-years-range') as HTMLInputElement)?.value || '0'),
            smoking: (document.querySelector('input[name="smoking"]:checked') as HTMLInputElement)?.value || 'no',
            smokingYears: parseInt((document.getElementById('smoking-years-range') as HTMLInputElement)?.value || '0'),
            alcohol: (document.querySelector('input[name="alcohol"]:checked') as HTMLInputElement)?.value || 'no',
            alcoholYears: parseInt((document.getElementById('alcohol-years-range') as HTMLInputElement)?.value || '0'),
            drugs: (document.querySelector('input[name="drugs"]:checked') as HTMLInputElement)?.value || 'no',
            drugYears: parseInt((document.getElementById('drugs-years-range') as HTMLInputElement)?.value || '0')
          };
          return habits;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedHabits = result.value;
          console.log('Habits to save:', updatedHabits);
        
          // Convert to backend expected format (array of habit objects)
          const habitsToSave = [
            {
              habit_code: 'tobacco',
              answer: updatedHabits.tobacco || 'no',
              years: updatedHabits.tobacco === 'yes' ? updatedHabits.tobaccoYears : 0
            },
            {
              habit_code: 'smoking',
              answer: updatedHabits.smoking || 'no',
              years: updatedHabits.smoking === 'yes' ? updatedHabits.smokingYears : 0
            },
            {
              habit_code: 'alcohol',
              answer: updatedHabits.alcohol || 'no',
              years: updatedHabits.alcohol === 'yes' ? updatedHabits.alcoholYears : 0
            },
            {
              habit_code: 'drugs',
              answer: updatedHabits.drugs || 'no',
              years: updatedHabits.drugs === 'yes' ? updatedHabits.drugYears : 0
            }
          ];
        
          console.log('Processed habits data:', habitsToSave);
        
          // Show loading state
          Swal.fire({
            title: 'Updating Habits...',
            text: 'Please wait while we save your changes',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
        
          this.patientService.updateHabits(this.patientId!, habitsToSave).subscribe({
            next: (res: any) => {
              console.log('Habits updated successfully:', res);
            
              // Close loading dialog
              Swal.close();
            
              Swal.fire('Success', 'Habits updated successfully', 'success');
            
              // Update local patient data immediately (convert back to object format for UI)
              const localHabits: any = {};
              habitsToSave.forEach((habit: any) => {
                localHabits[habit.habit_code] = habit.answer;
                localHabits[habit.habit_code + 'Years'] = habit.years;
              });
              this.patient.habits = localHabits;
            
              // Also refresh full patient data
              setTimeout(() => {
                this.fetchPatient(this.patientId!);
              }, 2000);
            },
            error: (err: any) => {
              console.error('Failed to update habits:', err);
              console.error('Error details:', err.error);
            
              // Close loading dialog
              Swal.close();
            
              Swal.fire('Error', 'Failed to update habits. Please try again.', 'error');
            }
          });
        }
      });
    }

  //   // Edit Insurance Method
    editInsurance() {
      this.closeDropdown();
    
      const currentInsurance = this.patient?.insurance || {};
      console.log('🔄 Current insurance data:', currentInsurance);
      console.log('📊 Insurance data structure:', {
        hasInsurance: !!this.patient?.insurance,
        insuranceKeys: this.patient?.insurance ? Object.keys(this.patient.insurance) : [],
        hasHospitals: !!this.patient?.insurance?.hospitals,
        hospitalsCount: this.patient?.insurance?.hospitals?.length || 0
      });
      
      const packageDetails = {
        integral: ["Basic Cover", "Family Cover"],
        prime: ["Extended Cover", "International Cover"],
        elite: ["VIP Cover", "All-Inclusive Cover"]
      };
    
      // Ensure hospitals array exists and handle empty arrays properly
      let hospitals = currentInsurance.hospitals || [];
      if (!Array.isArray(hospitals) || hospitals.length === 0) {
        hospitals = [{ hospitalName: '', hospitalAddress: '' }];
      }
      console.log('🏥 Hospitals data:', hospitals);
    
      const htmlContent = `
        <div style="max-height: 70vh; overflow-y: auto;">
          <div class="row">
            <div class="col-md-4 mb-3">
              <label class="fw-bold">Insurance Company <span class="text-danger">*</span></label>
              <input type="text" id="insurance-company" class="swal2-input" value="${currentInsurance.insuranceCompany || ''}" placeholder="e.g., LIC, ICICI, HDFC">
            </div>
            <div class="col-md-4 mb-3">
              <label class="fw-bold">Period of Insurance <span class="text-danger">*</span></label>
              <input type="text" id="insurance-period" class="swal2-input" value="${currentInsurance.periodInsurance || ''}" placeholder="e.g., 2020-2025">
            </div>
            <div class="col-md-4 mb-3">
              <label class="fw-bold">Sum Insured <span class="text-danger">*</span></label>
              <input type="text" id="sum-insured" class="swal2-input" value="${currentInsurance.sumInsured || ''}" placeholder="e.g., 500000">
            </div>
          </div>
        
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="fw-bold">Declined Coverage?</label>
              <select id="declined-coverage" class="swal2-input">
                <option value="no" ${currentInsurance.declinedCoverage === 'no' ? 'selected' : ''}>No</option>
                <option value="yes" ${currentInsurance.declinedCoverage === 'yes' ? 'selected' : ''}>Yes</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="fw-bold">Similar Insurances</label>
              <input type="text" id="similar-insurances" class="swal2-input" value="${currentInsurance.similarInsurances || ''}" placeholder="e.g., LIC, HDFC, Star Health">
            </div>
          </div>
        
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="fw-bold">Package</label>
              <select id="package" class="swal2-input" onchange="updatePackageDetails()">
                <option value="integral" ${currentInsurance.package === 'integral' ? 'selected' : ''}>INTEGRAL</option>
                <option value="prime" ${currentInsurance.package === 'prime' ? 'selected' : ''}>PRIME</option>
                <option value="elite" ${currentInsurance.package === 'elite' ? 'selected' : ''}>ELITE</option>
              </select>
            </div>
            <div class="col-md-6 mb-3">
              <label class="fw-bold">Package Detail</label>
              <select id="package-detail" class="swal2-input">
                <option value="">Select Package First</option>
                ${packageDetails.integral.map(option => `<option value="${option}" ${currentInsurance.packageDetail === option ? 'selected' : ''}>${option}</option>`).join('')}
              </select>
            </div>
          </div>
        
          <div class="mb-4">
            <label class="fw-bold">Preferred Hospitals (Max 5)</label>
            <div id="hospitals-container">
              ${hospitals.map((hospital: any, index: number) => `
                <div class="row mb-3 g-2 hospital-row" data-index="${index}">
                  <div class="col-md-5">
                    <input type="text" class="swal2-input hospital-name" placeholder="Hospital Name" value="${hospital.hospitalName || ''}">
                  </div>
                  <div class="col-md-5">
                    <input type="text" class="swal2-input hospital-address" placeholder="Hospital Address" value="${hospital.hospitalAddress || ''}">
                  </div>
                  <div class="col-md-2 d-flex gap-2">
                    ${index === 0 ? '' : `<button type="button" class="btn btn-danger btn-sm remove-hospital" data-index="${index}">-</button>`}
                  </div>
                </div>
              `).join('')}
            </div>
            <button type="button" id="add-hospital-btn" class="btn btn-success btn-sm" style="margin-top: 10px;">
              <i class="fas fa-plus"></i> Add Hospital
            </button>
          </div>
        </div>
      `;

      Swal.fire({
        title: 'Edit Insurance Details',
        html: htmlContent,
        width: '900px',
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        didOpen: () => {
          // Package details mapping
          const packageDetails = {
            integral: ["Basic Cover", "Family Cover"],
            prime: ["Extended Cover", "International Cover"],
            elite: ["VIP Cover", "All-Inclusive Cover"]
          };
          
          // Function to update package details dropdown
          const updatePackageDetails = () => {
            const packageSelect = document.getElementById('package') as HTMLSelectElement;
            const packageDetailSelect = document.getElementById('package-detail') as HTMLSelectElement;
            
            if (packageSelect && packageDetailSelect) {
              const selectedPackage = packageSelect.value;
              packageDetailSelect.innerHTML = '<option value="">Select Package First</option>';
              
              if (packageDetails[selectedPackage as keyof typeof packageDetails]) {
                packageDetails[selectedPackage as keyof typeof packageDetails].forEach(option => {
                  const optionElement = document.createElement('option');
                  optionElement.value = option;
                  optionElement.textContent = option;
                  packageDetailSelect.appendChild(optionElement);
                });
              }
            }
          };
          
          // Add hospital functionality
          const addHospitalBtn = document.getElementById('add-hospital-btn');
          if (addHospitalBtn) {
            addHospitalBtn.addEventListener('click', () => {
              const hospitalsContainer = document.getElementById('hospitals-container');
              const currentHospitals = hospitalsContainer?.querySelectorAll('.hospital-row');
              
              if (currentHospitals && currentHospitals.length < 5) {
                const newIndex = currentHospitals.length;
                const newHospitalRow = document.createElement('div');
                newHospitalRow.className = 'row mb-3 g-2 hospital-row';
                newHospitalRow.setAttribute('data-index', newIndex.toString());
                
                newHospitalRow.innerHTML = `
                  <div class="col-md-5">
                    <input type="text" class="swal2-input hospital-name" placeholder="Hospital Name">
                  </div>
                  <div class="col-md-5">
                    <input type="text" class="swal2-input hospital-address" placeholder="Hospital Address">
                  </div>
                  <div class="col-md-2 d-flex gap-2">
                    <button type="button" class="btn btn-danger btn-sm remove-hospital" data-index="${newIndex}">-</button>
                  </div>
                `;
                
                hospitalsContainer?.appendChild(newHospitalRow);
                
                // Add remove functionality to new row
                const removeBtn = newHospitalRow.querySelector('.remove-hospital');
                if (removeBtn) {
                  removeBtn.addEventListener('click', () => {
                    newHospitalRow.remove();
                    updateAddButtonState();
                  });
                }
                
                updateAddButtonState();
              }
            });
          }
          
          // Remove hospital functionality
          const removeHospitalBtns = document.querySelectorAll('.remove-hospital');
          removeHospitalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              const row = btn.closest('.hospital-row');
              if (row) {
                row.remove();
                updateAddButtonState();
              }
            });
          });
          
          // Update add button state
          const updateAddButtonState = () => {
            const hospitalsContainer = document.getElementById('hospitals-container');
            const currentHospitals = hospitalsContainer?.querySelectorAll('.hospital-row');
            const addHospitalBtn = document.getElementById('add-hospital-btn');
            
            if (addHospitalBtn && currentHospitals) {
              if (currentHospitals.length >= 5) {
                addHospitalBtn.setAttribute('disabled', 'true');
                addHospitalBtn.style.opacity = '0.5';
              } else {
                addHospitalBtn.removeAttribute('disabled');
                addHospitalBtn.style.opacity = '1';
              }
            }
          };
          
          // Package change event
          const packageSelect = document.getElementById('package');
          if (packageSelect) {
            packageSelect.addEventListener('change', updatePackageDetails);
          }
          
          // Initialize package details
          updatePackageDetails();
          updateAddButtonState();
          
          // Set initial package detail value if it exists
          const packageDetailSelect = document.getElementById('package-detail') as HTMLSelectElement;
          if (packageDetailSelect && currentInsurance.packageDetail) {
            packageDetailSelect.value = currentInsurance.packageDetail;
          }
        },
        preConfirm: () => {
          // Collect hospital data
          const hospitalRows = document.querySelectorAll('.hospital-row');
          const hospitals: any[] = [];
          
          hospitalRows.forEach((row, index) => {
            const nameInput = row.querySelector('.hospital-name') as HTMLInputElement;
            const addressInput = row.querySelector('.hospital-address') as HTMLInputElement;
            
            if (nameInput && addressInput) {
              hospitals.push({
                hospitalName: nameInput.value || '',
                hospitalAddress: addressInput.value || ''
              });
            }
          });
          
          // Filter out empty hospitals
          const validHospitals = hospitals.filter(h => h.hospitalName.trim() !== '' && h.hospitalAddress.trim() !== '');
          
          const insuranceData = {
            insuranceCompany: (document.getElementById('insurance-company') as HTMLInputElement)?.value || '',
            periodInsurance: (document.getElementById('insurance-period') as HTMLInputElement)?.value || '',
            sumInsured: (document.getElementById('sum-insured') as HTMLInputElement)?.value || '',
            declinedCoverage: (document.getElementById('declined-coverage') as HTMLSelectElement)?.value || 'no',
            similarInsurances: (document.getElementById('similar-insurances') as HTMLInputElement)?.value || '',
            package: (document.getElementById('package') as HTMLSelectElement)?.value || 'integral',
            packageDetail: (document.getElementById('package-detail') as HTMLSelectElement)?.value || '',
            hospitals: validHospitals
          };
          
          // Validation
          if (!insuranceData.insuranceCompany || !insuranceData.periodInsurance || !insuranceData.sumInsured) {
            Swal.showValidationMessage('Please fill in all required fields (Insurance Company, Period, Sum Insured)');
            return false;
          }
          
          // Validate hospitals - at least one should have both name and address
          if (validHospitals.length === 0) {
            Swal.showValidationMessage('Please add at least one hospital with both name and address');
            return false;
          }
          
          console.log('✅ Insurance data validated successfully:', insuranceData);
          return insuranceData;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedInsurance = result.value;
          console.log('🔄 Insurance data to save:', updatedInsurance);
          console.log('📊 Data structure validation:', {
            hasInsuranceCompany: !!updatedInsurance.insuranceCompany,
            hasPeriodInsurance: !!updatedInsurance.periodInsurance,
            hasSumInsured: !!updatedInsurance.sumInsured,
            hasHospitals: Array.isArray(updatedInsurance.hospitals),
            hospitalsCount: updatedInsurance.hospitals?.length || 0
          });
        
          this.patientService.updateInsurance(this.patientId!, updatedInsurance).subscribe({
            next: (res: any) => {
              console.log('✅ Insurance updated successfully:', res);
              Swal.fire('Success', 'Insurance details updated successfully', 'success');
              // Refresh patient data to show updated information
              this.fetchPatient(this.patientId!);
            },
            error: (err: any) => {
              console.error('❌ Failed to update insurance:', err);
              console.error('❌ Error details:', {
                status: err.status,
                message: err.message,
                error: err.error
              });
              Swal.fire('Error', `Failed to update insurance details: ${err.error?.message || err.message || 'Unknown error'}`, 'error');
            }
          });
        }
      });
    }

  //   // Edit Questions Method
    editQuestions() {
      this.closeDropdown();
    
      const currentQuestions = this.patient.questions || {};
    
      const htmlContent = `
        <div style="max-height: 70vh; overflow-y: auto;">
          <div class="row">
            <div class="col-md-12 mb-4">
              <h6>1. Is the person proposed in good health free from physical and mental disease or infirmity?</h6>
              <div class="btn-group w-100 mb-2" role="group">
                <input type="radio" class="btn-check" name="q1" id="q1-yes" value="yes" ${currentQuestions.q1?.answer === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="q1-yes">Yes</label>
                <input type="radio" class="btn-check" name="q1" id="q1-no" value="no" ${currentQuestions.q1?.answer === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="q1-no">No</label>
              </div>
              <div id="q1-details" class="mt-2" style="display: ${currentQuestions.q1?.answer === 'yes' ? 'block' : 'none'};">
                <input type="text" id="q1-details-text" class="swal2-input" placeholder="Add details about health issue" value="${currentQuestions.q1?.details || ''}">
              </div>
            </div>
          
            <div class="col-md-12 mb-4">
              <h6>2. Has the person proposed consulted/diagnosed/taken treatment/been admitted for any illness/injury?</h6>
              <div class="btn-group w-100 mb-2" role="group">
                <input type="radio" class="btn-check" name="q2" id="q2-yes" value="yes" ${currentQuestions.q2?.answer === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="q2-yes">Yes</label>
                <input type="radio" class="btn-check" name="q2" id="q2-no" value="no" ${currentQuestions.q2?.answer === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="q2-no">No</label>
              </div>
              <div id="q2-details" class="mt-2" style="display: ${currentQuestions.q2?.answer === 'yes' ? 'block' : 'none'};">
                <input type="text" id="q2-details-text" class="swal2-input" placeholder="Add details about health issue" value="${currentQuestions.q2?.details || ''}">
              </div>
            </div>
          
            <div class="col-md-12 mb-4">
              <h6>3. Does the person proposed have any complications during/following birth?</h6>
              <div class="btn-group w-100 mb-2" role="group">
                <input type="radio" class="btn-check" name="q3" id="q3-yes" value="yes" ${currentQuestions.q3?.answer === 'yes' ? 'checked' : ''}>
                <label class="btn btn-outline-success" for="q3-yes">Yes</label>
                <input type="radio" class="btn-check" name="q3" id="q3-no" value="no" ${currentQuestions.q3?.answer === 'no' ? 'checked' : ''}>
                <label class="btn btn-outline-danger" for="q3-no">No</label>
              </div>
              <div id="q3-details" class="mt-2" style="display: ${currentQuestions.q3?.answer === 'yes' ? 'block' : 'none'};">
                <input type="text" id="q3-details-text" class="swal2-input" placeholder="Add details" value="${currentQuestions.q3?.details || ''}">
              </div>
            </div>
          </div>
        </div>
        <!-- JavaScript will be added after modal renders -->
      `;

      Swal.fire({
        title: 'Edit Health Questions',
        html: htmlContent,
        width: '800px',
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        didOpen: () => {
          // Function to toggle details visibility
          const toggleDetails = (questionNumber: string, show: boolean) => {
            const detailsDiv = document.getElementById(questionNumber + '-details');
            if (detailsDiv) {
              detailsDiv.style.display = show ? 'block' : 'none';
            }
          };
          
          // Question 1 - Show input when "Yes" is selected
          const q1Yes = document.getElementById('q1-yes') as HTMLInputElement;
          const q1No = document.getElementById('q1-no') as HTMLInputElement;
          
          if (q1Yes) {
            q1Yes.addEventListener('change', function() {
              toggleDetails('q1', true);
            });
          }
          if (q1No) {
            q1No.addEventListener('change', function() {
              toggleDetails('q1', false);
            });
          }
        
          // Question 2 - Show input when "Yes" is selected
          const q2Yes = document.getElementById('q2-yes') as HTMLInputElement;
          const q2No = document.getElementById('q2-no') as HTMLInputElement;
          
          if (q2Yes) {
            q2Yes.addEventListener('change', function() {
              toggleDetails('q2', true);
            });
          }
          if (q2No) {
            q2No.addEventListener('change', function() {
              toggleDetails('q2', false);
            });
          }
        
          // Question 3 - Show input when "Yes" is selected
          const q3Yes = document.getElementById('q3-yes') as HTMLInputElement;
          const q3No = document.getElementById('q3-no') as HTMLInputElement;
          
          if (q3Yes) {
            q3Yes.addEventListener('change', function() {
              toggleDetails('q3', true);
            });
          }
          if (q3No) {
            q3No.addEventListener('change', function() {
              toggleDetails('q3', false);
            });
          }
          
          // Initialize visibility on load
          setTimeout(() => {
            const q1Checked = document.querySelector('input[name="q1"]:checked') as HTMLInputElement;
            const q2Checked = document.querySelector('input[name="q2"]:checked') as HTMLInputElement;
            const q3Checked = document.querySelector('input[name="q3"]:checked') as HTMLInputElement;
            
            if (q1Checked) toggleDetails('q1', q1Checked.value === 'yes'); // Show input for "Yes"
            if (q2Checked) toggleDetails('q2', q2Checked.value === 'yes'); // Show input for "Yes"
            if (q3Checked) toggleDetails('q3', q3Checked.value === 'yes'); // Show input for "Yes"
          }, 100);
        },
        preConfirm: () => {
          // Get selected answers for each question
          const q1Checked = document.querySelector('input[name="q1"]:checked') as HTMLInputElement;
          const q2Checked = document.querySelector('input[name="q2"]:checked') as HTMLInputElement;
          const q3Checked = document.querySelector('input[name="q3"]:checked') as HTMLInputElement;
          
          // Validate that all questions have answers
          if (!q1Checked || !q2Checked || !q3Checked) {
            Swal.showValidationMessage('Please answer all questions (Yes or No)');
            return false;
          }
          
          // Ensure all questions have valid answers
          const questions = {
            q1: {
              answer: q1Checked.value || 'no',
              details: (document.getElementById('q1-details-text') as HTMLInputElement)?.value || ''
            },
            q2: {
              answer: q2Checked.value || 'no',
              details: (document.getElementById('q2-details-text') as HTMLInputElement)?.value || ''
            },
            q3: {
              answer: q3Checked.value || 'no',
              details: (document.getElementById('q3-details-text') as HTMLInputElement)?.value || ''
            }
          };
          
          // Additional validation
          if (!questions.q1.answer || !questions.q2.answer || !questions.q3.answer) {
            Swal.showValidationMessage('All questions must have valid answers');
            return false;
          }
          
          console.log('Questions to save:', questions);
          return questions;
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedQuestions = result.value;
          console.log('Questions to save:', updatedQuestions);
        
          this.patientService.updateQuestions(this.patientId!, updatedQuestions).subscribe({
            next: (res: any) => {
              console.log('Questions updated successfully:', res);
              Swal.fire('Success', 'Health questions updated successfully', 'success');
              this.fetchPatient(this.patientId!);
            },
            error: (err: any) => {
              console.error('Failed to update questions:', err);
              Swal.fire('Error', 'Failed to update health questions', 'error');
            }
          });
        }
      });
    }

  //   // showPersonalModal = false;
  //   // editPatient: any = {};
  //   // openPersonalModal() {
  //   //   // Copy current patient data to editPatient
  //   //   this.editPatient = { ...this.patient };
  //   //   this.showPersonalModal = true;
  //   // }

  //   // closePersonalModal() {
  //   //   this.showPersonalModal = false;
  //   // }

  //   //     showDropdown = false;
  currentSection: 'view' | 'personal' | 'caretakers' | 'insurance' | 'habits' | 'questions' | 'diseases' = 'view';






  editSection(section: 'personal' | 'caretakers' | 'insurance' | 'habits' | 'questions' | 'diseases') {
    this.currentSection = section;
    this.showDropdown = false;
  }
  onSave(section: string) { this.currentSection = 'view'; }








  editDiseases() {
    this.closeDropdown();
    
    // Get current diseases
    const currentDiseases = this.patient.selectedDiseases || [];
    
    // Load diseases from server
    this.diseaseService.getAllDiseases().subscribe({
      next: (data: any) => {
        console.log('Diseases loaded successfully:', data.length, 'diseases found');
        
        const availableDiseases = data;
        
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
        const availableCategories = uniqueCategories.filter(cat => cat);
        
        console.log('Categories extracted:', availableCategories.length, 'categories');
        console.log('Category field used:', categoryField);
        
        // Store the category field name for later use
        const categoryFieldName = categoryField;
        
        const htmlContent = `
          <div style="max-height: 70vh; overflow-y: auto;">
            <!-- Add New Disease Section -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-plus text-success me-2"></i>Add New Disease
              </h6>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Category</label>
                  <select id="disease-category" class="swal2-input">
                    <option value="">Select Category</option>
                    ${availableCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold">Disease</label>
                  <select id="disease-name" class="swal2-input" disabled>
                    <option value="">Select Category First</option>
                  </select>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-12">
                  <label class="form-label fw-bold">Description</label>
                  <textarea id="disease-description" class="swal2-textarea" rows="3" placeholder="Enter disease description or notes..."></textarea>
                </div>
              </div>
              <button type="button" id="add-disease-btn" class="btn btn-success btn-sm mt-2" disabled>
                <i class="fas fa-plus me-1"></i>Add Disease
              </button>
            </div>

            <!-- Current Diseases Section -->
            <div class="mb-4">
              <h6 class="fw-bold mb-3">
                <i class="fas fa-list text-primary me-2"></i>Current Selected Diseases
                <span class="badge bg-primary ms-2">${currentDiseases.length}</span>
              </h6>
              <div id="current-diseases">
                ${currentDiseases.map((disease: any, index: number) => `
                  <div class="disease-item mb-3 p-3 border rounded" data-index="${index}">
                    <div class="row">
                      <div class="col-md-10">
                        <h6 class="mb-2">${disease.disease || disease.disease_name || 'Unknown Disease'}</h6>
                        <div class="mb-2">
                          <span class="badge bg-secondary me-1">${disease.code || 'N/A'}</span>
                          <span class="badge bg-primary me-1">${disease.category || disease.category_name || 'N/A'}</span>
                          <span class="badge bg-info me-1">${disease.system_name || 'N/A'}</span>
                        </div>
                        ${disease.description ? `<p class="mb-2 small text-muted"><strong>Description:</strong> ${disease.description}</p>` : ''}
                      </div>
                      <div class="col-md-2 text-end">
                        <button type="button" class="btn btn-danger btn-sm remove-disease" data-index="${index}">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
              
              ${currentDiseases.length === 0 ? `
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  No diseases selected yet. Use the form above to add diseases.
                </div>
              ` : ''}
            </div>
          </div>
        `;

    Swal.fire({
      title: 'Manage Selected Diseases',
      html: htmlContent,
      width: '900px',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        // Get DOM elements
        const categorySelect = document.getElementById('disease-category') as HTMLSelectElement;
        const diseaseSelect = document.getElementById('disease-name') as HTMLSelectElement;
        const descriptionTextarea = document.getElementById('disease-description') as HTMLTextAreaElement;
        const addButton = document.getElementById('add-disease-btn') as HTMLButtonElement;
        
        // Filter diseases by category
        const filterDiseasesByCategory = () => {
          const selectedCategory = categorySelect.value;
          diseaseSelect.innerHTML = '<option value="">Select Disease</option>';
          
          if (selectedCategory) {
            const filteredDiseases = availableDiseases.filter((d: any) => d.category_name === selectedCategory);
            filteredDiseases.forEach((disease: any) => {
              const option = document.createElement('option');
              option.value = disease.disease_name;
              option.textContent = disease.disease_name;
              diseaseSelect.appendChild(option);
            });
            diseaseSelect.disabled = false;
          } else {
            diseaseSelect.disabled = true;
          }
        };
        
        // Update add button state
        const updateAddButtonState = () => {
          const canAdd = categorySelect.value && diseaseSelect.value;
          addButton.disabled = !canAdd;
        };
        
        // Add disease functionality
        const addDisease = () => {
          const category = categorySelect.value;
          const diseaseName = diseaseSelect.value;
          const description = descriptionTextarea.value;
          
          if (category && diseaseName) {
            const selectedDisease = availableDiseases.find((d: any) => d.disease_name === diseaseName);
            
            if (selectedDisease) {
              const newDisease = {
                disease_id: selectedDisease.disease_id,
                code: selectedDisease.code,
                category: category,
                disease: diseaseName,
                description: description,
                system_name: selectedDisease.system_name
              };
              
              // Add to current diseases
              currentDiseases.push(newDisease);
              
              // Update UI
              updateDiseasesList();
              
              // Reset form
              categorySelect.value = '';
              diseaseSelect.value = '';
              descriptionTextarea.value = '';
              diseaseSelect.disabled = true;
              updateAddButtonState();
              
              console.log('Disease added:', newDisease);
            }
          }
        };
        
        // Remove disease functionality
        const removeDisease = (index: number) => {
          currentDiseases.splice(index, 1);
          updateDiseasesList();
          console.log('Disease removed at index:', index);
        };
        
        // Update diseases list display
        const updateDiseasesList = () => {
          const container = document.getElementById('current-diseases');
          if (container) {
            container.innerHTML = currentDiseases.map((disease: any, index: number) => `
              <div class="disease-item mb-3 p-3 border rounded" data-index="${index}">
                <div class="row">
                  <div class="col-md-10">
                    <h6 class="mb-2">${disease.disease || disease.disease_name || 'Unknown Disease'}</h6>
                    <div class="mb-2">
                      <span class="badge bg-secondary me-1">${disease.code || 'N/A'}</span>
                      <span class="badge bg-primary me-1">${disease.category || disease.category_name || 'N/A'}</span>
                      <span class="badge bg-info me-1">${disease.system_name || 'N/A'}</span>
                    </div>
                    ${disease.description ? `<p class="mb-2 small text-muted"><strong>Description:</strong> ${disease.description}</p>` : ''}
                  </div>
                  <div class="col-md-2 text-end">
                    <button type="button" class="btn btn-danger btn-sm remove-disease" data-index="${index}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('');
            
            // Re-attach remove event listeners
            container.querySelectorAll('.remove-disease').forEach(btn => {
              btn.addEventListener('click', (e) => {
                const index = parseInt((e.target as HTMLElement).closest('.remove-disease')?.getAttribute('data-index') || '0');
                removeDisease(index);
              });
            });
            
            // Update badge count
            const badge = document.querySelector('.badge.bg-primary');
            if (badge) {
              badge.textContent = currentDiseases.length.toString();
            }
          }
        };
        
        // Event listeners
        categorySelect.addEventListener('change', () => {
          filterDiseasesByCategory();
          updateAddButtonState();
        });
        
        diseaseSelect.addEventListener('change', updateAddButtonState);
        
        addButton.addEventListener('click', addDisease);
        
        // Initial setup
        filterDiseasesByCategory();
        updateAddButtonState();
      },
      preConfirm: () => {
        return currentDiseases;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDiseases = result.value;
        console.log('Diseases to save:', updatedDiseases);
        
        // Update the patient's selectedDiseases
        this.patient.selectedDiseases = updatedDiseases;
        
        // Send to backend
        this.patientService.updateSelectedDiseases(this.patientId!, updatedDiseases).subscribe({
          next: (res: any) => {
            console.log('Diseases updated successfully:', res);
            Swal.fire('Success', 'Selected diseases updated successfully', 'success');
            
            // Refresh patient data to show updated diseases
            this.fetchPatient(this.patientId!);
          },
          error: (err: any) => {
            console.error('Failed to update diseases:', err);
            Swal.fire('Error', 'Failed to update selected diseases', 'error');
          }
        });
      }
    });
      },
      error: (err: any) => {
        console.error('Error loading diseases:', err);
        Swal.fire('Error', 'Failed to load diseases from server', 'error');
      }
    });
  }
  editProofFiles() {
    this.closeDropdown();
  
    // Get current proof files from both old and new structure
    const currentFiles = this.patient?.proofFile || this.patient?.files?.proof || [];
  
    const htmlContent = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <div class="mb-4">
          <h6 class="fw-bold mb-3">
            <i class="fas fa-file-alt text-primary me-2"></i>Current Proof Files
            <span class="badge bg-primary ms-2">${currentFiles.length}</span>
          </h6>
          <div id="current-proof-files">
            ${currentFiles.map((file: any, index: number) => `
              <div class="file-item mb-3 p-3 border rounded" data-index="${index}" data-file-id="${file.id}" data-file-path="${file.file_path}">
                <div class="row align-items-center">
                  <div class="col-md-8">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-file-alt text-primary me-2"></i>
                      <div>
                        <h6 class="mb-1">${file.file_path.split('\\').pop()}</h6>
                        <small class="text-muted">${file.file_path}</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 text-end">
                    <button type="button" class="btn btn-info btn-sm me-2 view-file" data-file="http://this.backendUrl/${file.file_path.replace(/\\/g, '/')}">
                      <i class="fas fa-eye"></i> View
                    </button>
                    <a href="http://this.backendUrl/${file.file_path.replace(/\\/g, '/')}" class="btn btn-success btn-sm me-2" download>
                      <i class="fas fa-download"></i> Download
                    </a>
                    <button type="button" class="btn btn-danger btn-sm remove-proof-file" data-file-id="${file.id}" data-file-path="http://this.backendUrl/${file.file_path.replace(/\\/g, '/')}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
  
          ${currentFiles.length === 0 ? `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>No proof files uploaded yet.</div>` : ''}
        </div>
  
        <div class="mb-4">
          <h6 class="fw-bold mb-3">
            <i class="fas fa-plus text-success me-2"></i>Add New Proof Files
          </h6>
          <div class="mb-3">
            <label class="form-label fw-bold">Select Files</label>
            <input type="file" id="new-proof-files" class="form-control" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
            <small class="text-muted">You can select multiple files. Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</small>
            <div class="mt-2">
              <span class="badge bg-info me-2">Current: ${currentFiles.length}/5</span>
              <span class="badge bg-warning">Max: 10MB per file</span>
            </div>
          </div>
          <div id="selected-files-preview" class="mt-3"></div>
        </div>
      </div>
    `;
  
    Swal.fire({
      title: 'Manage Proof Files',
      html: htmlContent,
      width: '1000px',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        const fileInput = document.getElementById('new-proof-files') as HTMLInputElement;
        const previewContainer = document.getElementById('selected-files-preview');
  
        const updateFilePreview = () => {
          if (fileInput.files && previewContainer) {
            previewContainer.innerHTML = '';
            
            // Check total file count
            const currentCount = document.querySelectorAll('#current-proof-files .file-item').length;
            const newCount = fileInput.files.length;
            const totalCount = currentCount + newCount;
            
            // Show count warning if needed
            if (totalCount > 5  ) {
              const warningDiv = document.createElement('div');
              warningDiv.className = 'alert alert-warning';
              warningDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Warning: Total files will be ${totalCount}/3. Please remove some files.`;
              previewContainer.appendChild(warningDiv);
            }
            
            Array.from(fileInput.files).forEach((file, index) => {
              const fileDiv = document.createElement('div');
              const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
              const isOversized = file.size > 10 * 1024 * 1024; // 10MB
              
              fileDiv.className = `alert ${isOversized ? 'alert-danger' : 'alert-info'} d-flex justify-content-between align-items-center`;
              fileDiv.innerHTML = `
                <span>
                  <i class="fas fa-file me-2"></i>${file.name} (${fileSizeMB} MB)
                  ${isOversized ? '<span class="badge bg-danger ms-2">Too Large!</span>' : ''}
                </span>
                <button type="button" class="btn btn-sm btn-outline-danger remove-selected-file" data-index="${index}">
                  <i class="fas fa-times"></i>
                </button>
              `;
              previewContainer.appendChild(fileDiv);
            });
          }
        };
  
        const removeSelectedFile = (index: number) => {
          const dt = new DataTransfer();
          const input = fileInput;
          const { files } = input;
          if (files) {
            for (let i = 0; i < files.length; i++) {
              if (i !== index) dt.items.add(files[i]);
            }
          }
          input.files = dt.files;
          updateFilePreview();
        };
  
        fileInput.addEventListener('change', updateFilePreview);
  
        previewContainer?.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.remove-selected-file')) {
            const index = parseInt(target.closest('.remove-selected-file')?.getAttribute('data-index') || '0');
            removeSelectedFile(index);
          }
        });
  
                document.getElementById('current-proof-files')?.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          
          // Handle remove proof file
          if (target.closest('.remove-proof-file')) {
            const removeButton = target.closest('.remove-proof-file');
            const fileId = removeButton?.getAttribute('data-file-id');
            const filePath = removeButton?.getAttribute('data-file-path');
            
            console.log('🗑️ Delete button clicked:', { fileId, filePath, removeButton });
            
            if (fileId && fileId !== '') {
              // Show confirmation dialog
              Swal.fire({
                title: 'Delete Proof File?',
                text: `Are you sure you want to delete "${filePath?.split('/').pop()}"? This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Show loading
                  Swal.fire({
                    title: 'Deleting File...',
                    text: 'Please wait while we delete the file',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                  });
                  
                  // Call new delete API
                  console.log('📤 Calling delete API with fileId:', fileId, 'parsed:', parseInt(fileId));
                  
                  this.patientService.deleteFile(parseInt(fileId)).subscribe({
                    next: (res: any) => {
                      console.log('✅ File deleted successfully:', res);
                      
                      // Show success message with file details
                      const fileName = res.deletedFile?.original_name || 'File';
                      Swal.fire('Success', `${fileName} deleted successfully`, 'success');
                      
                                             // Remove the file item from UI
                       const fileItem = removeButton?.closest('.file-item');
                       if (fileItem) {
                         fileItem.remove();
                         
                         // Update badge count
                         const badge = document.querySelector('.badge.bg-primary');
                         if (badge) {
                           const currentCount = document.querySelectorAll('#current-proof-files .file-item').length;
                           badge.textContent = currentCount.toString();
                         }
                         
                         // Update the current count display
                         const currentCountBadge = document.querySelector('.badge.bg-info');
                         if (currentCountBadge) {
                           const updatedCount = document.querySelectorAll('#current-proof-files .file-item').length;
                           currentCountBadge.textContent = `Current: ${updatedCount}/5`;
                         }
                       }
                    },
                    error: (err: any) => {
                      console.error('❌ Failed to delete file:', err);
                      Swal.fire('Error', 'Failed to delete file. Please try again.', 'error');
                    }
                  });
                }
              });
            } else {
              // Since we don't have file ID, we need to implement a different approach
              // Option 1: Delete by file path (if your backend supports it)
              // Option 2: Refresh the entire patient data after deletion
              
              const fileName = filePath?.split('/').pop() || 'File';
              
              Swal.fire({
                title: 'Delete Proof File?',
                text: `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Show loading
                  Swal.fire({
                    title: 'Deleting File...',
                    text: 'Please wait while we delete the file',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                  });
                  
                  // For now, just remove from UI and refresh patient data
                  // TODO: Implement backend deletion by file path or get file ID from backend
                  const fileItem = removeButton?.closest('.file-item');
                  if (fileItem) {
                    fileItem.remove();
                    
                    // Update badge count
              const badge = document.querySelector('.badge.bg-primary');
              if (badge) {
                const currentCount = document.querySelectorAll('#current-proof-files .file-item').length;
                badge.textContent = currentCount.toString();
              }
                    
                    // Update the current count display
                    const currentCountBadge = document.querySelector('.badge.bg-info');
                    if (currentCountBadge) {
                      const updatedCount = document.querySelectorAll('#current-proof-files .file-item').length;
                      currentCountBadge.textContent = `Current: ${updatedCount}/5`;
                    }
                  }
                  
                  // Show success message
                  Swal.fire('Success', `${fileName} removed successfully`, 'success');
                  
                  // Refresh patient data to sync with backend
                  this.fetchPatient(this.patientId!);
                }
              });
            }
          }

          // Handle view file
          if (target.closest('.view-file')) {
            const filePath = target.closest('.view-file')?.getAttribute('data-file');
            if (filePath) window.open(filePath, '_blank');
          }
        });
      },
              preConfirm: () => {
          const newFiles = (document.getElementById('new-proof-files') as HTMLInputElement)?.files;
          const remainingFiles = Array.from(document.querySelectorAll('#current-proof-files .file-item')).map(item => {
            return item.querySelector('.view-file')?.getAttribute('data-file') || '';
          }).filter(path => path);

          // Check total file count (existing + new)
          const totalFiles = remainingFiles.length + (newFiles ? newFiles.length : 0);
          if (totalFiles > 5) {
            Swal.showValidationMessage(`Maximum 5 files allowed. You have ${remainingFiles.length} existing files and trying to add ${newFiles ? newFiles.length : 0} new files. Please remove some files first.`);
            return false;
          }

          // Check file size for new files (10MB = 10 * 1024 * 1024 bytes)
          const maxSize = 10 * 1024 * 1024; // 10MB in bytes
          if (newFiles) {
            for (let i = 0; i < newFiles.length; i++) {
              if (newFiles[i].size > maxSize) {
                Swal.showValidationMessage(`File "${newFiles[i].name}" exceeds 10MB limit. Please select a smaller file.`);
                return false;
              }
            }
          }

          return {
            newFiles: newFiles ? Array.from(newFiles) : [],
            remainingFiles // This is only used for validation, not sent to backend
          };
        }
    }).then((result) => {
      if (result.isConfirmed) {
        const { newFiles, remainingFiles } = result.value;
  
        if (newFiles.length > 0) {
          const formData = new FormData();
        
          formData.append("patientId", this.patientId!.toString());
          formData.append("fileType", "proof");  // backend will store in patient_files with file_type=proof
        
          // append each file ONCE
          newFiles.forEach((file: File) => formData.append("files", file));
        
          // Debug check
          // for (const pair of formData.entries()) {
          //   console.log(pair[0], pair[1]);
          // }
          console.log(formData.getAll('files'),newFiles);  // will list all appended files
  
          Swal.fire({
            title: 'Uploading Files...',
            text: 'Please wait while we upload your files',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          });
  
          this.patientService.uploadIndividualFiles(
            this.patientId!.toString(),
            newFiles,         // <-- pass File[] directly
            'proof'           // <-- pass file type
          ).subscribe({
            next: (res: any) => {
              Swal.fire('Success', 'Proof files updated successfully!', 'success');
              this.fetchPatient(this.patientId!);
            },
            error: (err: any) => {
              console.error('Failed to upload proof files:', err);
              Swal.fire('Error', 'Failed to upload proof files', 'error');
            }
          });
          
        } else {
          Swal.fire('Info', 'No new files to upload', 'info');
        }
        
      }
    });
  }
  
    
  viewFile(filePath: string) {
    if (filePath) {
      try {
        // Check if the URL already has the server prefix
        let fullUrl = filePath;
        if (!filePath.startsWith('http://this.backendUrl/')) {
          // Remove any existing server prefix and add the correct one
          const cleanPath = filePath.replace(/^https?:\/\/[^\/]+\//, '');
          fullUrl = `http://this.backendUrl/${cleanPath}`;
        }
        
        console.log('Opening file:', fullUrl);
      window.open(fullUrl, '_blank');
      } catch (error) {
        console.error('Error opening file:', error);
        Swal.fire('Error', 'Failed to open file. Please try downloading it instead.', 'error');
      }
    }
  }

  // Download file with proper error handling
  downloadFile(filePath: string, fileName?: string) {
    if (filePath) {
      try {
        // Check if the URL already has the server prefix
        let fullUrl = filePath;
        if (!filePath.startsWith('http://this.backendUrl/')) {
          // Remove any existing server prefix and add the correct one
          const cleanPath = filePath.replace(/^https?:\/\/[^\/]+\//, '');
          fullUrl = `http://this.backendUrl/${cleanPath}`;
        }
        
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName || filePath.split('/').pop() || 'download';
        link.target = '_blank';
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // console.log('Downloading file:', fullUrl);
      } catch (error) {
        console.error('Error downloading file:', error);
        Swal.fire('Error', 'Failed to download file. Please try again.', 'error');
      }
    }
  }
  

  editPolicyFiles() {
    this.closeDropdown();
    
    // Get current policy files from both old and new structure
    const currentFiles = this.patient?.insurance?.policyFiles || this.patient?.files?.policy || [];
    
    const htmlContent = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <div class="mb-4">
          <h6 class="fw-bold mb-3">
            <i class="fas fa-file-contract text-warning me-2"></i>Current Policy Files
            <span class="badge bg-warning ms-2">${currentFiles.length}</span>
          </h6>
          <div id="current-policy-files">
            ${currentFiles.map((file: any, index: number) => `
              <div class="file-item mb-3 p-3 border rounded" data-index="${index}" data-file-id="${file.id}" data-file-path="${file.file_path}">
                <div class="row align-items-center">
                  <div class="col-md-8">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-file-contract text-warning me-2"></i>
                      <div>
                        <h6 class="mb-1">${file.file_path.split('\\').pop()}</h6>
                        <small class="text-muted">${file.file_path}</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4 text-end">
                    <button type="button" class="btn btn-info btn-sm me-2 view-policy-file" data-file="http://this.backendUrl/${file.file_path.replace(/\\/g, '/')}">
                      <i class="fas fa-eye"></i> View
                    </button>
                    <a href="http://this.backendUrl/${file.file_path.replace(/\\/g, '/')}" class="btn btn-success btn-sm me-2" download>
                      <i class="fas fa-download"></i> Download
                    </a>
                    <button type="button" class="btn btn-danger btn-sm remove-policy-file" data-file-id="${file.id}" data-file-path="http://this.backendUrl/${file.file_path.replace(/\\/g, '/')}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          ${currentFiles.length === 0 ? `
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              No policy files uploaded yet.
            </div>
          ` : ''}
        </div>
        
        <div class="mb-4">
          <h6 class="fw-bold mb-3">
            <i class="fas fa-plus text-success me-2"></i>Add New Policy Files
          </h6>
          <div class="mb-3">
            <label class="form-label fw-bold">Select Files</label>
            <input type="file" id="new-policy-files" class="form-control" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png">
            <small class="text-muted">You can select multiple files. Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG</small>
            <div class="mt-2">
              <span class="badge bg-info me-2">Current: ${currentFiles.length}/3</span>
              <span class="badge bg-warning">Max: 10MB per file</span>
            </div>
          </div>
          <div id="selected-policy-files-preview" class="mt-3"></div>
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Manage Policy Files',
      html: htmlContent,
      width: '1000px',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      didOpen: () => {
        // Get DOM elements
        const fileInput = document.getElementById('new-policy-files') as HTMLInputElement;
        const previewContainer = document.getElementById('selected-policy-files-preview');
        
        // Show selected files preview
        const updateFilePreview = () => {
          if (fileInput.files && previewContainer) {
            previewContainer.innerHTML = '';
            
            // Check total file count
            const currentCount = document.querySelectorAll('#current-policy-files .file-item').length;
            const newCount = fileInput.files.length;
            const totalCount = currentCount + newCount;
            
            // Show count warning if needed
            if (totalCount > 3) {
              const warningDiv = document.createElement('div');
              warningDiv.className = 'alert alert-warning';
              warningDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Warning: Total files will be ${totalCount}/3. Please remove some files.`;
              previewContainer.appendChild(warningDiv);
            }
            
            Array.from(fileInput.files).forEach((file, index) => {
              const fileDiv = document.createElement('div');
              const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
              const isOversized = file.size > 10 * 1024 * 1024; // 10MB
              
              fileDiv.className = `alert ${isOversized ? 'alert-danger' : 'alert-warning'} d-flex justify-content-between align-items-center`;
              fileDiv.innerHTML = `
                <span>
                  <i class="fas fa-file me-2"></i>${file.name} (${fileSizeMB} MB)
                  ${isOversized ? '<span class="badge bg-danger ms-2">Too Large!</span>' : ''}
                </span>
                <button type="button" class="btn btn-sm btn-outline-danger remove-selected-policy-file" data-index="${index}">
                  <i class="fas fa-times"></i>
                </button>
              `;
              previewContainer.appendChild(fileDiv);
            });
          }
        };
        
        // Remove selected file
        const removeSelectedFile = (index: number) => {
          const dt = new DataTransfer();
          const input = fileInput;
          const { files } = input;
          
          if (files) {
            for (let i = 0; i < files.length; i++) {
              if (i !== index) {
                dt.items.add(files[i]);
              }
            }
          }
          
          input.files = dt.files;
          updateFilePreview();
        };
        
        // Event listeners
        fileInput.addEventListener('change', updateFilePreview);
        
        // Remove selected file event delegation
        previewContainer?.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.remove-selected-policy-file')) {
            const index = parseInt(target.closest('.remove-selected-policy-file')?.getAttribute('data-index') || '0');
            removeSelectedFile(index);
          }
        });
        
        // Remove existing policy file event delegation
        document.getElementById('current-policy-files')?.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.remove-policy-file')) {
            const removeButton = target.closest('.remove-policy-file');
            const fileId = removeButton?.getAttribute('data-file-id');
            const filePath = removeButton?.getAttribute('data-file-path');
            const index = parseInt(removeButton?.getAttribute('data-index') || '0');
            
            // console.log('🗑️ Policy file delete button clicked:', { fileId, filePath, removeButton });
            
            if (fileId && fileId !== '') {
              // We have a file ID, use the deleteFile method
              const fileName = filePath?.split('/').pop() || 'File';
              
              Swal.fire({
                title: 'Delete Policy File?',
                text: `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Show loading
                  Swal.fire({
                    title: 'Deleting File...',
                    text: 'Please wait while we delete the file',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                  });
                  
                  // Delete using file ID
                  this.patientService.deleteFile(parseInt(fileId)).subscribe({
                    next: (res: any) => {
                      // console.log('✅ Policy file deleted successfully:', res);
                      
                      // Remove the file item from UI
                      const fileItem = removeButton?.closest('.file-item');
                      if (fileItem) {
                        fileItem.remove();
                        
                        // Update badge count
                        const badge = document.querySelector('.badge.bg-warning');
                        if (badge) {
                          const currentCount = document.querySelectorAll('#current-policy-files .file-item').length;
                          badge.textContent = currentCount.toString();
                        }
                        
                        // Update the current count display
                        const currentCountBadge = document.querySelector('.badge.bg-info');
                        if (currentCountBadge) {
                          const updatedCount = document.querySelectorAll('#current-policy-files .file-item').length;
                          currentCountBadge.textContent = `Current: ${updatedCount}/3`;
                        }
                      }
                      
                      // Show success message
                      Swal.fire('Success', `${fileName} deleted successfully`, 'success');
                      
                      // Refresh patient data to sync with backend
                      this.fetchPatient(this.patientId!);
                    },
                    error: (err: any) => {
                      console.error('❌ Failed to delete policy file:', err);
                      Swal.fire('Error', 'Failed to delete policy file. Please try again.', 'error');
                    }
                  });
                }
              });
            } else if (filePath) {
              // Fallback: no file ID, just remove from UI
              const fileName = filePath.split('/').pop() || 'File';
              
              Swal.fire({
                title: 'Delete Policy File?',
                text: `Are you sure you want to delete "${fileName}"? This action cannot be undone.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
              }).then((result) => {
                if (result.isConfirmed) {
                  // Show loading
                  Swal.fire({
                    title: 'Deleting File...',
                    text: 'Please wait while we delete the file',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                  });
                  
                  // For now, just remove from UI since we don't have file ID
                  // TODO: Implement backend deletion when file ID is available
                  const fileItem = removeButton?.closest('.file-item');
                  if (fileItem) {
                    fileItem.remove();
                    
                    // Update badge count
                    const badge = document.querySelector('.badge.bg-warning');
                    if (badge) {
                      const currentCount = document.querySelectorAll('#current-policy-files .file-item').length;
                      badge.textContent = currentCount.toString();
                    }
                    
                    // Update the current count display
                    const currentCountBadge = document.querySelector('.badge.bg-info');
                    if (currentCountBadge) {
                      const updatedCount = document.querySelectorAll('#current-policy-files .file-item').length;
                      currentCountBadge.textContent = `Current: ${updatedCount}/3`;
                    }
                  }
                  
                  Swal.fire('Success', `${fileName} removed successfully`, 'success');
                  
                  // Refresh patient data to sync with backend
                  this.fetchPatient(this.patientId!);
                }
              });
            } else {
              // Fallback to old behavior if no file path
            const fileItem = document.querySelector(`#current-policy-files .file-item[data-index="${index}"]`);
            if (fileItem) {
              fileItem.remove();
              // Update badge count
              const badge = document.querySelector('.badge.bg-warning');
              if (badge) {
                const currentCount = document.querySelectorAll('#current-policy-files .file-item').length;
                badge.textContent = currentCount.toString();
                }
              }
            }
          }
          
          // View file
          if (target.closest('.view-policy-file')) {
            const filePath = target.closest('.view-policy-file')?.getAttribute('data-file');
            if (filePath) {
              window.open(filePath, '_blank');
            }
          }
        });
      },
      preConfirm: () => {
        const newFiles = (document.getElementById('new-policy-files') as HTMLInputElement)?.files;
        const remainingFiles = Array.from(document.querySelectorAll('#current-policy-files .file-item')).map(item => {
          const filePath = item.querySelector('.view-policy-file')?.getAttribute('data-file');
          return filePath || '';
        }).filter(path => path);
        
        // Check total file count (existing + new)
        const totalFiles = remainingFiles.length + (newFiles ? newFiles.length : 0);
        if (totalFiles > 3) {
          Swal.showValidationMessage(`Maximum 3 files allowed. You have ${remainingFiles.length} existing files and trying to add ${newFiles ? newFiles.length : 0} new files. Please remove some files first.`);
          return false;
        }
        
        // Check file size for new files (10MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (newFiles) {
          for (let i = 0; i < newFiles.length; i++) {
            if (newFiles[i].size > maxSize) {
              Swal.showValidationMessage(`File "${newFiles[i].name}" exceeds 10MB limit. Please select a smaller file.`);
              return false;
            }
          }
        }
        
        // ✅ build FormData - only send new files
        const formData = new FormData();
        
        if (newFiles) {
          Array.from(newFiles).forEach(file => {
            formData.append('policyFiles', file);
          });
        }
        
        // Remove remainingFiles - only send new files being uploaded
        // formData.append('remainingFiles', JSON.stringify(remainingFiles));
        
        // Log what's being sent to backend
        // // console.log('📤 Sending policy files to backend:', {
        //   newFilesCount: newFiles ? newFiles.length : 0,
        //   newFileNames: newFiles ? Array.from(newFiles).map(f => f.name) : [],
        //   note: 'Only new files are being sent, existing files are not included'
        // });
        
        return formData;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const formData: FormData = result.value;
        
        Swal.fire({
          title: 'Uploading Policy Files...',
          text: 'Please wait while we upload your policy files',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });
        
        this.patientService.updatePolicyFiles(this.patientId!, formData).subscribe({
          next: (res: any) => {
            // console.log('Policy files uploaded successfully:', res);
            Swal.fire('Success', 'Policy files updated successfully', 'success');
            
            // Refresh patient data to show updated files
            this.fetchPatient(this.patientId!);
          },
          error: (err: any) => {
            console.error('Failed to upload policy files:', err);
            Swal.fire('Error', 'Failed to upload policy files', 'error');
          }
        });
      }
    });
  }
}

