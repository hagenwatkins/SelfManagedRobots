const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');



router.get('/login', function(req, res) {
  const flashMessages = res.locals.getMessages();
  console.log('flash', flashMessages);

  if (flashMessages.error) {
    res.render('login', {
      showErrors: true,
      errors: flashMessages.error
    })
  } else {
    res.render('login');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/all',
  failureRedirect: '/login',
  failureFlash: true
}));



router.get('/register', function(req, res) {

  const flashMessages = res.locals.getMessages();
  console.log('flash', flashMessages);

  if (flashMessages.error) {
    res.render('register', {
      showErrors: true,
      errors: flashMessages.error
    })
  } else {
    res.render('register');
  }
});

router.post('/register', function(req, res, next) {

  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();

  req.getValidationResult()
    .then(function(result) {
      if (result.isEmpty() === false) {
        result.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        res.redirect('/register');
      }
      else {
        const user = new User({
          username: req.body.username,
          password: req.body.password
        });
        user.save((err) => {
          if (err) {
            if (err.errmsg.indexOf('duplicate key error') > -1) {
              req.flash('error', 'Username already in use');
            } else {
              req.flash('error', 'There was a problem with registration');
            }
            res.redirect('/register');
            console.log('There was an error saving the user.', err);
          } else {
            next();
          }
        });
      }
  });
}, passport.authenticate('local', {
  successRedirect: '/all'
}));



router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
})

module.exports = router;
