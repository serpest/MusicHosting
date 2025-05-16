const sqlite3 = require('sqlite3').verbose();
const playlistsDb = new sqlite3.Database('./data/playlists.db');

playlistsDb.serialize(() => {
  playlistsDb.run(
    `CREATE TABLE IF NOT EXISTS playlists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        creator_id INTEGER NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id)
     )`
  );
});

module.exports = playlistsDb;
