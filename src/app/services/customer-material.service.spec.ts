import { TestBed } from '@angular/core/testing';

import { CustomerMaterialService } from './customer-material.service';

describe('CustomerMaterialService', () => {
  let service: CustomerMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
