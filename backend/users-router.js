const express = require('express');
const bcrypt = require('bcryptjs');

const {authenticateToken, signToken} = require('./token-utils');

const usersDb = require('./users-db');

const router = express.Router();

const baseEMailURL = 'https://bose.com/'; // TODO: Remove this

router.get('/', (_req, res, next) => { // Useful for debugging, but dangerous
    usersDb.all('SELECT id, email, name FROM users', (err, rows) => {
        if (err)
            return next(err);
        res.status(200).json({ users: rows });
    });
});

router.get('/id/:id', (req, res, next) => { // Useful for debugging, but dangerous
    const userId = req.params.id;

    usersDb.get('SELECT id, email, name FROM users WHERE id = ?', [userId], (err, row) => {
        if (err)
            return next(err);
        if (!row)
            return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ user: row });
    });
});

router.post('/register', (req, res, next) => {
    const { email, name, password } = req.body;
    
    if (!email || !name || !password) {
        return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // TODO
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Check if user already exists
    usersDb.get('SELECT id FROM users WHERE email = ?', [email], (err, user) => {
        if (err)
            return next(err);
        if (user)
            return res.status(409).json({ error: 'Email already registered' });
        
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err)
                return next(err);
            
            // Insert new user
            usersDb.run('INSERT INTO users (email, name, password) VALUES (?, ?, ?)', [email, name, hash], function(err) {
                if (err)
                    return next(err);
                res.status(201).json({ message: 'User created successfully', userId: this.lastID });
            });
        });
    });
});

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    
    // Find user
    usersDb.get('SELECT id, email, password FROM users WHERE email = ?', [email], (err, user) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        
        // Compare passwords
        bcrypt.compare(password, user.password, (err, result) => {
            if (err)
                return next(err);
            if (!result)
                return res.status(401).json({ error: 'Invalid credentials' });
            
            // Generate token
            const token = signToken(user.id, user.email)
            res.status(200).json({ message: 'Login successful', token: token });
        });
    });
});

router.post('/change-password', (req, res, next) => {
    const { email, oldPassword, newPassword } = req.body;
    
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Email, old password and new password are required' });
    }

    // Find user
    usersDb.get('SELECT id, email, password FROM users WHERE email = ?', [email], (err, user) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        
        // Compare passwords
        bcrypt.compare(oldPassword, user.password, (err, result) => {
            if (err)
                return next(err);
            if (!result)
                return res.status(401).json({ error: 'Invalid credentials' });
            
            // Hash new password
            bcrypt.hash(newPassword, 10, (err, hash) => {
                if (err)
                    return next(err);
                
                // Update password
                usersDb.run('UPDATE users SET password = ? WHERE id = ?', [hash, user.id], (err) => {
                    if (err)
                        return next(err);
                    res.status(200).json({ message: 'Password changed successfully' });
                });
            });
        });
    });
});

router.post('/delete', (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    usersDb.get('SELECT id, email, password FROM users WHERE email = ?', [email], (err, user) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(401).json({ error: 'Invalid credentials' });
        
        // Compare passwords
        bcrypt.compare(password, user.password, (err, result) => {
            if (err)
                return next(err);
            if (!result)
                return res.status(401).json({ error: 'Invalid credentials' });
            
            // Delete user
            usersDb.run('DELETE FROM users WHERE id = ?', [user.id], (err) => {
                if (err)
                    return next(err);
                res.status(200).json({ message: 'Account deleted successfully' });
            });
        });
    });
});

router.get('/validate-token', authenticateToken, (req, res) => {
    const userId = req.user.id; // Extract user ID from the verified token
    res.status(200).json({ message: 'Token is valid', userId: userId });
});

module.exports = router;
