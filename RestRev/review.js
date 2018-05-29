const express = require('express');
const request = require('request');
const app = express();
app.use(express.static('public'));
const bodyParser = require('body-parser');
const pgp = require('pg-promise')({});
const db = pgp({database: 'test', user: 'postgres'});
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', function (req, resp) {
    resp.render('search.html');
});


app.get('/results', function (req, resp, next) {
    var name = req.query.restaurant || 'a';
    var context = '%' + name + '%';
    db.query("SELECT * FROM restaurant WHERE name ILIKE '$1#'", context)
        .then(function (results) {resp.render('results.html', {results: results}); 
        })
        .catch(next);
});
app.get('/restaurant/:id', function(req, resp, next) {
    var id = req.params.id;
    var p1 = db.query("SELECT * FROM restaurant WHERE id='$1#'", id)
    var p2 = db.any("SELECT reviewer.name as reviewer_name, review.title, review.stars, review.review \
    FROM restaurant INNER JOIN review on review.restaurant_id = restaurant.id \
    LEFT OUTER JOIN reviewer ON review.reviewer_id = reviewer.id WHERE restaurant.id='$1#'", id)
    Promise.all([p1, p2])
    .then(function (results) {
        console.log(results);
        resp.render('restaurant.html', {results: results});
    })
        .catch(next);
        // .catch(next function(error) {
        //     res.render('error.html')
        // })
});
// app.get('/error', function(req, resp, next, err) {
//   res.status(500);
//   res.render('error', { error: err });
// }

// app.get('/addreview/:id', function(req, resp, next) {
//     var id = req.params.id;
//     resp.render('addreview.html', {})
//     .catch(next);
// });
app.use(bodyParser.urlencoded({extended: false}));

app.post('/addreview/:id', function (req, resp, next) {
    var id = req.params.id;
    var title = req.body.title;
    var stars = parseInt(req.body.stars, 10);
    var review = req.body.review;
    db.result(`INSERT INTO review VALUES (default, '${title}', '${review}', '${stars}', NULL, ${id})`)
    .then(function() {
        resp.redirect(`/restaurant/${id}`);
    })
    .catch(next);
});

app.get('/submit/restaurant', function (req, resp, next) {
    console.log("get success");
    resp.render('newrest.html', {});
});

app.post('/submit/restaurant', function (req, resp, next) {
    var name = req.body.name;
    console.log(name);
    var address = req.body.address;
    console.log(address);
    var category = req.body.category;
    console.log(name);
    var id = db.result(`INSERT INTO restaurant VALUES (default, '${name}', '${address}', '${category}') \
    RETURNING id AS id`)
    .then(function(results) {
        console.log(results.row);
        resp.redirect(`/restaurant/1`);
        // pgp.end();
    })
    .catch(next);
});
app.listen(8080, function () {
  console.log('Listening on port 8080');
});
