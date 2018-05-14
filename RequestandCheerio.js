const cheerio = require('cheerio');
const request = require('request');

request('https://www.npmjs.com/', function (error, response, body) {
  var html = body; // Print the HTML
  const $ = cheerio.load(html);
  const test = $('h3 a').contents();
  var i;
  var array = [];
  for (i = 0; i < test.length; i++) {
    array.push(test[i]['data']);
  }
  // const array = [test[0]['data'], test[1]['data'], test[2]['data'], test[3]['data'], test[4]['data']];
  console.log(array);
});