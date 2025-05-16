const express = require('express');
const fs = require('fs');

const {authenticateToken} = require('./token-utils');

const songsDb = require('./songs-db');
const playlistsContentDb = require('./playlists-content-db');

const router = express.Router();

router.get('/', (_req, res, next) => {
    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs', (err, rows) => {
        if (err)
            return next(err);
        res.status(200).json({ songs: rows });
    });
});

router.get('/artist/:artist', (req, res, next) => {
    const artist = req.params.artist;

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE artist = ?', [artist], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found for this artist' });
        res.status(200).json({ songs: rows });
    });
});

router.get('/genre/:genre', (req, res, next) => {
    const genre = req.params.genre;

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE genre = ?', [genre], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found for this genre' });
        res.status(200).json({ songs: rows });
    });
});

router.get('/album/:album', (req, res, next) => {
    const album = req.params.album;

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE album = ?', [album], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found for this album' });
        res.status(200).json({ songs: rows });
    });
});

router.get('/release_year/:year', (req, res, next) => {
    const year = req.params.year;

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE release_year = ?', [year], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found for this release year' });
        res.status(200).json({ songs: rows });
    });
});

router.get('/search/:query', (req, res, next) => {
    const query = req.params.query;

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE title LIKE ? OR artist LIKE ? OR album LIKE ? OR genre LIKE ? OR release_year = ?', [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, query], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found' });
        res.status(200).json({ songs: rows });
    });
});

router.get('/random/:count', (req, res, next) => {
    const count = parseInt(req.params.count, 10);

    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Count must be a positive integer' });
    }

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs ORDER BY RANDOM() LIMIT ?', [count], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found' });
        res.status(200).json({ songs: rows });
    });
});

router.get('/id/:id', (req, res, next) => {
    const songId = req.params.id;

    songsDb.get('SELECT id, title, artist, album, genre, release_year FROM songs WHERE id = ?', [songId], (err, row) => {
        if (err)
            return next(err);
        if (!row)
            return res.status(404).json({ error: 'Song not found' });
        res.status(200).json({ song: row });
    });
});

router.get('/mine', authenticateToken, (req, res, next) => {
    const userId = req.user.id; // Extract user ID from the verified token

    songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE uploader_id = ?', [userId], (err, rows) => {
        if (err)
            return next(err);
        res.status(200).json({ songs: rows });
    });
});

router.get('/id/:id/audio', (req, res, next) => {
    const songId = req.params.id;
    const audioPath = `./data/audio/${songId}.mp3`;
    
    // Check if file exists
    fs.access(audioPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Audio file not found' });
        }
        
        // Get file stats for Content-Length header
        fs.stat(audioPath, (err, stats) => {
            if (err) {
                return next(err);
            }
            
            // Set appropriate headers
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Content-Length', stats.size);
            res.setHeader('Accept-Ranges', 'bytes');
            
            // Stream the file to the client
            const audioStream = fs.createReadStream(audioPath);
            audioStream.on('error', (err) => {
                next(err);
            });
            
            audioStream.pipe(res);
        });
    });
});

router.get('/id/:id/album_picture', (req, res, next) => {
    const songId = req.params.id;
    const imagePath = `./data/album_pictures/${songId}.png`;
    
    // Check if file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Album picture not found' });
        }
        
        // Get file stats for Content-Length header
        fs.stat(imagePath, (err, stats) => {
            if (err) {
                return next(err);
            }
            
            // Set appropriate headers
            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Content-Length', stats.size);
            
            // Stream the file to the client
            const imageStream = fs.createReadStream(imagePath);
            imageStream.on('error', (err) => {
                next(err);
            });
            
            imageStream.pipe(res);
        });
    });
});

router.post('/submit', authenticateToken, (req, res, next) => {
    const { title, artist, album, genre, release_year } = req.body;
    const uploaderId = req.user.id; // Extract user ID from the verified token

    if (!title || !artist || !album || !genre || !release_year) {
        return res.status(400).json({ error: 'Title, artist, album, genre and release year are required' });
    }

    // Insert new song with uploader_id
    songsDb.run('INSERT INTO songs (title, artist, album, genre, release_year, uploader_id) VALUES (?, ?, ?, ?, ?, ?)', 
        [title, artist, album, genre, release_year, uploaderId], function(err) {
        if (err)
            return next(err);
        res.status(201).json({ message: 'Song created successfully', songId: this.lastID });
    });
});

router.post('/id/:id/audio', authenticateToken, (req, res, next) => {
    const songId = req.params.id;
    const userId = req.user.id; // Get user ID from the token
    
    // Verify that the song belongs to this user
    songsDb.get('SELECT id FROM songs WHERE id = ? AND uploader_id = ?', [songId, userId], (err, song) => {
        if (err) {
            return next(err);
        }
        
        if (!song) {
            return res.status(403).json({ error: 'Not authorized to upload audio for this song' });
        }
        
        const audioPath = `./data/audio/${songId}.mp3`;
        
        // Check if file already exists
        fs.access(audioPath, fs.constants.F_OK, (err) => {
            if (!err) {
                return res.status(400).json({ error: 'Audio file already exists' });
            }
            
            // Create write stream to save the audio file
            const writeStream = fs.createWriteStream(audioPath);
            
            req.pipe(writeStream);
            
            writeStream.on('finish', () => {
                res.status(201).json({ message: 'Audio file uploaded successfully' });
            });
            
            writeStream.on('error', (err) => {
                next(err);
            });
        });
    });
});

router.post('/id/:id/album-picture', authenticateToken, (req, res, next) => {
    const songId = req.params.id;
    const userId = req.user.id; // Get user ID from the token
    
    // Verify that the song belongs to this user
    songsDb.get('SELECT id FROM songs WHERE id = ? AND uploader_id = ?', [songId, userId], (err, song) => {
        if (err) {
            return next(err);
        }
        
        if (!song) {
            return res.status(403).json({ error: 'Not authorized to upload album picture for this song' });
        }
        
        const imagePath = `./data/album_pictures/${songId}.png`;
        
        // Check if file already exists
        fs.access(imagePath, fs.constants.F_OK, (err) => {
            if (!err) {
                return res.status(400).json({ error: 'Album picture already exists' });
            }
            
            // Create write stream to save the image file
            const writeStream = fs.createWriteStream(imagePath);
            
            req.pipe(writeStream);
            
            writeStream.on('finish', () => {
                res.status(201).json({ message: 'Album picture uploaded successfully' });
            });
            
            writeStream.on('error', (err) => {
                next(err);
            });
        });
    });
});

router.delete('/id/:id', authenticateToken, (req, res, next) => {
    const songId = req.params.id;
    const userId = req.user.id;
    
    // Verify that the song belongs to this user
    songsDb.get('SELECT id FROM songs WHERE id = ? AND uploader_id = ?', [songId, userId], (err, song) => {
        if (err) {
            return next(err);
        }
        
        if (!song) {
            return res.status(403).json({ error: 'Not authorized to delete this song' });
        }
        
        // Delete the song from the database
        songsDb.run('DELETE FROM songs WHERE id = ?', [songId], function(err) {
            if (err)
                return next(err);
            
            // Delete the audio file
            const audioPath = `./data/audio/${songId}.mp3`;
            fs.unlink(audioPath, (err) => {
                if (err) {
                    return next(err);
                }
                
                // Delete the album picture
                const imagePath = `./data/album_pictures/${songId}.png`;
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        return next(err);
                    }
                    
                    // Delete from playlists_content
                    playlistsContentDb.run('DELETE FROM playlists_content WHERE song_id = ?', [songId], function(err) {
                        if (err)
                            return next(err);
                        
                        res.status(200).json({ message: 'Song deleted successfully' });
                    });
                });
            });

        });
    });
});

module.exports = router;
