import { TestBed } from '@angular/core/testing';

import { MaterialDocumentService } from './material-document.service';

describe('MaterialDocumentService', () => {
  let service: MaterialDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
