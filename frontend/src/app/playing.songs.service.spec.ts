import { TestBed } from '@angular/core/testing';
import { PlayingSongsService } from './playing.songs.service';

describe('PlayingSongsService', () => {
  let service: PlayingSongsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayingSongsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
