const router = require('express').Router();
const User = require('../models/user');

router.get('/', function(req, res) {
  res.render('index', {});
});

function authRequired(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/all', authRequired, function(req, res) {

  User.find({}).then(function(results) {
    res.render('index', { users: results });
  });
});

router.get('/user/:id', authRequired, function(req, res) {
  if (req.user._id == req.params.id) {
    res.redirect('/details')
  } else {
    console.log('user id?', req.params.id);
    let robotId = req.params.id;

    User.findById(robotId).then((results) => {
      res.render('details', results);
    });
  }
});

router.get('/details/:id', authRequired, (req, res) => {
  let robotId = req.params.id;

  User.findById(robotId).then(results => {
    res.render('edit', results);
  })
});

router.get('/details', authRequired, (req, res) => {
  res.render('details', req.user);
})

router.post('/details/edit/:id', authRequired, (req, res) => {
  let robotId = req.params.id;

  console.log(req.body);

  User.findByIdAndUpdate(robotId, { $set: req.body}, function(err, results) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(results);
    }
  });
  res.redirect('/details');
});

router.post('/details/delete/:id', authRequired, (req, res) => {
  let robotid = req.params.id;

  User.findByIdAndRemove(robotid, (err, results) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      res.redirect('/all');
    }
  });
});

router.get('/unemployed', authRequired, function(req, res) {
  User.find({ job: { $type: 10 } }).then((results) => {
    res.render('all', { users: results });
  });
});

router.get('/employed', authRequired, function(req, res) {
  User.find({ job: { $type: 2 } }).then((results) => {
    res.render('all', { users: results });
  });
});

module.exports = router;
