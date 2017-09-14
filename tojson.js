const people = require('./data.js');

people.users.forEach(function (person) {
  console.log(JSON.stringify(person));

});
module.exports{
  people: people
  
};
