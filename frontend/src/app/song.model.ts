export class Song {

    id: number;
    title: string;
    artist: string;
    album: string;
    genre: string;
    releaseYear: number;
  
    constructor(id: number = 0, title: string = '', artist: string = '', album: string = '', genre: string = '', releaseYear: number = 0) {
      this.id = id;
      this.title = title;
      this.artist = artist;
      this.album = album;
      this.genre = genre;
      this.releaseYear = releaseYear;
    }
  
    static fromJson(json: any): Song {
      return new Song(
        json.id,
        json.title,
        json.artist,
        json.album,
        json.genre,
        json.release_year
      );
    }

    static toJson(song: Song): any {
      return {
        id: song.id,
        title: song.title,
        artist: song.artist,
        album: song.album,
        genre: song.genre,
        release_year: song.releaseYear
      };
    }

}
