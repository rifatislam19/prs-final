var express = require('express');//downloads express libraries
var fs = require('fs');//downloads fs libraries, shouldn't be necessary in end project
var favicon = require('serve-favicon');//I think this has to do with the thing in the corner of a tab
var models_villain = require('../models/Villain');//downloads our library of villain functions
var router = express.Router();

var Users = require('../models/User');

// var userArrayToObject = function (user_d) {
//   var user = {};//initiates object that will be villain
//   user["name"] = user_d[0];
//   user["gamesPlayed"] = parseInt(user_d[1]);
//   user["wins"] = parseInt(user_d[2]);
//   user["losses"] = parseInt(user_d[3]);
//   user["paper"] = parseInt(user_d[4]);
//   user["rock"] = parseInt(user_d[5]);
//   user["scissors"] = parseInt(user_d[6]);
//   user["password"] = user_d[7];
//   user["first"] = user_d[8];
//   user["last"] = user_d[9];
//   user["created"] = user_d[10];
//   user["lastUpdated"] = user_d[11];
//   //adds object attributes dependent on index in array
//   return user;//returns object as output
// }
// var villainArrayToObject = function (villain_d) {
//   var villain = {};//initiates object that will be villain
//   villain["name"] = villain_d[0];
//   villain["gamesPlayed"] = parseInt(villain_d[1]);
//   villain["wins"] = parseInt(villain_d[2]);
//   villain["losses"] = parseInt(villain_d[3]);
//   villain["paper"] = parseInt(villain_d[4]);
//   villain["rock"] = parseInt(villain_d[5]);
//   villain["scissors"] = parseInt(villain_d[6]);
//   villain["strategy"] = villain_d[7];
//   //adds object attributes dependent on index in array
//   return villain;//returns object as output
// }

// router.get('/:id', function(req, res){
//   console.log('Request- /user/'+req.params.id);
//
//   var u = Users.getUserByName(req.params.id);
//
//   res.status(200);
//   res.setHeader('Content-Type', 'text/html')
//   res.render('game', {user:u});
// });

router.get('/user/new', function(req, res){
  console.log("GET request for creating a new user within user_details");
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {newUser:true, incomplete:false, duplicate:false})
});

router.post('/users', function(request, response){
  var user={
      name: request.body.username,
      password: request.body.password,
      first: request.body.firstname,
      last: request.body.lastname
  };//reads data fields
  if(user.username==""||user.password==""||user.first==""||user.last==""){
    console.log("Incomplete user information, sent back to user_details");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('user_details', {newUser:true,incomplete:true,duplicate:false})
  }//incomplete form
  else{
    // var users_file=fs.readFileSync('data/users.csv','utf8');//converts users csv to a string
    // var rows = users_file.split('\n');//generates array of stringified user objects
    // var user_info = [];//array which will hold objectified users
    // for(var i=1; i<rows.length-1; i++){//indexing does not include header or whitespace at the end
    //   var user = userArrayToObject(rows[i].split(','));//converts stringified user object to array of stringified values
    //   user_info.push(user);//adds user to list
    // }
    Users.createUser(user, function(user_info, duplicateUser) {
      if(duplicateUser){
        console.log("Duplicate user found in new user POST request in controllers/user.js");
        response.status(200);
        response.setHeader('Content-Type', 'text/html');
        response.render('user_details', {newUser:true, incomplete:false, duplicate:true})
      }//redundancy
      if(!duplicateUser){//original username verified
        console.log("Valid username entered, POST request made in controllers/user.js and directed to index");
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('index', {message:false, message2:false});
      }//new user object added to list of users
      //converts user information back into a string and writes it to csv file
    });
  }
});

router.get('/users/:id/edit', function(req, res){
  console.log("GET request made to edit user "+req.params.id+" in controllers/user.js");
  Users.getUserByName(req.params.id, function(u) {
    res.status(200);
    res.setHeader('Content-Type', 'text/html')
    res.render('user_details', {newUser:false,incomplete:false,duplicate:false,user:u})
  });
});

router.get('/users/:id/delete', function(request, response){
  console.log(request.params.id+" deleted in controllers/user.js");
  Users.deleteUser(request.params.id);
  response.redirect('/');
  // response.status(200);
  // response.setHeader('Content-Type', 'text/html')
  // response.render('index', {message:false, message2:false});
});

router.get('/users/:id/', function(request, response){
  console.log("GET request for /users/"+request.params.id+"/");
  var u={
      name: request.query.username,
      password: request.query.password,
      first: request.query.firstname,
      last: request.query.lastname
  };//reads data fields
  if(u.username==""||u.password==""||u.first==""||u.last==""){
    console.log("Incomplete user data, sent back to user_details");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('user_details', {newUser:false,incomplete:true,duplicate:false,user:u})
  }
  else{
    Users.getUserByName(request.params.id, function(user){
      Users.updateUser(u,user.name,user.password,user.first,user.last, function(new_user){
        console.log(user.name+" updated in controllers/user.js");
        response.status(200);
        response.setHeader('Content-Type', 'text/html');
        response.render('user_details', {newUser:false,incomplete:false,duplicate:false,user:new_user});
      });
    });
  }
});

module.exports = router;
