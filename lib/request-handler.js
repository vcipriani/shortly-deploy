var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');


//rewrite as mongoose controllers
exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function( err, results){
    if(err){
      throw err;
    }
    res.send(200,results);
  });

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }


  Link.findOne({url:uri}, function(err ,result){
      if (result) {
        res.send(200, result);
      } else {
        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            console.log('Error reading URL heading: ', err);
            return res.send(404);
          }
          Link.create({
            url: uri,
            title: title,
            baseUrl: req.headers.origin,
          }, function(err, newLink) {
            if(err) {
              console.log(err);
              res.send(500, err);
            } 
              res.send(200, newLink);
          });
        });
      }
    });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  new User({ username: username })
    .fetch()
    .then(function(user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save()
          .then(function(newUser) {
            Users.add(newUser);
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  // Link.findOneAndUpdate({ code: req.params[0] },  {$set: { visits: this.visits + 1 }}, function(err, link){
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     return res.redirect(link.url);
  //   }
  // });
  Link.findOne({ code: req.params[0] } ,function(err, link){
    if (!link) {
      res.redirect('/');
    } else {
    return res.redirect(link.url);
    }
  });
  // new Link({ code: req.params[0] }).fetch().then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
};