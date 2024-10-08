// No specific imports needed here, assuming 'req.user' and 'req.logout()' are provided by Passport.js middleware

module.exports.getProfile = (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ user: req.user });
  };
  
  module.exports.logout = (req, res) => {
    req.logout((err) => {   // Adjust for potential callback with error handling
      if (err) { return next(err); }
      res.redirect('/');
    });
  };
  