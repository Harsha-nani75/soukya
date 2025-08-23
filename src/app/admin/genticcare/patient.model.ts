export interface Patient {
  id?: number;
  name: string;
  lname: string;
  sname?: string;
  abb?: string;
  abbname?: string;
  gender: string;
  dob: string;
  age: number;
  ocupation?: string;
  phone: string;
  email: string;
  photo?: string;
  rstatus?: string;
  raddress?: string;
  rcity?: string;
  rstate?: string;
  rzipcode?: string;
  paddress?: string;
  pcity?: string;
  pstate?: string;
  pzipcode?: string;
  idnum?: string;
  addressTextProof?: string;
  proofFile?: string;
}

// export interface PatientAddress {
//   id: number;              // unique id for address
//   patientId: number;       // foreign key -> Patient.id
//   rstatus: string;         // India Resident, NRI, etc.
//   raddress: string;
//   rcity: string;
//   rstate: string;
//   rzipcode: string;
//   paddress: string;
//   pcity: string;
//   pstate: string;
//   pzipcode: string;
//   idnum?: string; // ID number for address proof
//   addressTextProof: string;  // Aadhaar, Voter ID, etc.
//   addressProofFile?: string; // base64 or file path
//   createdAt: string;
//   updatedAt: string;
// }
export interface PatientCareTaker{
  id: number;
  patientId: number; // foreign key -> Patient.id
  cname: string;
  relation: string; // e.g. Father, Mother, Spouse
  phone: string;
  cemail?: string;
  caddress?: string; // optional address field
  createdAt: string;
  updatedAt: string;
}