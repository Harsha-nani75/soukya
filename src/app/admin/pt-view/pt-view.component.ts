import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-pt-view',
  templateUrl: './pt-view.component.html',
  styleUrls: ['./pt-view.component.css']
})
export class PtViewComponent implements OnInit {

  patientId!: number;
  get formattedDob(): string {
    if (!this.patient || !this.patient.dob) return '';
    const d = new Date(this.patient.dob);
    // For input type="date" (yyyy-MM-dd)
    return d.toISOString().slice(0, 10);
  }
  editPersonalDetails() {
    const id=this.patientId
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
      this.patientService.updatePatientData(id, updatedData).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Patient details updated successfully', 'success');
          this.patient = { ...this.patient, ...updatedData }; // update local object
        },
        error: (err) => {
          console.error('Update failed:', err);
          Swal.fire('Error', 'Failed to update details', 'error');
        }
      });
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
        this.patientService.updateCaretakers(this.patientId, updatedCaretakers).subscribe({
          next: (res) => {
            console.log('Caretakers updated successfully:', res);
            Swal.fire('Success', 'Caretakers updated successfully', 'success');
            
            // Refresh caretakers list to show updated data
            this.fetchCaretakers(this.patientId);
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
    this.closeDropdown();
    
    Swal.fire({
      title: 'Update Patient Photo',
      html: `
        <div class="text-center">
          <input type="file" id="photo-input" accept="image/*" class="form-control mb-3">
          <div id="photo-preview" class="mt-3"></div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload Photo',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const fileInput = document.getElementById('photo-input') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        if (!file) {
          Swal.showValidationMessage('Please select a photo');
          return false;
        }
        return file;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const file = result.value;
        const formData = new FormData();
        formData.append('photo', file);
        
        this.patientService.updatePhoto(this.patientId, formData).subscribe({
          next: (res: any) => {
            console.log('Photo updated successfully:', res);
            Swal.fire('Success', 'Photo updated successfully', 'success');
            this.fetchPatient(this.patientId);
          },
          error: (err: any) => {
            console.error('Failed to update photo:', err);
            Swal.fire('Error', 'Failed to update photo', 'error');
          }
        });
      }
    });
  }

  // Edit Habits Method
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
        
        this.patientService.updateHabits(this.patientId, habitsToSave).subscribe({
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
            
            // Try to refresh habits data specifically
            setTimeout(() => {
              this.refreshHabitsData();
            }, 1000);
            
            // Also refresh full patient data
            setTimeout(() => {
              this.fetchPatient(this.patientId);
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

  // Edit Insurance Method
  editInsurance() {
    this.closeDropdown();
    
    const currentInsurance = this.patient.insuranceDetails || {};
    
    const htmlContent = `
      <div style="max-height: 70vh; overflow-y: auto;">
        <div class="row">
          <div class="col-md-4 mb-3">
            <label>Insurance Company</label>
            <input type="text" id="insurance-company" class="swal2-input" value="${currentInsurance.insuranceCompany || ''}" placeholder="Company Name">
          </div>
          <div class="col-md-4 mb-3">
            <label>Period of Insurance</label>
            <input type="text" id="insurance-period" class="swal2-input" value="${currentInsurance.periodInsurance || ''}" placeholder="Period">
          </div>
          <div class="col-md-4 mb-3">
            <label>Sum Insured</label>
            <input type="text" id="sum-insured" class="swal2-input" value="${currentInsurance.sumInsured || ''}" placeholder="Amount">
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Declined Coverage?</label>
            <select id="declined-coverage" class="swal2-input">
              <option value="" ${!currentInsurance.declinedCoverage ? 'selected' : ''}>Select</option>
              <option value="yes" ${currentInsurance.declinedCoverage === 'yes' ? 'selected' : ''}>Yes</option>
              <option value="no" ${currentInsurance.declinedCoverage === 'no' ? 'selected' : ''}>No</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label>Similar Insurances</label>
            <input type="text" id="similar-insurances" class="swal2-input" value="${currentInsurance.similarInsurances || ''}" placeholder="Other insurances">
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-6 mb-3">
            <label>Package</label>
            <select id="package" class="swal2-input">
              <option value="" ${!currentInsurance.package ? 'selected' : ''}>Select Package</option>
              <option value="integral" ${currentInsurance.package === 'integral' ? 'selected' : ''}>INTEGRAL</option>
              <option value="prime" ${currentInsurance.package === 'prime' ? 'selected' : ''}>PRIME</option>
              <option value="elite" ${currentInsurance.package === 'elite' ? 'selected' : ''}>ELITE</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label>Package Detail</label>
            <input type="text" id="package-detail" class="swal2-input" value="${currentInsurance.packageDetail || ''}" placeholder="Package details">
          </div>
        </div>
        
        <div class="mb-3">
          <label>Preferred Hospitals</label>
          <textarea id="hospitals" class="swal2-textarea" placeholder="Enter hospital preferences">${currentInsurance.hospitals || ''}</textarea>
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Edit Insurance Details',
      html: htmlContent,
      width: '800px',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const insuranceData = {
          insuranceCompany: (document.getElementById('insurance-company') as HTMLInputElement)?.value || '',
          periodInsurance: (document.getElementById('insurance-period') as HTMLInputElement)?.value || '',
          sumInsured: (document.getElementById('sum-insured') as HTMLInputElement)?.value || '',
          declinedCoverage: (document.getElementById('declined-coverage') as HTMLSelectElement)?.value || '',
          similarInsurances: (document.getElementById('similar-insurances') as HTMLInputElement)?.value || '',
          package: (document.getElementById('package') as HTMLSelectElement)?.value || '',
          packageDetail: (document.getElementById('package-detail') as HTMLInputElement)?.value || '',
          hospitals: (document.getElementById('hospitals') as HTMLTextAreaElement)?.value || ''
        };
        return insuranceData;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedInsurance = result.value;
        console.log('Insurance to save:', updatedInsurance);
        
        this.patientService.updateInsurance(this.patientId, updatedInsurance).subscribe({
          next: (res: any) => {
            console.log('Insurance updated successfully:', res);
            Swal.fire('Success', 'Insurance details updated successfully', 'success');
            this.fetchPatient(this.patientId);
          },
          error: (err: any) => {
            console.error('Failed to update insurance:', err);
            Swal.fire('Error', 'Failed to update insurance details', 'error');
          }
        });
      }
    });
  }

  // Edit Questions Method
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
              <textarea id="q1-details-text" class="swal2-textarea" placeholder="Add details about health issue">${currentQuestions.q1?.details || ''}</textarea>
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
              <textarea id="q2-details-text" class="swal2-textarea" placeholder="Add details about health issue">${currentQuestions.q2?.details || ''}</textarea>
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
              <textarea id="q3-details-text" class="swal2-textarea" placeholder="Add details">${currentQuestions.q3?.details || ''}</textarea>
            </div>
          </div>
        </div>
      </div>
      <script>
        // Question 1
        document.getElementById('q1-yes').addEventListener('change', function() {
          document.getElementById('q1-details').style.display = this.checked ? 'block' : 'none';
        });
        document.getElementById('q1-no').addEventListener('change', function() {
          document.getElementById('q1-details').style.display = 'none';
        });
        
        // Question 2
        document.getElementById('q2-yes').addEventListener('change', function() {
          document.getElementById('q2-details').style.display = this.checked ? 'block' : 'none';
        });
        document.getElementById('q2-no').addEventListener('change', function() {
          document.getElementById('q2-details').style.display = 'none';
        });
        
        // Question 3
        document.getElementById('q3-yes').addEventListener('change', function() {
          document.getElementById('q3-details').style.display = this.checked ? 'block' : 'none';
        });
        document.getElementById('q3-no').addEventListener('change', function() {
          document.getElementById('q3-details').style.display = 'none';
        });
      </script>
    `;

    Swal.fire({
      title: 'Edit Health Questions',
      html: htmlContent,
      width: '800px',
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      cancelButtonText: 'Cancel',
      focusConfirm: false,
      preConfirm: () => {
        const questions = {
          q1: {
            answer: (document.querySelector('input[name="q1"]:checked') as HTMLInputElement)?.value || 'no',
            details: (document.getElementById('q1-details-text') as HTMLTextAreaElement)?.value || ''
          },
          q2: {
            answer: (document.querySelector('input[name="q2"]:checked') as HTMLInputElement)?.value || 'no',
            details: (document.getElementById('q2-details-text') as HTMLTextAreaElement)?.value || ''
          },
          q3: {
            answer: (document.querySelector('input[name="q3"]:checked') as HTMLInputElement)?.value || 'no',
            details: (document.getElementById('q3-details-text') as HTMLTextAreaElement)?.value || ''
          }
        };
        return questions;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedQuestions = result.value;
        console.log('Questions to save:', updatedQuestions);
        
        this.patientService.updateQuestions(this.patientId, updatedQuestions).subscribe({
          next: (res: any) => {
            console.log('Questions updated successfully:', res);
            Swal.fire('Success', 'Health questions updated successfully', 'success');
            this.fetchPatient(this.patientId);
          },
          error: (err: any) => {
            console.error('Failed to update questions:', err);
            Swal.fire('Error', 'Failed to update health questions', 'error');
          }
        });
      }
    });
  }

  showPersonalModal = false;
  editPatient: any = {};
  openPersonalModal() {
    // Copy current patient data to editPatient
    this.editPatient = { ...this.patient };
    this.showPersonalModal = true;
  }

  closePersonalModal() {
    this.showPersonalModal = false;
  }

      showDropdown = false;
  currentSection: 'view' | 'personal' | 'caretakers' | 'insurance' | 'habits' | 'questions' = 'view';

  patient: any;
  caretakersList: any[] = [];
  caretakers: any[] = [];
  insuranceDetails: any;
  habits: any[] = [];
  questions: any[] = [];

  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.patientId=Number(this.route.snapshot.paramMap.get('id'));
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
        // Process habits data
        let habits: any = {};
        if (res.habits) {
          try {
            const rawHabits = typeof res.habits === 'string' ? JSON.parse(res.habits) : res.habits;
            console.log('Raw habits data:', rawHabits);
            
            // Convert array format to object format
            if (Array.isArray(rawHabits)) {
              rawHabits.forEach((habit: any) => {
                if (habit.habit_code && habit.answer) {
                  habits[habit.habit_code] = habit.answer;
                  habits[habit.habit_code + 'Years'] = habit.years || 0;
                }
              });
            } else {
              habits = rawHabits;
            }
            
            console.log('Processed habits data:', habits);
          } catch (e) {
            console.warn('Failed to parse habits data:', e);
            habits = {};
          }
        } else {
          console.log('No habits data in response');
        }

        // Process questions data
        let questions = {};
        if (res.questions) {
          try {
            questions = typeof res.questions === 'string' ? JSON.parse(res.questions) : res.questions;
          } catch (e) {
            console.warn('Failed to parse questions data:', e);
            questions = {};
          }
        }

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
            : [],
          habits: habits,
          questions: questions
        };

        // Fetch caretakers separately
        this.fetchCaretakers(id);
        this.fetchHabits(id)

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching patient:', err);
        this.error = 'Failed to load patient data';
        this.loading = false;
      }
    });
  }

  fetchCaretakers(id: number): void {
    this.patientService.getCareById(id).subscribe({
      next: (res: any) => {
        this.caretakersList = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        console.error('Error fetching caretakers:', err);
        this.caretakersList = [];
      }
    });
  }
 fetchHabits(id: number): void {
  this.patientService.getHabitsById(id).subscribe({
    next: (res: any) => {
      // res is already a key-value object
      this.patient.habits = res;
      console.log('Patient habits:', this.patient.habits);
    },
    error: (err) => console.error(err)
  });
}

  openDropdown() { this.showDropdown = true; }
  closeDropdown() { this.showDropdown = false; }
  editSection(section: 'personal' | 'caretakers' | 'insurance' | 'habits' | 'questions') {
    this.currentSection = section;
    this.showDropdown = false;
  }
  onSave(section: string) { this.currentSection = 'view'; }

  goBack(): void { this.router.navigate(['/admin/ptlist']); }

getHabitsArray(): Array<{ name: string; value: string; years: number | null }> {
  if (!this.patient?.habits || !Array.isArray(this.patient.habits)) return [];

  interface Habit {
    habit_code: string;
    answer: string;
    years: number | null;
  }

  const habitNameMap: { [key: string]: string } = {
    tobacco: 'Tobacco',
    smoking: 'Smoking',
    alcohol: 'Alcohol',
    drugs: 'Drugs'
  };

  return (this.patient.habits as Habit[]).map((habit: Habit) => ({
    name: habitNameMap[habit.habit_code.toLowerCase()] || habit.habit_code,
    value: habit.answer.toLowerCase() === 'yes' ? 'yes' : 'no',
    years: habit.answer.toLowerCase() === 'yes' ? habit.years : null
  }));
}

  // Method to manually refresh habits data
  refreshHabitsData(): void {
    console.log('Manually refreshing habits data...');
    if (this.patientId) {
      this.patientService.getHabitsById(this.patientId).subscribe({
        next: (res: any) => {
          console.log('Fresh habits data from API:', res);
          if (res && this.patient) {
            // Convert array format to object format for UI
            let habits: any = {};
            if (Array.isArray(res)) {
              res.forEach((habit: any) => {
                if (habit.habit_code && habit.answer) {
                  habits[habit.habit_code] = habit.answer;
                  habits[habit.habit_code + 'Years'] = habit.years || 0;
                }
              });
            } else {
              habits = res;
            }
            this.patient.habits = habits;
            console.log('Updated patient habits:', this.patient.habits);
          }
        },
        error: (err: any) => {
          console.error('Error fetching fresh habits data:', err);
        }
      });
    }
  }

  getHabitIcon(habitName: string): string {
    const iconMap: { [key: string]: string } = {
      'Tobacco': '../../../assets/tobacco.png',
      'Smoking': '../../../assets/cigarette.png',
      'Alcohol': '../../../assets/beer.png',
      'Drugs': '../../../assets/capsule.png'
    };
    return iconMap[habitName] || '../../../assets/tobacco.png';
  }

  getQuestionsArray(): any[] {
    if (!this.patient?.questions) return [];
    
    const questions = this.patient.questions;
    const questionsArray = [];
    
    if (questions.q1) {
      questionsArray.push({
        text: 'Is the person proposed in good health free from physical and mental disease or infirmity?',
        answer: questions.q1.answer,
        details: questions.q1.details
      });
    }
    
    if (questions.q2) {
      questionsArray.push({
        text: 'Has the person proposed consulted/diagnosed/taken treatment/been admitted for any illness/injury?',
        answer: questions.q2.answer,
        details: questions.q2.details
      });
    }
    
    if (questions.q3) {
      questionsArray.push({
        text: 'Does the person proposed have any complications during/following birth?',
        answer: questions.q3.answer,
        details: questions.q3.details
      });
    }
    
    return questionsArray;
  }
  get parsedHabits(): any[] {
  if (!this.patient || !this.patient.habits) return [];
  return this.patient.habits.split('||').map((h: string) => {
    const [codeAnswer, yearsStr] = h.split('-');
    const [code, answer] = codeAnswer.split(':');
    return {
      code: code?.trim(),
      answer: answer?.trim(),
      years: yearsStr ? yearsStr.replace('years', '').trim() : ''
    };
  });
}
  get photoArray(): string[] {
    if (!this.patient) return [];
    if (Array.isArray(this.patient.photo)) return this.patient.photo;
    if (typeof this.patient.photo === 'string' && this.patient.photo) return [this.patient.photo];
    return [];
  }

  get proofFileArray(): string[] {
    if (!this.patient) return [];
    if (Array.isArray(this.patient.proofFile)) return this.patient.proofFile;
    if (typeof this.patient.proofFile === 'string' && this.patient.proofFile) return [this.patient.proofFile];
    return [];
  }

  get policyFilesArray(): string[] {
    if (!this.patient) return [];
    if (Array.isArray(this.patient.policyFiles)) return this.patient.policyFiles;
    if (typeof this.patient.policyFiles === 'string' && this.patient.policyFiles) return [this.patient.policyFiles];
    return [];
  }
}

