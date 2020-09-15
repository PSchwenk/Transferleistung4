import { TestBed } from '@angular/core/testing';

import { MaterialStockService } from './material-stock.service';

describe('MaterialStockService', () => {
  let service: MaterialStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
