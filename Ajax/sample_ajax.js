const axios = require('axios');
const api_url = 'https://api.punkapi.com/v2/beers';
var config = {
  params: {
    brewed_before: "11-2012",
    abv_gt: 6
  }
};
const express = require('express');
const nunjucks = require('nunjucks');
const body_parser = require('body-parser');
const apicache = require('apicache');
const cache = apicache.middleware;
const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
// axios.get('/', cache('5 minutes'), function (req, res) {
//   axios.get(api_url, config)
//   .then(function (r) {
//     console.log(r.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
// });

// var cache = apicache.middleware;



app.get('/', cache('5 minutes'), function (req, res) {
  axios.get(api_url, config)
  .then(function (r) {
    console.log(r.data);
  })
  .catch(function (error) {
    console.error(error);
  });
});

var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
