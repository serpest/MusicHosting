const sqlite3 = require('sqlite3').verbose();
const songsDb = new sqlite3.Database('./data/songs.db');

songsDb.serialize(() => {
  songsDb.run(
    `CREATE TABLE IF NOT EXISTS songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        artist TEXT NOT NULL,
        album TEXT NOT NULL,
        genre TEXT NOT NULL,
        release_year INTEGER NOT NULL,
        uploader_id INTEGER NOT NULL,
        FOREIGN KEY (uploader_id) REFERENCES users(id)
     )`
  );
});

module.exports = songsDb;
