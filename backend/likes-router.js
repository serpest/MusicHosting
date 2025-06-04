const express = require('express');

const {authenticateToken} = require('./token-utils');

const songsDb = require('./songs-db');
const likesDb = require('./likes-db');

const router = express.Router();

router.get('/:songId/is-liked', authenticateToken, (req, res, next) => {
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

router.post('/:songId/like', authenticateToken, (req, res, next) => {
    const userId = req.user.id;
    const songId = req.params.songId;

    songsDb.get('SELECT id FROM songs WHERE id = ?', [songId], (err, song) => {
        if (err) return next(err);
        if (!song) return res.status(404).json({ error: 'Song not found' });

        likesDb.run(
            'INSERT INTO likes (user_id, song_id) VALUES (?, ?)',
            [userId, songId],
            function(err) {
                if (err) return next(err);
                res.status(201).json({ message: 'Song liked successfully' });
            }
        );
    });
});

router.post('/:songId/unlike', authenticateToken, (req, res, next) => {
    const userId = req.user.id;
    const songId = req.params.songId;

    likesDb.get(
        'SELECT 1 FROM likes WHERE user_id = ? AND song_id = ?',
        [userId, songId],
        (err, row) => {
            if (err) return next(err);
            if (!row) return res.status(404).json({ error: 'Like not found' });

            likesDb.run(
                'DELETE FROM likes WHERE user_id = ? AND song_id = ?',
                [userId, songId],
                function(err) {
                    if (err) return next(err);
                    res.status(200).json({ message: 'Song unliked successfully' });
                }
            );
        }
    );
});

router.get('/playlist-liked-songs', authenticateToken, (req, res, next) => {
    const userId = req.user.id;
    
    likesDb.all('SELECT song_id FROM likes WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return next(err);
        const songIds = rows.map(r => r.song_id);
        if (songIds.length === 0) {
            return res.status(200).json({ songs: [] });
        }
        const placeholders = songIds.map(() => '?').join(',');
        songsDb.all(
            `SELECT id, title, artist, album, genre, release_year FROM songs WHERE id IN (${placeholders})`,
            songIds,
            (err, songs) => {
                if (err) return next(err);
                res.status(200).json({ songs: songs });
            }
        );
    });
});

router.get('/most-liked/:n', (req, res, next) => {
    const n = parseInt(req.params.n, 10);
    if (isNaN(n) || n <= 0) {
        return res.status(400).json({ error: 'Invalid number of songs requested' });
    }

    likesDb.all(
        `SELECT song_id, COUNT(*) as like_count 
         FROM likes 
         GROUP BY song_id 
         ORDER BY like_count DESC 
         LIMIT ?`,
        [n],
        (err, rows) => {
            if (err) return next(err);
            const songIds = rows.map(r => r.song_id);
            if (songIds.length === 0) {
                return res.status(200).json({ songs: [] });
            }
            const placeholders = songIds.map(() => '?').join(',');
            songsDb.all(
                `SELECT id, title, artist, album, genre, release_year 
                 FROM songs 
                 WHERE id IN (${placeholders})`,
                songIds,
                (err, songs) => {
                    if (err) return next(err);
                    res.status(200).json({ songs: songs });
                }
            );
        }
    );
});

router.post('/likes-per-song', (req, res, next) => {
    const { songIds } = req.body;
    if (!Array.isArray(songIds) || songIds.length === 0) {
        return res.json({});
    }
    const placeholders = songIds.map(() => '?').join(',');
    likesDb.all(
        `SELECT song_id, COUNT(*) as likes FROM likes WHERE song_id IN (${placeholders}) GROUP BY song_id`,
        songIds,
        (err, rows) => {
            if (err) return next(err);
            const result = {};
            for (const row of rows) {
                result[row.song_id] = row.likes;
            }
            res.json(result);
        }
    );
});

router.get('/:songId/count', (req, res, next) => {
    const songId = req.params.songId;
    likesDb.get(
        'SELECT COUNT(*) as likes FROM likes WHERE song_id = ?',
        [songId],
        (err, row) => {
            if (err) return next(err);
            res.json({ likes: row.likes });
        }
    );
    
});

module.exports = router;
