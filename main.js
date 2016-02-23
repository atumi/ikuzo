'use strict';
var
  express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  parser = require('body-parser'),
  knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: ":memory:"
    }
  });

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(express.static(__dirname + '/public'))

app.get('/api/projects', function (req, res, next) {
  knex.select('*').from('projects')
    .then(function (projects) {
      res.json(projects);
      return next();
    })
    .catch(function (err) {
      res.status(500).json(err);
      return next();
    });
});

app.get('/api/projects/:id', function (req, res, next) {
  var id = req.params.id;
    res.json(id);
  // ここで id を指定した sql の検索 (hint: where) をする処理を書く
  // データがなかった場合には NotFound(404) を返すこと

  return next();
});

// DELETE /api/projects/:id に対する処理を書く
// GET /api/projects/:id と大体似た処理になる。

app.post('/api/projects', function (req, res, next) {
  var
    title = req.body.title,
    description = req.body.description,
    url = req.body.url;

    // ここに title / description がなかった場合に BadRequest(400) を返す処理を書く

    knex('projects').insert({
      title: title,
      description: description,
      url: url
    }).then(function (ids) {
      res.json({
        id: ids[0],
        title: title,
        description: description,
        url: url
      })
      return next();
    }).catch(function (err) {

      // ここに 重複があった場合に BadRequest(400) を返す処理を書く

      res.status(500).json(err);
      return next();
    });
  });


/** @ToDo
  * Initialize database
  * this is for 'in-memory' database and should be removed
  */
//複数のテーブルを使う時にはうまく動作しないので気をつけて！！！！
var sqls = require('fs')
  .readFileSync(__dirname + '/specifications/database.sql')
  .toString();

knex.raw(sqls)
  .then(function () {
    /** @ToDo
      * Run server after database initialization
      * this is for 'in-memory' database and should be removed
      */
    app.listen(port, function () {
      console.log("Server running with port", port)
    });
  });