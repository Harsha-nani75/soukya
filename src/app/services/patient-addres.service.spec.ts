import { TestBed } from '@angular/core/testing';

import { PatientAddresService } from './patient-addres.service';

describe('PatientAddresService', () => {
  let service: PatientAddresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientAddresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
