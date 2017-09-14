

const express = require('express');
const mustache = require('mustache-express');
const data = require('./data');
const mongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Routes = require('./routes/routes');
const app = express();


mongoose.connect('mongodb://localhost:27017/user_daily_project725', {
  useMongoClient: true
});
mongoose.Promise = global.Promise;


app.use(express.static('public'));

const mustacheInstance = mustache();
mustacheInstance.cache = null;
app.engine('mustache', mustacheInstance);

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(session({
  secret: 'illnevertell',
  resave: false,
  saveUninitialized: false
}));
/*app.use(passport.initialize());
app.use(passport.session());
require('./passportconfig').configure(passport);
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./routes/routes'));
app.get('/', function(req, res){
  res.render('index', data);
})
app.get('/all', function(req, res){
  res.render('all', data);
});

app.get('/details/:id', function(req, res) {
   let person = data.users.find(function(item){
    return item.id == req.params.id;
  });

  console.log('person', person);

  console.log(req.params);

  res.render('details', person);

});

const url = "mongodb://localhost:27017/user_daily_project725";

app.get('/all', function(req, res){
  db.collection('users').find({}).toArray(function(err, results){

    res.render('all',{users:results});

    //res.json(results);
  });
});



app.get('/employed', function(req, res) {
  db.collection('users').find({ job: { $type: 2 } }).toArray(function(err, results) {
    res.render('index', { users: results })
  })
});
app.get('/unemployed', function(req, res) {
  db.collection('users').find({ job: { $type: 10 } }).toArray(function(err, results) {
    res.render('index', { users: results });
  })
});


let db;


mongoClient.connect(url, function(err, database){
  if(err){
    console.log(err);
  } else {
    db = database;
    app.listen(3309, function(){
      console.log("mongo stuff");
    });
  }
});
