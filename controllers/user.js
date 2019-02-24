var express = require('express');
var router = express.Router();

var Users = require('../models/User');

// router.get('/:id', function(req, res){
//   console.log('Request- /user/'+req.params.id);
//
//   var u = Users.getUserByName(req.params.id);
//
//   res.status(200);
//   res.setHeader('Content-Type', 'text/html')
//   res.render('game', {user:u});
// });

router.get('/:id/edit', function(req, res){
  console.log('Request- /'+req.params.id)+'/edit';
  var u = Users.getUserByName(req.params.id)
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {newUser:false,user:u})
});


module.exports = router;
