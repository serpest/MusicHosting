import { Component, OnInit } from '@angular/core';
import { PlayingSongsService } from '../playing.songs.service';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
})
export class MiniPlayerComponent  implements OnInit {
   
  constructor(private playingSongsService: PlayingSongsService) {
    
   }

  ngOnInit() {}

}
