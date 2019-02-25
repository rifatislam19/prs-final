var fs = require("fs");
// var GoogleSpreadsheet = require('google-spreadsheet');
// var creds = require('./client_secret.json');
//
// var doc = new GoogleSpreadsheet('1KpbeLRyGYaPEkCsgKP-XcHVsYePuX1Uwxuxtg12lEGk');

exports.usersCSVHeader = "name,gamesPlayed,wins,losses,paper,rock,scissors,password,first,last,created,lastUpdated\n";

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

exports.getUserByName = function(user_id) {
  console.log("User.getUser("+user_id+") called");

  var user = completelyBlankUser();
  var all_users = fs.readFileSync(__dirname +'/../data/users.csv', 'utf8').split("\n");//getRows();
  var userMissing = true;
  for(var i=1; i<all_users.length; i++){
    var u = exports.parseString(all_users[i]);
    if(u.name==user_id){
      userMissing = false;
      user=u;
    }
  }
  if (userMissing) console.log("Error: "+user_id+" not found in users.csv while running User.getUser()");
  console.log(user);
  return user;
}
//retrieves user by name

// exports.getUsers=function(callback) {
//
//   getAllDatabaseRows(function(users){
//     callback(users);
//   });
// }

// exports.updateUser = function(user_id, key, value) {
//   console.log("User.updateUser("+user_id+","+key+","+value+") called, which will set "+user_id+"."+key+" to "+value);
//   var userObj = getUser(user_id);
//   console.log("Old value: "+userObj.key);
//   userObj.key = value;
//   console.log("New value: "+userObj.key);
//   var newString = createString(userObj);//will replace current string
//   var newRows = getRows();
//   var userMissing = true;
//   var index = 0;
//   for (var i = 1; i < len(newRows); i++) {
//     var u = parseString(all_users[i]);
//     if(u.name==user_id){
//       userMissing = false;
//       index = i;
//     }
//   }
//   if (userMissing) console.log("Error: "+user_id+" not found in users.csv while running User.updateUser");
//   newRows[i]=newString;//replaces string
//   var newCSV = createCSVText(newRows);
//   fs.writeFileSync(__dirname +'/../data/users.csv', 'utf8', newCSV);

exports.updateUser = function(u, user_name, user_password, user_first, user_last) {
  u.name = user_name;
  u.password = user_password;
  u.first = user_first;
  u.last = user_last;
  return u;
}

exports.deleteUser = function(user_id) {
  console.log("User.deleteUser("+user_id+") called");

  var users_file=fs.readFileSync('data/users.csv','utf8');//converts users csv to a string
  var rows = users_file.split('\n');//generates array of stringified user objects
  var user_info = [];//array which will hold objectified users
  for(var i=1; i<rows.length-1; i++){//indexing does not include header or whitespace at the end
    var user = userArrayToObject(rows[i].split(','));//converts stringified user object to array of stringified values
    user_info.push(user);//adds user to list
  }

  var new_user_data = "name,gamesPlayed,wins,losses,paper,rock,scissors,password,first,last,created,lastUpdated\n";
  for(i=0; i<user_info.length; i++){
    if(user_info[i]["name"]!=user_id){
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
}

exports.getAllDatabaseRows= function(callback){
  // Authenticate with the Google Spreadsheets API.
  doc.useServiceAccountAuth(creds, function (err) {
    // Get all of the rows from the spreadsheet.
    doc.getRows(1, function (err, rows) {
      callback(rows);
    });
  });
}

exports.parseString= function (str){
  console.log("User.parseString() called on: "+str);
  var arr = str.split(',');
  var output = {};
  output.name = arr[0];
  output.gamesPlayed = arr[1];
  output.wins = arr[2];
  output.losses = arr[3];
  output.paper = arr[4];
  output.rock = arr[5];
  output.scissors = arr[6];
  output.password = arr[7];
  output.first = arr[8];
  output.last = arr[9];
  output.created = arr[10];
  output.lastUpdated = arr[11]
  console.log("JSON.stringify() called on output object: "+JSON.stringify(output));
  return output;
}
//converts a string row from users.csv into a user object

exports.createString= function (userObject){
  console.log("User.createString() called on (JSON version of object): "+ JSON.stringify(userObject));
  var output = userObject["name"] + ",";
  output += userObject["gamesPlayed"] + ",";
  output += userObject["wins"] + ",";
  output += userObject["losses"] + ",";
  output += userObject["paper"] + ",";
  output += userObject["rock"] + ",";
  output += userObject["scissors"] + ",";
  output += userObject["password"] + ",";
  output += userObject["first"] + ",";
  output += userObject["last"] + ",";
  output += userObject["created"] + ",";
  output += userObject["lastUpdated"] + ","
  output += "\n";
  console.log("Outputted string: "+output);
  return output;
}
//converts a user object back to a string

exports.createCSVText= function (array){
  console.log("User.createCSVText() called giving the following output:");
  var header = exports.usersCSVHeader;//header string for CSV file
  var output = header;
  for (var i = 0; i < len(array); i ++) {
    output = output + "\n" + array[i];
  }
  console.log(output);
  console.log("End of User.createCSVText() output");
  return output;
}
//converts an array of strings into a csv file

var completelyBlankUser= function(){
  console.log("User.completelyBlankUser() called");
  return {name:"", gamesPlayed:0, wins:0, losses:0, paper:0, rock:0, scissors:0, password:"", first:"", last:"", created:exports.getDateString(), lastUpdated:exports.getDateString()};//include timing
}
//creates a blank user object given an input object

exports.getDateString= function () {
	var now = new Date();
	var output = now.getMonth()+1;//month index offset from 0-11 scale
 	output = output + "/" + now.getDate();
	output = output + "/" + now.getFullYear();
	console.log("Current date logged: " + output);
	return output;
}

exports.createBlankUser= function(user){
  console.log("User.createBlankUser() called");
  var output = {name:user.name, gamesPlayed:0, wins:0, losses:0, paper:0, rock:0, scissors:0, password:user.password, first:user.first, last:user.last, created:exports.getDateString(), lastUpdated:exports.getDateString()};//include timing
  console.log(JSON.stringify(output));
  return output;
}
//creates a blank user object given an input object
