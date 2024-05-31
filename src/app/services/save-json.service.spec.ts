import { TestBed } from '@angular/core/testing';

import { SaveJSONService } from './save-json.service';

describe('SaveJSONService', () => {
  let service: SaveJSONService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaveJSONService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
