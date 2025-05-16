import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSongsPage } from './search-songs.page';

describe('SearchSongsPage', () => {
  let component: SearchSongsPage;
  let fixture: ComponentFixture<SearchSongsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
