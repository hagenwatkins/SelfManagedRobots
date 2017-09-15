const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let userSchema = new Schema ({
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: String,
  avatar: String,
  email: String,
  university: String,
  job: String,
  company: String,
  skills: [String],
  phone: String,
  address: {
    street_num: String,
    street_name: String,
    city: String,
    state_or_province: String,
    postal_code: String,
    country: String
  }
});

userSchema.virtual('password')
  .get(function() { return null; })
  .set(function(value) {
    const hash = bcrypt.hashSync(value, 10);
    this.passwordHash = hash;
  });

userSchema.methods.authenticate = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
}

userSchema.statics.authenticate = function(username, password, done) {
  this.findOne({ username: username }, function(err, user) {
    if (err) {
      console.log('Error attempting to use static authenticate function', err);
      done(err);
    } else if (user && user.authenticate(password)) {
      console.log('This should be a successful login');
      done(null, user);
    } else {
      console.log('Probably got their password wrong');
      done(null, false);
    }
  });
}

module.exports = mongoose.model('user', userSchema);
