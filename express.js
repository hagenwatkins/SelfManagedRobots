const express = require('express');
const mustacheExpress = require('mustache-express');
const mongoose = require('mongoose');
const session = require('express-session');
const routes = require('./routes/users');
const auth = require('./routes/auth');
const passport = require('passport');
const flash = require('express-flash-messages');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
mongoose.connect('mongodb://localhost:27017/user_daily_project725', {
  useMongoClient: true
});mongoose.Promise = global.Promise;

const app = express();

app.use(session({
  secret: 'illnevertell',
  resave: false,
  saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./passportconfig').configure(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use('/', routes);
app.use('/', auth);



let mustacheInstance = mustacheExpress();
mustacheInstance.cache = null;
app.engine('mustache', mustacheInstance);
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');



app.use(express.static('public'));




app.listen(3309, function() {
  console.log('Rocafella! roll with the winners');
});
