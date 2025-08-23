import { Injectable } from '@angular/core';
import { PatientCareTaker } from '../admin/genticcare/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientcareTakerService {

  
  constructor() { }

    private storageKey = 'patientCareTaker';

  private read(): PatientCareTaker[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private write(data: PatientCareTaker[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getAll(): PatientCareTaker[] {
    return this.read();
  }

  getByPatientId(patientId: number): PatientCareTaker | undefined {
    return this.read().find(a => a.patientId === patientId);
  }
add(patientId: number, careTaker: PatientCareTaker): void {
  const careTakers = this.read();

  // attach the patientId to the address
  const newCareTaker: PatientCareTaker = {
    ...careTaker,
    patientId: patientId
  };

  careTakers.push(newCareTaker);
  this.write(careTakers);
}


  update(patientId: number, patch: Partial<PatientCareTaker>): PatientCareTaker | undefined {
    const careTaker = this.read();
    const idx = careTaker.findIndex(a => a.patientId === patientId);
    if (idx === -1) return undefined;
    const updated: PatientCareTaker = {
      ...careTaker[idx],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    careTaker[idx] = updated;
    this.write(careTaker);
    return updated;
  }

  delete(patientId: number): void {
    let addresses = this.read();
    addresses = addresses.filter(a => a.patientId !== patientId);
    this.write(addresses);
  }


}








