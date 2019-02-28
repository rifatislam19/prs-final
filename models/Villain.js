var fs = require("fs");
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./../client_secret.json');

var doc = new GoogleSpreadsheet('1KpbeLRyGYaPEkCsgKP-XcHVsYePuX1Uwxuxtg12lEGk');

exports.villainsCSVHeader = "name,gamesPlayed,wins,losses,paper,rock,scissors\n";

var villainArrayToObject = function (villain_d) {
  var villain = {};//initiates object that will be villain
  villain["name"] = villain_d[0];
  villain["gamesPlayed"] = parseInt(villain_d[1]);
  villain["wins"] = parseInt(villain_d[2]);
  villain["losses"] = parseInt(villain_d[3]);
  villain["paper"] = parseInt(villain_d[4]);
  villain["rock"] = parseInt(villain_d[5]);
  villain["scissors"] = parseInt(villain_d[6]);
  //adds object attributes dependent on index in array
  return villain;//returns object as output
}

exports.allVillains= function(callback){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(2, function (err, rows) {
      callback(rows);
    });
  });
}

exports.getAllVillains = function(callback) {
  console.log("getAllVillains");
  var villain_info = [];
  var villain = exports.completelyBlankVillain();
  var allVillains = exports.allVillains(function(rows){
    for(var i=0; i<rows.length; i++){
      villain={
        name:rows[i].name,
        gamesPlayed:rows[i].gamesplayed,
        wins: rows[i].wins,
        losses: rows[i].losses,
        paper: rows[i].paper,
        rock: rows[i].rock,
        scissors: rows[i].scissors,
        strategy: rows[i].strategy
      }
      villain_info.push(villain);
    }
    callback(villain_info);
  });
}

exports.getVillainByName = function(villain_id, callback) {
  console.log("getVillainByName: "+villain_id);

  var villain = exports.completelyBlankVillain();
  var all_villains = allVillains(function(rows){
    for(var i=0; i<rows.length; i++){
      if(rows[i].name.trim()==villain_id.trim()){
        villain={
          name:rows[i].name,
          gamesPlayed:rows[i].gamesplayed,
          wins: rows[i].wins,
          losses: rows[i].losses,
          paper: rows[i].paper,
          rock: rows[i].rock,
          scissors: rows[i].scissors,
          strategy: rows[i].strategy
        }
      }
    }
    callback(villain);
  });
}
//
// exports.getVillainByName = function(villain_id) {
//   console.log("Villain.getVillain("+villain_id+") called");
//
//   var villain = completelyBlankVillain();
//   var all_villains = fs.readFileSync(__dirname +'/../data/villains.csv', 'utf8').split("\n");//getRows();
//   var villainMissing = true;
//   for(var i=1; i<all_villains.length; i++){
//     var u = exports.parseString(all_villains[i]);
//     if(u.name==villain_id){
//       villainMissing = false;
//       villain=u;
//     }
//   }
//   if (villainMissing) console.log("Error: "+villain_id+" not found in villains.csv while running Villain.getVillain()");
//   console.log(villain);
//   return villain;
// }
//retrieves villain by name

// exports.getVillains=function(callback) {
//
//   getAllDatabaseRows(function(villains){
//     callback(villains);
//   });
// }

// exports.updateVillain = function(villain_id, key, value) {
//   console.log("Villain.updateVillain("+villain_id+","+key+","+value+") called, which will set "+villain_id+"."+key+" to "+value);
//   var villainObj = getVillain(villain_id);
//   console.log("Old value: "+villainObj.key);
//   villainObj.key = value;
//   console.log("New value: "+villainObj.key);
//   var newString = createString(villainObj);//will replace current string
//   var newRows = getRows();
//   var villainMissing = true;
//   var index = 0;
//   for (var i = 1; i < len(newRows); i++) {
//     var u = parseString(all_villains[i]);
//     if(u.name==villain_id){
//       villainMissing = false;
//       index = i;
//     }
//   }
//   if (villainMissing) console.log("Error: "+villain_id+" not found in villains.csv while running Villain.updateVillain");
//   newRows[i]=newString;//replaces string
//   var newCSV = createCSVText(newRows);
//   fs.writeFileSync(__dirname +'/../data/villains.csv', 'utf8', newCSV);
//
// exports.updateVillain = function(u, villain_name, villain_password, villain_first, villain_last) {
//   u.name = villain_name;
//   u.password = villain_password;
//   u.first = villain_first;
//   u.last = villain_last;
//   return u;
// }

exports.deleteVillain = function(villain_id) {
  console.log("Villain.deleteVillain("+villain_id+") called");

  var villains_file=fs.readFileSync('data/villains.csv','utf8');//converts villains csv to a string
  var rows = villains_file.split('\n');//generates array of stringified villain objects
  var villain_info = [];//array which will hold objectified villains
  for(var i=1; i<rows.length-1; i++){//indexing does not include header or whitespace at the end
    var villain = villainArrayToObject(rows[i].split(','));//converts stringified villain object to array of stringified values
    villain_info.push(villain);//adds villain to list
  }

  var new_villain_data = exports.villainsCSVHeader;
  for(i=0; i<villain_info.length; i++){
    if(villain_info[i]["name"]!=villain_id){
      new_villain_data += villain_info[i]["name"] + ",";
      new_villain_data += villain_info[i]["gamesPlayed"] + ",";
      new_villain_data += villain_info[i]["wins"] + ",";
      new_villain_data += villain_info[i]["losses"] + ",";
      new_villain_data += villain_info[i]["paper"] + ",";
      new_villain_data += villain_info[i]["rock"] + ",";
      new_villain_data += villain_info[i]["scissors"] + ",";
      new_villain_data += "\n";
    }
  }
  fs.writeFileSync('data/villains.csv', new_villain_data,'utf8');
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
  console.log("Villain.parseString() called on: "+str);
  var arr = str.split(',');
  var output = {};
  output.name = arr[0];
  output.gamesPlayed = arr[1];
  output.wins = arr[2];
  output.losses = arr[3];
  output.paper = arr[4];
  output.rock = arr[5];
  output.scissors = arr[6];
  console.log("JSON.stringify() called on output object: "+JSON.stringify(output));
  return output;
}
//converts a string row from villains.csv into a villain object

exports.createString= function (villainObject){
  console.log("Villain.createString() called on (JSON version of object): "+ JSON.stringify(villainObject));
  var output = villainObject["name"] + ",";
  output += villainObject["gamesPlayed"] + ",";
  output += villainObject["wins"] + ",";
  output += villainObject["losses"] + ",";
  output += villainObject["paper"] + ",";
  output += villainObject["rock"] + ",";
  output += villainObject["scissors"] + ",";
  output += "\n";
  console.log("Outputted string: "+output);
  return output;
}
//converts a villain object back to a string

exports.createCSVText= function (array){
  console.log("Villain.createCSVText() called giving the following output:");
  var header = exports.villainsCSVHeader;//header string for CSV file
  var output = header;
  for (var i = 0; i < len(array); i ++) {
    output = output + "\n" + array[i];
  }
  console.log(output);
  console.log("End of Villain.createCSVText() output");
  return output;
}
//converts an array of strings into a csv file

exports.completelyBlankVillain= function(){
  console.log("Villain.completelyBlankVillain() called");
  return {name:"", gamesPlayed:0, wins:0, losses:0, paper:0, rock:0, scissors:0};//include timing
}
//creates a blank villain object given an input object

exports.getDateString= function () {
	var now = new Date();
	var output = now.getMonth()+1;//month index offset from 0-11 scale
 	output = output + "/" + now.getDate();
	output = output + "/" + now.getFullYear();
	console.log("Current date logged: " + output);
	return output;
}

exports.createBlankVillain= function(villain){
  console.log("Villain.createBlankVillain() called");
  var output = {name:villain.name, gamesPlayed:0, wins:0, losses:0, paper:0, rock:0, scissors:0};//include timing
  console.log(JSON.stringify(output));
  return output;
}
//creates a blank villain object given an input object
