var express = require('express');//downloads express libraries
var fs = require('fs');//downloads fs libraries, shouldn't be necessary in end project
var favicon = require('serve-favicon');//I think this has to do with the thing in the corner of a tab
var models_villain = require('../models/Villain');//downloads our library of villain functions
var router = express.Router();

var Users = require('../models/User');

var userArrayToObject = function (user_d) {
  var user = {};//initiates object that will be villain
  user["name"] = user_d[0];
  user["gamesPlayed"] = parseInt(user_d[1]);
  user["wins"] = parseInt(user_d[2]);
  user["losses"] = parseInt(user_d[3]);
  user["paper"] = parseInt(user_d[4]);
  user["rock"] = parseInt(user_d[5]);
  user["scissors"] = parseInt(user_d[6]);
  user["password"] = user_d[7];
  user["first"] = user_d[8];
  user["last"] = user_d[9];
  user["created"] = user_d[10];
  user["lastUpdated"] = user_d[11];
  //adds object attributes dependent on index in array
  return user;//returns object as output
}
var villainArrayToObject = function (villain_d) {
  var villain = {};//initiates object that will be villain
  villain["name"] = villain_d[0];
  villain["gamesPlayed"] = parseInt(villain_d[1]);
  villain["wins"] = parseInt(villain_d[2]);
  villain["losses"] = parseInt(villain_d[3]);
  villain["paper"] = parseInt(villain_d[4]);
  villain["rock"] = parseInt(villain_d[5]);
  villain["scissors"] = parseInt(villain_d[6]);
  villain["strategy"] = villain_d[7];
  //adds object attributes dependent on index in array
  return villain;//returns object as output
}

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
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {newUser:true, incomplete:false, duplicate:false})
});

router.post('/users', function(request, response){
  var duplicateUser=false;
  var user={
      name: request.body.username,
      password: request.body.password,
      first: request.body.firstname,
      last: request.body.lastname
  };//reads data fields
  console.log("MVC Server Input User: "+JSON.stringify(user));
  var new_user = Users.createBlankUser(user);
  var users_file=fs.readFileSync('data/users.csv','utf8');//converts users csv to a string
  var rows = users_file.split('\n');//generates array of stringified user objects
  var user_info = [];//array which will hold objectified users
  for(var i=1; i<rows.length-1; i++){//indexing does not include header or whitespace at the end
    var user = userArrayToObject(rows[i].split(','));//converts stringified user object to array of stringified values
    user_info.push(user);//adds user to list
  }
  for(i=0; i<user_info.length; i++){
    if(user_info[i]["name"]==user.name){
      duplicateUser=true;
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render('user_details', {newUser:true, incomplete:false, duplicate:true})
    }
  }
  if(!duplicateUser){
    user_info.push(new_user);//new user object added to list of users
    var new_user_data = "name,gamesPlayed,wins,losses,paper,rock,scissors,password,first,last,created,lastUpdated\n";
    for(i=0; i<user_info.length; i++){
      new_user_data += user_info[i]["name"] + ",";
      new_user_data += user_info[i]["gamesPlayed"] + ",";
      new_user_data += user_info[i]["wins"] + ",";
      new_user_data += user_info[i]["losses"] + ",";
      new_user_data += user_info[i]["paper"] + ",";
      new_user_data += user_info[i]["rock"] + ",";
      new_user_data += user_info[i]["scissors"] + ",";
      new_user_data += user_info[i]["password"] + ",";
      new_user_data += user_info[i]["first"] + ",";
      new_user_data += user_info[i]["last"] + ",";
      new_user_data += user_info[i]["created"] + ",";
      new_user_data += user_info[i]["lastUpdated"];
      new_user_data += "\n";
    }
    fs.writeFileSync('data/users.csv', new_user_data,'utf8');
    //converts user information back into a string and writes it to csv file
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('index', {message:false, message2:false});
  }
});


router.get('/users/:id/edit', function(req, res){
  console.log('Request- /users/'+req.params.id)+'/edit';
  var u = Users.getUserByName(req.params.id)
  res.status(200);
  res.setHeader('Content-Type', 'text/html')
  res.render('user_details', {newUser:false,incomplete:false,duplicate:false,user:u})
});

router.get('/users/:id/delete', function(request, response){
  console.log('Request- Delete /users'+request.params.id)+'/';
  Users.deleteUser(request.params.id);
  response.redirect('/');
  // response.status(200);
  // response.setHeader('Content-Type', 'text/html')
  // response.render('index', {message:false, message2:false});
});

router.get('/users/:id/', function(request, response){
  console.log('Request- Put /users'+request.params.id)+'/';
  var u = Users.getUserByName(request.params.id)

  var user={
      name: request.query.username,
      password: request.query.password,
      first: request.query.firstname,
      last: request.query.lastname
  };//reads data fields
    if(user.username==""||user.password==""||user.first==""||user.last==""){
      console.log("Enter all info!")
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render('user_details', {newUser:false,incomplete:true,duplicate:false,user:u})
    }
    else{
    var new_user = Users.updateUser(u,user.name,user.password,user.first,user.last);
      //add change to lastUpdated !!!!!!!
    var users_file=fs.readFileSync('data/users.csv','utf8');//converts users csv to a string
    var rows = users_file.split('\n');//generates array of stringified user objects
    var user_info = [];//array which will hold objectified users
    for(var i=1; i<rows.length-1; i++){//indexing does not include header or whitespace at the end
      var user = userArrayToObject(rows[i].split(','));//converts stringified user object to array of stringified values
      user_info.push(user);//adds user to list
    }

    var new_user_data = "name,gamesPlayed,wins,losses,paper,rock,scissors,password,first,last,created,lastUpdated\n";
    for(i=0; i<user_info.length; i++){
      if(user_info[i]["name"]==request.params.id){
        new_user_data += new_user.name + ",";
        new_user_data += new_user.gamesPlayed + ",";
        new_user_data += new_user.wins + ",";
        new_user_data += new_user.losses + ",";
        new_user_data += new_user.paper + ",";
        new_user_data += new_user.rock + ",";
        new_user_data += new_user.scissors + ",";
        new_user_data += new_user.password + ",";
        new_user_data += new_user.first + ",";
        new_user_data += new_user.last + ",";
        new_user_data += new_user.created + ",";
        new_user_data += new_user.lastUpdated;
        new_user_data += "\n";
      }
      else{
        new_user_data += user_info[i]["name"] + ",";
        new_user_data += user_info[i]["gamesPlayed"] + ",";
        new_user_data += user_info[i]["wins"] + ",";
        new_user_data += user_info[i]["losses"] + ",";
        new_user_data += user_info[i]["paper"] + ",";
        new_user_data += user_info[i]["rock"] + ",";
        new_user_data += user_info[i]["scissors"] + ",";
        new_user_data += user_info[i]["password"] + ",";
        new_user_data += user_info[i]["first"] + ",";
        new_user_data += user_info[i]["last"] + ",";
        new_user_data += user_info[i]["created"] + ",";
        new_user_data += user_info[i]["lastUpdated"];
        new_user_data += "\n";
      }
    }
    fs.writeFileSync('data/users.csv', new_user_data,'utf8');

    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('user_details', {newUser:false,incomplete:false,duplicate:false,user:new_user})
  }

});


module.exports = router;
