var mongoose = require('mongoose');

exports.User = mongoose.Schema({
  username: {type: 'String', unique: true},
  password: {type: 'String'}  
}, {timestamps: true});

exports.Link = mongoose.Schema({
  url: {type:'String'},
  baseUrl: {type:'String'},
  code: {type:'String'},
  title: {type:'String'},
  visits: {type:'Number'}
}, {timestamps: true});


// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });


// var path = require('path');
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   }
// });
// var db = require('bookshelf')(knex);


// module.exports = db;
