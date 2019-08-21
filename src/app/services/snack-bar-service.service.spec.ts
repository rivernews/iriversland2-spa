import { TestBed, inject } from '@angular/core/testing';

import { SnackBarServiceService } from './snack-bar-service.service';

describe('SnackBarServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SnackBarServiceService]
    });
  });

  it('should be created', inject([SnackBarServiceService], (service: SnackBarServiceService) => {
    expect(service).toBeTruthy();
  }));
});
