var fs = require("fs");
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./../client_secret.json');
var doc = new GoogleSpreadsheet('1KpbeLRyGYaPEkCsgKP-XcHVsYePuX1Uwxuxtg12lEGk');
//accesses files that allow access to fs and google sheets

exports.usersCSVHeader = "name,gamesPlayed,wins,losses,paper,rock,scissors,password,first,last,created,lastUpdated\n";//unnecessary?

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

exports.setValue= function(name,attribute,newValue){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(1, function (err, rows) {
      console.log("models/User.setValue() called to set "+name+"."+attribute+" to "+newValue);
      var index = -1;
      for(var i=0; i<rows.length; i ++) {
        if (name==rows[i].username){
          index = i;
        }
      }
      if (index == -1) {
        console.log("User not found for models/User.setValue() function call");
      }
      console.log(name+"."+attribute+" initial value: "+rows[index][attribute]);
      rows[index][attribute]=newValue;
      rows[index].save();
      console.log(name+"."+attribute+" final value: "+rows[index][attribute]);
    });
  });
}

exports.addOne= function(name,attribute){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(1, function (err, rows) {
      console.log("Users.addOne() called to update "+name+"."+attribute);
      var index = -1;
      for(var i=0; i<rows.length; i ++) {
        if (name==rows[i].username){
          index = i;
        }
      }
      if (index == -1) {
        console.log("User not found for models/User.addOne() function call");
      }
      console.log(name+"."+attribute+" initial value: "+rows[index][attribute]);
      rows[index][attribute]++;
      rows[index].save();
      console.log(name+"."+attribute+" final value: "+rows[index][attribute]);
    });
  });
}

exports.writeUsersToSheet= function(new_user_data){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(1, function (err, rows) {
      console.log("models/User.writeToSheet() called to update user information sheet");
      for(var i=0; i<rows.length; i ++) {
        rows[i].username = new_user_data[i].name;
        rows[i].gamesplayed = new_user_data[i].gamesPlayed;
        rows[i].wins = new_user_data[i].wins;
        rows[i].losses = new_user_data[i].losses;
        rows[i].paper = new_user_data[i].paper;
        rows[i].rock = new_user_data[i].rock;
        rows[i].scissors = new_user_data[i].scissors;
        rows[i].password = new_user_data[i].password;
        rows[i].first = new_user_data[i].first;
        rows[i].last = new_user_data[i].last;
        rows[i].created = new_user_data[i].created;
        rows[i].lastupdated = new_user_data[i].lastUpdated;
        //console.log("New sheet row: "+JSON.stringify(rows[i]));
        rows[i].save();
      }
    });
  });
}

exports.allUsers= function(callback){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(1, function (err, rows) {
      console.log("models/User.allUsers() called, raw Google Sheets data");
      callback(rows);
    });
  });
}

exports.getAllUsers = function(callback) {
  console.log("models/User.getAllUsers() called, parsed Google Sheets data");
  var user_info = [];
  var user = exports.completelyBlankUser();
  var allUsers = exports.allUsers(function(rows){
    for(var i=0; i<rows.length; i++){
      user={
        name: rows[i].username,
        gamesPlayed: rows[i].gamesplayed,
        wins: rows[i].wins,
        losses: rows[i].losses,
        paper: rows[i].paper,
        rock: rows[i].rock,
        scissors: rows[i].scissors,
        password: rows[i].password,
        first: rows[i].first,
        last: rows[i].last,
        created: rows[i].created,
        lastUpdated: rows[i].lastupdated
      }
      console.log("Parsed row: "+JSON.stringify(user));
      user_info.push(user);
    }
    callback(user_info);
  });
}

exports.createUser = function(user, callback) {
  console.log("models/User.createUser() called");
  var duplicateUser = false;
  exports.getAllUsers(function(user_info){
    for(i=0; i<user_info.length; i++){
      if(user_info[i]["name"]==user.name){
        console.log("Duplicate username found in models/User.createUser(), Google Sheet not updated");
        duplicateUser = true;
        callback(user_info, duplicateUser);
      }//redundancy conditional
    }
    if(!duplicateUser){//username verified as original
      //console.log("MVC Server Input User: "+JSON.stringify(user));
      var new_user = exports.createBlankUser(user);
      console.log("Valid username entered in models/User.createUser(), following object added to Google Sheet: "+JSON.stringify(new_user));
      doc.addRow(1,new_user,function(){
        callback(user_info, duplicateUser);
      });//new user object added to list of users
    }
  });
}

exports.getUserByName = function(user_id, callback) {
  console.log("models/User.getUserByName() called on "+user_id);
  var user = exports.completelyBlankUser();
  var all_users = exports.allUsers(function(rows){
    for(var i=0; i<rows.length; i++){
      if(rows[i].username==user_id){
        user={
          name:rows[i].username,
          gamesPlayed:rows[i].gamesplayed,
          wins: rows[i].wins,
          losses: rows[i].losses,
          paper: rows[i].paper,
          rock: rows[i].rock,
          scissors: rows[i].scissors,
          password: rows[i].password,
          first: rows[i].first,
          last: rows[i].last,
          created: rows[i].created,
          lastUpdated: rows[i].lastupdated
        }
      }
    }
    //should this be replaced with getAllUsers?
    console.log("models/User.getUserByName() query result: "+JSON.stringify(user));
    callback(user);
  });
}

exports.updateUser = function(u, user_name, user_password, user_first, user_last, callback) {
  console.log("models/User.updateUser() called");
  var new_user = u;
  // new_user.name = user_name;
  // new_user.password = user_password;
  // new_user.first = user_first;
  // new_user.last = user_last;
  exports.allUsers(function(rows){
    for(var i=0; i<rows.length; i++){
      if(rows[i].username==user_name){
        console.log("models/User.updateUser() subject found in Google Sheets, information updated");
        rows[i].username = u.name;
        rows[i].password = u.password;
        rows[i].first = u.first;
        rows[i].last = u.last;
        rows[i].lastupdated = exports.getDateString();
        rows[i].save();
      }
    }
    callback(new_user);
  });
  //getUserByName more efficient?
}

exports.deleteUser = function(user_id) {
  console.log("models/User.deleteUser("+user_id+") called");
  var allUsers = exports.allUsers(function(rows){
      for(var i=0; i<rows.length; i++){
        if(rows[i].username == user_id){
          console.log(user_id+" found and deleted");
          rows[i].del();
        }
      }
  });
}

exports.getAllDatabaseRows= function(){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(1, function (err, rows) {
      console.log("models/User.getAllDatabaseRows() called");
      return rows;
    });
  });
}

exports.parseString= function (sheetRow){
  console.log("models/User.parseString() called on "+sheetRow.name);// on: "+sheetRow);
  var output = {};
  output.username = sheetRow.name;
  output.gamesPlayed = sheetRow.gamesplayed;
  output.wins = sheetRow.wins;
  output.losses = sheetRow.losses;
  output.paper = sheetRow.paper;
  output.rock = sheetRow.rock;
  output.scissors = sheetRow.scissors;
  output.password = sheetRow.password;
  output.first = sheetRow.first;
  output.last = sheetRow.last;
  output.created = sheetRow.created;
  output.lastUpdated = sheetRow.lastupdated;
  //console.log("JSON.stringify() called on output object: "+JSON.stringify(output));
  return output;
}
//converts a row object from Google Sheets into a more program-friendly user object

exports.createString= function (userObject){
  console.log("models/User.createString() called on (JSON version of object): "+ JSON.stringify(userObject));
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
  console.log("Output from models/User.createString: "+output);
  return output;
}
//converts a user object back to a string

// exports.createCSVText= function (array){
//   console.log("User.createCSVText() called giving the following output:");
//   var header = exports.usersCSVHeader;//header string for CSV file
//   var output = header;
//   for (var i = 0; i < len(array); i ++) {
//     output = output + "\n" + array[i];
//   }
//   console.log(output);
//   console.log("End of User.createCSVText() output");
//   return output;
// }
// //converts an array of strings into a csv file

 exports.completelyBlankUser= function(){
  console.log("models/User.completelyBlankUser() called");
  return {username:"", gamesPlayed:0, wins:0, losses:0, paper:0, rock:0, scissors:0, password:"", first:"", last:"", created:exports.getDateString(), lastUpdated:exports.getDateString()};//include timing
}
//creates an entirely blank user object

exports.getDateString= function () {
	var now = new Date();
	var output = now.getMonth()+1;//month index offset from 0-11 scale
 	output = output + "/" + now.getDate();
	output = output + "/" + now.getFullYear();
	console.log("Current date accessed from models/User.getDateString(): " + output);
	return output;
}

exports.createBlankUser= function(user){
  console.log("models/User.createBlankUser() called");
  var output = {username:user.name, gamesPlayed:0, wins:0, losses:0, paper:0, rock:0, scissors:0, password:user.password, first:user.first, last:user.last, created:exports.getDateString(), lastUpdated:exports.getDateString()};//include timing
  console.log("models/User.createBlankUser() output: "+JSON.stringify(output));
  return output;
}
//creates a blank user object given an input object
