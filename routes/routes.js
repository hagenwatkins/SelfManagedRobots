const router = require('express').Router();
const parser = require('body-parser');
const User = require('../model/users');

router.get('/login', function(req, res){
  res.render('login');
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
  })

router.get('/register', function(req, res){
  res.render('register');
  });
  router.post('/register', function (req, res)  {

    res.render('./directory')
  });

  module.exports = router;
