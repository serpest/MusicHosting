const sqlite3 = require('sqlite3').verbose();
const usersDb = new sqlite3.Database('./data/users.db');

usersDb.serialize(() => {
  usersDb.run(
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        password TEXT NOT NULL
     )`
  );
});

module.exports = usersDb;
