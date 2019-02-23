var express = require('express');
var router = express.Router();

var Users = require('../models/User');

router.get('/user/:id', function(req, res){
  console.log('Request- /user/'+req.params.id);

  var u = Users.getUserByName(req.params.id);

  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {user:u});
});

router.get('/users/:id/edit', function(req, res)){
  User.getUserByName(req.params.id,function(u){
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {user:u})
  });
});


module.exports = router;
