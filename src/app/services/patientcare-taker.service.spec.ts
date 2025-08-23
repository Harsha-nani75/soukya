import { TestBed } from '@angular/core/testing';

import { PatientcareTakerService } from './patientcare-taker.service';

describe('PatientcareTakerService', () => {
  let service: PatientcareTakerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientcareTakerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
