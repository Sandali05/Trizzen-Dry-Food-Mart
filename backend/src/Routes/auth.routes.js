const express = require('express');
const passport = require('passport');
const { getProfile, logout } = require('../Controllers/auth.controller');

const router = express.Router();

// Google OAuth login route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');  // Redirect after successful login
  }
);

// Route to get the user profile
router.get('/profile', getProfile);

// Logout route
router.get('/logout', logout);

module.exports = router;
