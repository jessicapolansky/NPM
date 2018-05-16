var request = require("request");
var rp = require("request-promise");
var fs = require('fs-promise');



var urls = [
  'https://en.wikipedia.org/wiki/Futures_and_promises',
  'https://en.wikipedia.org/wiki/Continuation-passing_style',
  'https://en.wikipedia.org/wiki/JavaScript',
  'https://en.wikipedia.org/wiki/Node.js',
  'https://en.wikipedia.org/wiki/Google_Chrome'
];



var requests = [];
for (var i = 0; i < urls.length; i++) {
 requests.push(rp(urls[i]));
}

Promise.all(requests)
 .then(function(htmlStrings) {
   var files = [];
   htmlStrings.forEach(function(htmlString, i) {
     files.push(fs.writeFile("page" + i + ".html", htmlString));
   });

   return Promise.all(files);
 })
 .then(function(results) {
   console.log(`Wrote ${results.length} Files`);
 })
 .catch(function(error) {
   console.log("error:", error); // Print the error if one occurred
 });
