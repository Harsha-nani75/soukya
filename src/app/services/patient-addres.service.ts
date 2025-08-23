// import { Injectable } from '@angular/core';
// import { PatientAddress } from '../admin/genticcare/patient.model'; // Assuming you have a PatientAddress model defined
// @Injectable({
//   providedIn: 'root'
// })
// export class PatientAddresService {

//   constructor() { }

//     private storageKey = 'PatientAddress';

//   private read(): PatientAddress[] {
//     const data = localStorage.getItem(this.storageKey);
//     return data ? JSON.parse(data) : [];
//   }

//   private write(data: PatientAddress[]): void {
//     localStorage.setItem(this.storageKey, JSON.stringify(data));
//   }

//   getAll(): PatientAddress[] {
//     return this.read();
//   }

//   getByPatientId(patientId: number): PatientAddress | undefined {
//     return this.read().find(a => a.patientId === patientId);
//   }
// add(patientId: number, address: PatientAddress): void {
//   const addresses = this.read();

//   // attach the patientId to the address
//   const newAddress: PatientAddress = {
//     ...address,
//     patientId: patientId
//   };

//   addresses.push(newAddress);
//   this.write(addresses);
// }


//   update(patientId: number, patch: Partial<PatientAddress>): PatientAddress | undefined {
//     const addresses = this.read();
//     const idx = addresses.findIndex(a => a.patientId === patientId);
//     if (idx === -1) return undefined;
//     const updated: PatientAddress = {
//       ...addresses[idx],
//       ...patch,
//       updatedAt: new Date().toISOString()
//     };
//     addresses[idx] = updated;
//     this.write(addresses);
//     return updated;
//   }

//   delete(patientId: number): void {
//     let addresses = this.read();
//     addresses = addresses.filter(a => a.patientId !== patientId);
//     this.write(addresses);
//   }

// }
