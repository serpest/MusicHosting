const sqlite3 = require('sqlite3').verbose();
const playlistsContentDb = new sqlite3.Database('./data/playlists-content.db');

playlistsContentDb.serialize(() => {
  playlistsContentDb.run(
    `CREATE TABLE IF NOT EXISTS playlists_content (
        playlist_id INTEGER NOT NULL,
        song_id INTEGER NOT NULL,
        FOREIGN KEY (playlist_id) REFERENCES playlists(id),
        FOREIGN KEY (song_id) REFERENCES songs(id)
        PRIMARY KEY (playlist_id, song_id)
     )`
  );
});

module.exports = playlistsContentDb;
