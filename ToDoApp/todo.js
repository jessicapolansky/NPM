const express = require('express');
const request = require('request');
const app = express();
const body_parser = require('body-parser');
const nunjucks = require('nunjucks');
const pgp = require('pg-promise')({});
const db = pgp({database: 'task', user: 'postgres'});

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  noCache: true
});
app.use(express.static('public'));

app.get('/', function (req, resp) {
  resp.send('HomePage test');
});

app.get('/todos', function (req, resp, next) {
  db.any("SELECT * FROM task WHERE done='FALSE'")
   .then(function (results) {
    resp.render('todos.html', {results: results});
   })
   .catch(next);
});

app.get('/todos/add', function (req, resp) {
      resp.render('form.html');
});

app.use(body_parser.urlencoded({extended: false}));

app.post('/todos', function (req, resp, error) {
    var description = req.body.description;
    console.log(description);
    db.result(`INSERT INTO task VALUES (default, '${description}', FALSE)`)
    .then(function() {
      resp.redirect('/todos');
    })
    .catch(error);
    console.log(error);
});

app.get('/todo/done/:id', function(req, resp, error) {
  var id = req.params.id;
  db.none(`UPDATE task SET done = true WHERE id='${id}'`)
    .then(data => {
      console.log('successful change');
    })
    .catch(error => {
        console.log('error: ', error);
    });
      //var context = {message: "Task $1 marked complete", id};
      resp.redirect('/todos');
    });
app.listen(8080, function () {
  console.log('Listening on port 8080');
});
