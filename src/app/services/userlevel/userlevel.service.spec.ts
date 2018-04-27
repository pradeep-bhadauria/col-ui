import { TestBed, inject } from '@angular/core/testing';

import { UserlevelService } from './userlevel.service';

describe('UserlevelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserlevelService]
    });
  });

  it('should be created', inject([UserlevelService], (service: UserlevelService) => {
    expect(service).toBeTruthy();
  }));
});
