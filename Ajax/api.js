const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const axios = require('axios');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const apicache = require('apicache');
const cache = apicache.middleware;
const request = require('request-promise');
app.use(express.static('public'));
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});

app.use(body_parser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/', function (req, response) {
  response.render('index.html', {});
});


app.get('/search/', cache('5 minutes'), function (req, response, next) {
  var movie = req.query.movie;
  var options = { method: 'GET',
                  url: 'https://api.themoviedb.org/3/search/movie',
                  qs: 
                     { include_adult: 'false',
                       page: '1',     
                       query: movie,
                       language: 'en-US',
                       api_key: '2c88cdd799ee8424549ebd41bf05413f' },
                  json: true,
                  body: '{}' };
  request(options, function (error, response, body) {
  if (error) throw new Error(error);
  })
  .then(function (body) {
    console.log(body.results[0]);
    response.render('search.html', {body: body});
  })
  .catch(function (error) {
    console.error(error);
  });
  });



var PORT = process.env.PORT || 8080;
http.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});