import { TestBed, inject } from '@angular/core/testing';

import { ObjectDataService } from './object-data.service';

describe('ObjectDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectDataService]
    });
  });

  it('should be created', inject([ObjectDataService], (service: ObjectDataService) => {
    expect(service).toBeTruthy();
  }));
});
