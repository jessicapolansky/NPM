const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const pgp = require('pg-promise')({
  
})
var db = pgp({database: 'restaurant', user: 'postgres'});

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.get('/', function (request, response) {
  response.send('Hello World x2!');
});
// creating forms in app.js
app.get('/form', function(req, resp) {
  resp.render('form.html');
});
//post the form submitted
app.use(body_parser.urlencoded({extended: false}));
app.post('/submit', function (request, response) {
  console.log(request.body);
  response.send('OK');
});
// use nunjucks to render page. include any inputs for page in the context dictionary
app.get('/hello', function (request, response) {
  var name = request.query.name || 'World';
  var context = {title: 'Hello', name: name};
  response.render('index.html', context);
});
//pg-promise to query database
app.get('/search', function(req, resp, next) {
  let term = req.query.searchTerm;
  let query = "SELECT * FROM restaurant WHERE \
  restaurant.name ILIKE '%$1#%'";
  db.any(query, term)
    .then(function(resultsArray) {
      resp.render(results), {
        results: resultsArray
      });
    })
    .catch(next);
});
// access static files in the public folder
app.use(express.static('public'));
// static routing
app.get('/about', function (request, response) {
  response.send('About Me');
});
app.get('/projects', function (request, response) {
  response.send('Projects');
});
// dynamic routing
app.get('/post/:slug', function (request, response) {
  var slug = request.params.slug;
  response.send('Post About: ' + slug);
});
// query, by adding ?name=something, you can pull in 'something' as name, unless undefined => world
app.get('/hello', function (request, response) {
  var name = request.query.name || 'World';
  response.send('Hello ' + name);
});
app.listen(8080, function () {
  console.log('Listening on port 8080');
});