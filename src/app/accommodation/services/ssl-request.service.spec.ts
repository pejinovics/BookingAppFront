import { TestBed } from '@angular/core/testing';

import { SslRequestService } from './ssl-request.service';

describe('SslRequestService', () => {
  let service: SslRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SslRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
