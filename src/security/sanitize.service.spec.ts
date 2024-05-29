import { TestBed } from '@angular/core/testing';

import { SanitizeService } from './sanitize.service';

describe('SanitizeService', () => {
  let service: SanitizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanitizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
