var fs = require("fs");
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');

var doc = new GoogleSpreadsheet('1KpbeLRyGYaPEkCsgKP-XcHVsYePuX1Uwxuxtg12lEGk');

exports.getUser = function(user_id) {
  console.log("User.getUser("+user_id+") called");

  var user = createBlankUser();
  var all_users = getRows();
  var userMissing = true;
  for(var i=1; i<all_users.length; i++){
    var u = parseString(all_users[i]);
    if(u.name==user_id){
      userMissing = false;
      user=u;
    }
  }
  if (userMissing) console.log("Error: "+user_id+" not found in users.csv while running User.getUser()");
  console.log("JSON.stringify called on output object: "+JSON.stringify(user));
  return user;
}
//retrieves user by name

exports.updateUser = function(user_id, key, value) {
  console.log("User.updateUser("+user_id+","+key+","+value+") called, which will set "+user_id+"."+key+" to "+value);
  var userObj = getUser(user_id);
  console.log("Old value: "+userObj.key);
  userObj.key = value;
  console.log("New value: "+userObj.key);
  var newString = createString(userObj);//will replace current string
  var newRows = getRows();
  var userMissing = true;
  var index = 0;
  for (var i = 1; i < len(newRows); i++) {
    var u = parseString(all_users[i]);
    if(u.name==user_id){
      userMissing = false;
      index = i;
    }
  }
  if (userMissing) console.log("Error: "+user_id+" not found in users.csv while running User.updateUser");
  newRows[i]=newString;//replaces string
  var newCSV = createCSVText(newRows);
  fs.writeFileSync(__dirname +'/../data/users.csv', 'utf8', newCSV);
}

var getAllDatabaseRows= function(callback){
  // Authenticate with the Google Spreadsheets API.
  doc.useServiceAccountAuth(creds, function (err) {
    // Get all of the rows from the spreadsheet.
    doc.getRows(1, function (err, rows) {
      console.log(rows);
    });
  });
}

var parseString= function (str){
  console.log("User.parseString() called on: "+str);
  var arr = str.split(',');
  var output = {name:arr[0], games_played:arr[1], lost:arr[2], won:arr[3], password:arr[4]};
  console.log("JSON.stringify() called on output object: "+JSON.stringify(output));
  return output;
}
//converts a string row from users.csv into a user object

var createString= function (userObject){
  console.log("User.createString() called on (JSON version of object): "+ JSON.strinigy(userObject));
  var output = userObject.name+","+userObject.games_played+","+userObject.lost+","+userObject.won+","+userObject.password;
  console.log("Outputted string: "+output);
  return output;
}
//converts a user object back to a string

var createCSVText= function (array){
  console.log("User.createCSVText() called giving the following output:");
  var header = "name,gamesPlayed,wins,losses,paper,rock,scissors,password";//header string for CSV file
  var output = header;
  for (var i = 0; i < len(array); i ++) {
    output = output + "\n" + array[i];
  }
  console.log(output);
  console.log("End of User.createCSVText() output");
  return output;
}
//converts an array of strings into a csv file

var createBlankUser= function(){
  console.log("User.createBlankUser() called");
  return {name:"", games_played:0, lost:0, won:0, password:""};
}
//creates a blank user object
