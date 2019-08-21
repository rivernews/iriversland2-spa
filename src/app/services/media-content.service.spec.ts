import { TestBed, inject } from '@angular/core/testing';

import { MediaContentService } from './media-content.service';

describe('MediaContentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaContentService]
    });
  });

  it('should be created', inject([MediaContentService], (service: MediaContentService) => {
    expect(service).toBeTruthy();
  }));
});
