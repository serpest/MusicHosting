const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const {authenticateToken} = require('./token-utils');

const usersDb = require('./users-db');
const songsDb = require('./songs-db');
const likesDb = require('./likes-db');

const router = express.Router();

// Check if a song is liked by the user
router.get('/:songId/is-liked', authenticateToken, (req, res, next) => {
    console.log('Checking if song is liked by user');
    const userId = req.user.id;
    const songId = req.params.songId;
    likesDb.get(
        'SELECT 1 FROM likes WHERE user_id = ? AND song_id = ?',
        [userId, songId],
        (err, row) => {
            if (err) return next(err);
            res.json({ liked: !!row });
        }
    );
});

// Like a song
router.post('/:songId/like', authenticateToken, (req, res, next) => {
    console.log('Liking song');
    const userId = req.user.id;
    const songId = req.params.songId;

    // Check if the song exists
    songsDb.get('SELECT id FROM songs WHERE id = ?', [songId], (err, song) => {
        if (err) return next(err);
        if (!song) return res.status(404).json({ error: 'Song not found' });

        // Insert like
        likesDb.run(
            'INSERT INTO likes (user_id, song_id) VALUES (?, ?)',
            [userId, songId],
            function(err) {
                if (err) return next(err);
                res.status(201).json({ message: 'Song liked successfully', likeId: this.lastID });
            }
        );
    });
});

// Unlike a song
router.post('/:songId/unlike', authenticateToken, (req, res, next) => {
    console.log('Unliking song');
    const userId = req.user.id;
    const songId = req.params.songId;

    // Check if the like exists
    likesDb.get(
        'SELECT id FROM likes WHERE user_id = ? AND song_id = ?',
        [userId, songId],
        (err, row) => {
            if (err) return next(err);
            if (!row) return res.status(404).json({ error: 'Like not found' });

            // Delete like
            likesDb.run(
                'DELETE FROM likes WHERE id = ?',
                [row.id],
                function(err) {
                    if (err) return next(err);
                    res.status(200).json({ message: 'Song unliked successfully' });
                }
            );
        }
    );
});

// Get all liked songs for the authenticated user
router.get('/playlist-liked-songs', authenticateToken, (req, res, next) => {
    const userId = req.user.id;
    
    // 1. Prendi tutti i song_id likati dall'utente
    likesDb.all('SELECT song_id FROM likes WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return next(err);
        const songIds = rows.map(r => r.song_id);
        if (songIds.length === 0) {
            return res.status(200).json({ songs: [] });
        }
        // 2. Prendi i dettagli delle canzoni da songsDb
        const placeholders = songIds.map(() => '?').join(',');
        songsDb.all(
            `SELECT id, title, artist, album, genre, release_year FROM songs WHERE id IN (${placeholders})`,
            songIds,
            (err, songs) => {
                if (err) return next(err);
                res.status(200).json({ songs: songs });
                console.log('Fetching liked songs for user');
            }
        );
    });
});

module.exports = router;