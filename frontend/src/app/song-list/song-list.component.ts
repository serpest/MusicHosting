import { AfterViewInit, Component, ElementRef, input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Song } from '../song.model';
import { PlayingSongsService } from '../playing.songs.service';
import { FastAverageColor } from 'fast-average-color';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements AfterViewInit {

  songs = input<Song[]>();

  @ViewChildren('songItem')
  songItemElements!: QueryList<ElementRef<HTMLLIElement>>;
  
  constructor(private router: Router, private playingSongsService: PlayingSongsService) {}

  play(songId: number) {
    this.playingSongsService.setPlayingSongs(this.songs()!);
    this.router.navigate(['/song-player', songId]);
  }

  ngAfterViewInit() {
    const fac = new FastAverageColor();
    this.songItemElements.changes.subscribe(songItemRefs => {
      songItemRefs.forEach((songItemRef: { nativeElement: any; }) => {
        const container = songItemRef.nativeElement;
        const imgElement = container.querySelector('.song-image') as HTMLImageElement;
        if (imgElement) {
          fac.getColorAsync(imgElement)
            .then(color => {
              container.style.backgroundColor = color.rgba;
              container.style.color = color.isDark ? '#fff' : '#000';
            })
            .catch(e => {
              console.error('Failed to get average color for image:', imgElement.src);
            });
        }
      });
    });
  }

}
