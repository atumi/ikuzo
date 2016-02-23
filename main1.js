'use strict';
var
 express = require('express'),
 app = express(),
 port = process.env.PORT || 3000,
 parser = require('body-parser');

 var knex = require('knex')({
   client: 'sqlite3',
   connection:{
     filename:":memory:"
   }
 });

app.use(parser.json());
app.use(express.static(__dirname + '/public'))

app.get('/api/projects', function (req, res, next) {
 knex.select('*').from('projects').then(function(projects){
   res.json(projects);
   return next();
 })
 .catch(function(err){
   res.status(500).json(err);
   return next;
 });

});

app.get('/api/projects/:id', function (req, res, next) {
 var id = req.params.id;
 res.json(id);
 return next();
});


app.get('/api/notfound', function (req, res, next) {
 res.status(404).json('NotFound');
 return next();
});

app.post('/api/projects', function (req, res, next) {
 var
 title = req.body.title,
 description = req.body.description,
 url = req.body.url;

 knex('projects').insert({
   title: title,
   description: description,
   url: url
 }).then(function (ids){
   res.json({
     id: ids[0],
     title:title,
     description:description,
     url:url
   });
   return next();
 }).catch(function(err){
   res.status(500).json(err);
   return next();
 });
});






/** @ToDo
 * Initialize database
 * this is for 'in-memory' database and should be removed
 */
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