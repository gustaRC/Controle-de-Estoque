import { TestBed } from '@angular/core/testing';

import { AutenticarGuardService } from './autenticar-guard.service';

describe('AutenticarGuardService', () => {
  let service: AutenticarGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutenticarGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
