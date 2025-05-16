const express = require('express');

const {authenticateToken} = require('./token-utils');

const usersDb = require('./users-db');
const songsDb = require('./songs-db');
const playlistsDb = require('./playlists-db');
const playlistsContentDb = require('./playlists-content-db');

const router = express.Router();

router.get('/', (_req, res, next) => {
    playlistsDb.all('SELECT id, title, creator_id FROM playlists', (err, rows) => {
        if (err)
            return next(err);
        res.status(200).json({ playlists: rows });
    });
});

router.get('/random/:count', (req, res, next) => {
    const count = parseInt(req.params.count, 10);

    if (isNaN(count) || count <= 0) {
        return res.status(400).json({ error: 'Count must be a positive integer' });
    }

    playlistsDb.all('SELECT id, title, creator_id FROM playlists ORDER BY RANDOM() LIMIT ?', [count], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No playlists found' });
        res.status(200).json({ playlists: rows });
    });
});

router.get('/mine', authenticateToken, (req, res, next) => {
    const userId = req.user.id; // Extract user ID from the verified token

    playlistsDb.all('SELECT id, title, creator_id FROM playlists WHERE creator_id = ?', [userId], (err, rows) => {
        if (err)
            return next(err);
        res.status(200).json({ playlists: rows });
    });
});

router.post('/create', authenticateToken, (req, res, next) => {
    const { title } = req.body;
    const creatorId = req.user.id; // Extract user ID from the verified token

    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }

    // Insert new playlist with creator_id
    playlistsDb.run('INSERT INTO playlists (title, creator_id) VALUES (?, ?)', 
        [title, creatorId], function(err) {
        if (err)
            return next(err);
        res.status(201).json({ message: 'Playlist created successfully', playlistId: this.lastID });
    });
});

router.get('/id/:id', (req, res, next) => {
    const playlistId = req.params.id;

    playlistsDb.get('SELECT id, title, creator_id FROM playlists WHERE id = ?', [playlistId], (err, row) => {
        if (err)
            return next(err);
        if (!row)
            return res.status(404).json({ error: 'Playlist not found' });
        res.status(200).json({ playlist: row });
    });
});

router.get('/id/:id/songs', (req, res, next) => {
    const playlistId = req.params.id;

    playlistsContentDb.all('SELECT song_id FROM playlists_content WHERE playlist_id = ?', [playlistId], (err, rows) => {
        if (err)
            return next(err);
        if (rows.length === 0)
            return res.status(404).json({ error: 'No songs found in this playlist' });
        
        const songIds = rows.map(row => row.song_id);
        
        songsDb.all('SELECT id, title, artist, album, genre, release_year FROM songs WHERE id IN (' + songIds.join(',') + ')', (err, songs) => {
            if (err)
                return next(err);
            res.status(200).json({ songs: songs });
        });
    });
});

router.get('/id/:id/creator', (req, res, next) => {
    const playlistId = req.params.id;

    playlistsDb.get('SELECT creator_id FROM playlists WHERE id = ?', [playlistId], (err, row) => {
        if (err)
            return next(err);
        if (!row)
            return res.status(404).json({ error: 'Playlist not found' });
        
        const creatorId = row.creator_id;
        
        // Get user details
        usersDb.get('SELECT id, email, name FROM users WHERE id = ?', [creatorId], (err, user) => {
            if (err)
                return next(err);
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            res.status(200).json({ creator: user });
        });
    });
});

router.post('/id/:id/update', authenticateToken, (req, res, next) => {
    const playlistId = req.params.id;
    const { title } = req.body;
    const userId = req.user.id; // Get user ID from the token
    
    // Verify that the playlist belongs to this user
    playlistsDb.get('SELECT id FROM playlists WHERE id = ? AND creator_id = ?', [playlistId, userId], (err, playlist) => {
        if (err) {
            return next(err);
        }
        
        if (!playlist) {
            return res.status(403).json({ error: 'Not authorized to update this playlist' });
        }
        
        // Update playlist title
        playlistsDb.run('UPDATE playlists SET title = ? WHERE id = ?', [title, playlistId], function(err) {
            if (err)
                return next(err);
            res.status(200).json({ message: 'Playlist updated successfully' });
        });
    });
});

router.post('/id/:id/add-song', authenticateToken, (req, res, next) => {
    const playlistId = req.params.id;
    const { songId } = req.body;
    const userId = req.user.id; // Get user ID from the token
    
    // Verify that the playlist belongs to this user
    playlistsDb.get('SELECT id FROM playlists WHERE id = ? AND creator_id = ?', [playlistId, userId], (err, playlist) => {
        if (err) {
            return next(err);
        }
        
        if (!playlist) {
            return res.status(403).json({ error: 'Not authorized to add songs to this playlist' });
        }
        
        // Check if song exists
        songsDb.get('SELECT id FROM songs WHERE id = ?', [songId], (err, song) => {
            if (err) {
                return next(err);
            }
            
            if (!song) {
                return res.status(404).json({ error: 'Song not found' });
            }
            
            // Check if song is already in the playlist
            playlistsContentDb.get('SELECT * FROM playlists_content WHERE playlist_id = ? AND song_id = ?', [playlistId, songId], (err, row) => {
                if (err) {
                    return next(err);
                }
                
                if (row) {
                    return res.status(409).json({ error: 'Song already exists in this playlist' });
                }
                
                // Insert into playlists_content
                playlistsContentDb.run('INSERT INTO playlists_content (playlist_id, song_id) VALUES (?, ?)', 
                    [playlistId, songId], function(err) {
                    if (err)
                        return next(err);
                    res.status(201).json({ message: 'Song added to playlist successfully' });
                });
            });
        });
    });
});

router.post('/id/:id/remove-song', authenticateToken, (req, res, next) => {
    const playlistId = req.params.id;
    const { songId } = req.body;
    const userId = req.user.id; // Get user ID from the token
    
    // Verify that the playlist belongs to this user
    playlistsDb.get('SELECT id FROM playlists WHERE id = ? AND creator_id = ?', [playlistId, userId], (err, playlist) => {
        if (err) {
            return next(err);
        }
        
        if (!playlist) {
            return res.status(403).json({ error: 'Not authorized to remove songs from this playlist' });
        }
        
        // Check if song exists in the playlist
        playlistsContentDb.get('SELECT * FROM playlists_content WHERE playlist_id = ? AND song_id = ?', [playlistId, songId], (err, row) => {
            if (err) {
                return next(err);
            }
            
            if (!row) {
                return res.status(404).json({ error: 'Song not found in this playlist' });
            }
            
            // Delete from playlists_content
            playlistsContentDb.run('DELETE FROM playlists_content WHERE playlist_id = ? AND song_id = ?', 
                [playlistId, songId], function(err) {
                if (err)
                    return next(err);
                res.status(200).json({ message: 'Song removed from playlist successfully' });
            });
        });
    });
});

router.delete('/id/:id', authenticateToken, (req, res, next) => {
    const playlistId = req.params.id;
    const userId = req.user.id;
    
    // Verify that the playlist belongs to this user
    playlistsDb.get('SELECT id FROM playlists WHERE id = ? AND creator_id = ?', [playlistId, userId], (err, playlist) => {
        if (err) {
            return next(err);
        }
        
        if (!playlist) {
            return res.status(403).json({ error: 'Not authorized to delete this playlist' });
        }
        
        // Delete from playlists_content
        playlistsContentDb.run('DELETE FROM playlists_content WHERE playlist_id = ?', [playlistId], function(err) {
            if (err)
                return next(err);
            
            // Delete the playlist itself
            playlistsDb.run('DELETE FROM playlists WHERE id = ?', [playlistId], function(err) {
                if (err)
                    return next(err);
                res.status(200).json({ message: 'Playlist deleted successfully' });
            });
        });
    });
});

module.exports = router;
