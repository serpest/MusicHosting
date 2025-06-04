const sqlite3 = require('sqlite3').verbose();
const usersDb = new sqlite3.Database('./data/likes.db');

usersDb.serialize(() => {
  usersDb.run(
    `CREATE TABLE IF NOT EXISTS likes (
        user_id INTEGER NOT NULL,
        song_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, song_id),
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (song_id) REFERENCES songs(id)
     )`
  );
});

module.exports = usersDb;