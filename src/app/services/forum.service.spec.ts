import { TestBed, inject } from '@angular/core/testing';

import { ForumService } from './forum.service';

describe('ForumServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForumService]
    });
  });

  it('should ...', inject([ForumService], (service: ForumService) => {
    expect(service).toBeTruthy();
  }));
});
