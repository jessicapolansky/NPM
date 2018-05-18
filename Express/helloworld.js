const express = require('express');
const app = express();
const nunjucks = require('nunjucks');

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.use(express.static('public'));

app.get('/helloworld', function (request, response) {
    var context = {text: 'Hello, world!'};
  response.render('helloworld.html', context);
});
app.get('/cats', function (request, response) {
    var context = {text: 'Meow!'};
  response.render('cats.html', context);
});
app.get('/dogs', function (request, response) {
    var context = {text: 'Woof!'};
  response.render('dogs.html', context);
});
app.get('/greet/:name', function (request, response) {
  var name = request.params.name || 'Nobody';
  var age = request.query.age || '29';
  var year = 2018 - age;
    var context = {title: 'Hello', name: name, year: year};
  response.render('index.html', context);
});
app.get('/fav_animals', function (request, response) {

var context = {
    animals: [
  { name: 'cats', favorite: true },
  { name: 'dogs', favorite: true },
  { name: 'penguins', favorite: true },
  { name: 'tree frogs', favorite: false },
  { name: 'earth worms', favorite: false },
  { name: 'pigs', favorite: false },
]
};
  response.render('fav_animals.html', context);

});
app.listen(8080, function () {
  console.log('Listening on port 8080');
});
