const express = require('express');
const bcrypt = require('bcryptjs');

const {authenticateToken, signToken} = require('./token-utils');
const {sendEMail} = require('./email-utils');

const usersDb = require('./users-db');

const router = express.Router();

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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
                sendEMail(email, 'Welcome to MusicHosting', `Hello ${name},\nThank you for registering!`);
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

router.post('/forgot-password', (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    usersDb.get('SELECT id, email FROM users WHERE email = ?', [email], (err, user) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        
        // Generate OTP
        const otp = Math.floor(100_000 + Math.random() * 900_000).toString();
        const otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

        // Update OTP in database
        usersDb.run('UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?', [otp, otpExpiry, user.id], (err) => {
            if (err)
                return next(err);
            sendEMail(email, 'Password reset for MusicHosting', `Your OTP is ${otp}`);
            res.status(200).json({ message: 'OTP sent to your email' });
        });
    });
});

router.post('/reset-password', (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP and new password are required' });
    }

    // Find user
    usersDb.get('SELECT id, email, otp, otp_expiry FROM users WHERE email = ?', [email], (err, user) => {
        if (err)
            return next(err);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        
        // Check OTP
        if (user.otp !== otp || Date.now() > user.otp_expiry) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }
        
        // Hash new password
        bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err)
                return next(err);
            
            // Update password and clear OTP
            usersDb.run('UPDATE users SET password = ?, otp = NULL, otp_expiry = NULL WHERE id = ?', [hash, user.id], (err) => {
                if (err)
                    return next(err);
                res.status(200).json({ message: 'Password reset successfully' });
            });
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
    const userId = req.user.id;
    res.status(200).json({ message: 'Token is valid', userId: userId });
});

router.post('/change-name', authenticateToken, (req, res, next) => {
    const userId = req.user.id;
    const { name } = req.body;
    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Name is required' });
    }

    usersDb.run('UPDATE users SET name = ? WHERE id = ?', [name, userId], function(err) {
        if (err) return next(err);
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'Name changed successfully' });
    });
});

router.get('/me', authenticateToken, (req, res, next) => {
    const userId = req.user.id;
    usersDb.get('SELECT name, email FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
});

module.exports = router;
