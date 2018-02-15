import { TestBed, inject } from '@angular/core/testing';

import { NewPasswordService } from './new-password.service';

describe('NewPasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewPasswordService]
    });
  });

  it('should be created', inject([NewPasswordService], (service: NewPasswordService) => {
    expect(service).toBeTruthy();
  }));
});
