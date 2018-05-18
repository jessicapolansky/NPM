var pgp = require('pg-promise');
var db = pgp({database: 'music', user: 'postgres'});
var prompt = require('prompt-promise');
var q = "INSERT INTO album VALUES (default, $1, $2)";

var i1 = prompt('New album name: ')
.then(function albumResponse(val) {
  var albumName = val;
  return albumName;
});
var i2 = prompt('Year: ')
.then(function yearResponse(val) {
    var year = val;
    return year;
});
Promise.all([i1, i2])
.then(function (result) {
    db.result(q, i1, i2);
    console.log(result);
});
// pgp.end();