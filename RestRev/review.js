// all the required modules + settings
const express = require('express');
const request = require('request');
const app = express();
app.use(express.static('public'));
const bodyParser = require('body-parser');
const pgp = require('pg-promise')({});
const session = require('express-session');
const morgan = require('morgan');
const db = pgp({database: 'test', user: 'postgres'});
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SECRET_KEY || 'dev',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000,
    secure: false
  }
}));
// Redirect to login page if no user credentials have been entered
app.use(function (req, resp, next) {
  if (req.session.user) {
      console.log(req.session.user);
      var user = req.session.user;
    next();
  } else if (req.path == '/login') {
    next();
  } else {
      resp.redirect('/login');
  }
});
app.get('/', function (req, resp) {
    var user = req.session.user;
    resp.render('search.html', {user: user});
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
        resp.render('restaurant.html', {results: results});
    })
        .catch(next);
});

app.use(bodyParser.urlencoded({extended: false}));

app.get('/login', function (req, resp) {
  resp.render('login.html');
});

app.post('/login', function(req, resp) {
    var username = req.body.username;
    var password = req.body.password;
    var p1 = db.one("SELECT password FROM reviewer WHERE name='$1#'", username)
    .then(function (results) {
        if (results.password == password) {
            req.session.user = username;
            resp.redirect('/');
        } else {
            resp.render('login.html');
        }
})});

app.post('/addreview/:id', function (req, resp, next) {
    var id = req.params.id;
    var title = req.body.title;
    var stars = parseInt(req.body.stars, 10);
    var review = req.body.review;
    var reviewer = req.session.user;
    var rev = db.one("SELECT id FROM reviewer WHERE name = '$1#'", reviewer)
    .then(function(rev) {
        var revID = rev.id;5
        db.result(`INSERT INTO review VALUES (default, '${title}', '${review}', '${stars}', '${revID}', '${id}')`)
    })
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
    var address = req.body.address;
    var category = req.body.category;
    var id = db.result(`INSERT INTO restaurant VALUES (default, '${name}', '${address}', '${category}') \
    RETURNING id AS id`)
    .then(function(results) {
        resp.redirect(`/restaurant/1`);
        // pgp.end();
    })
    .catch(next);
});
app.listen(8080, function () {
  console.log('Listening on port 8080');
});
