import { Song } from "./song.model";

export class Playlist {

    id: number;
    title: string;
    creatorId: number;
    songs: Song[] = [];
  
    constructor(id: number = 0, title: string = '', creatorId: number = 0, songs: Song[] = []) {
      this.id = id;
      this.title = title;
      this.creatorId = creatorId;
      this.songs = songs;
    }

    static fromJsonWithoutCreatorAndSongs(json: any): Playlist {
      return new Playlist(
        json.id,
        json.title
      );
    }

    static fromJsonWithoutSongs(json: any): Playlist {
      return new Playlist(
        json.id,
        json.title,
        json.creator_id,
      );
    }

    static fromJson(json: any): Playlist {
      return new Playlist(
        json.id,
        json.title,
        json.creator_id,
        json.songs.map((song: any) => Song.fromJson(song))
      );
    }

    static toJson(playlist: Playlist): any {
      return {
        id: playlist.id,
        title: playlist.title,
        creator_id: playlist.creatorId,
        songs: playlist.songs.map((song: Song) => Song.toJson(song))
      };
    }

}
