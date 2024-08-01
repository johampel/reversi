import {TestBed} from '@angular/core/testing';

import {PlayerService} from './player.service';
import {provideMockStore} from "@ngrx/store/testing";

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({})]
    });
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
