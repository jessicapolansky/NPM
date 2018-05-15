var rp = require('request-promise');
var request = require('request');
var fs = require('fs');



var urls = [
  'https://en.wikipedia.org/wiki/Futures_and_promises',
  'https://en.wikipedia.org/wiki/Continuation-passing_style',
  'https://en.wikipedia.org/wiki/JavaScript',
  'https://en.wikipedia.org/wiki/Node.js',
  'https://en.wikipedia.org/wiki/Google_Chrome'
];

var options = [];

for (var i = 0; i < urls.length; i++) {
    options.push(rp(urls[i]));
}

var body = [];
var page = 'test.html';
Promise.all(options)
    .then(function(values) {
        body = values;
        fs.writeFile(page, body, function(err) {
        if (err) {
            console.log(err);
        }
        console.log("HTML written to test.html")
    });    
    })
    .catch(function(err) {
        console.log(err);
    });

