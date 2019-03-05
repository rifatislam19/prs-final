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

exports.updateVillain= function(new_villain_data){
  doc.useServiceAccountAuth(creds, function (err) {
    doc.getRows(2, function (err, rows) {
      console.log("Villain.writeToSheet called to update villains");

      for(var i=0; i<rows.length; i ++) {
        rows[i].villainname = new_villain_data[i].name;
        rows[i].gamesplayed = new_villain_data[i].gamesPlayed;
        rows[i].name = new_villain_data[i].wins;
        rows[i].losses = new_villain_data[i].losses;
        rows[i].paper = new_villain_data[i].paper;
        rows[i].rock = new_villain_data[i].rock;
        rows[i].scissors = new_villain_data[i].scissors;
        rows[i].strategy = new_villain_data[i].strategy;
        rows[i].save();
      }

    });
  });
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
        name:rows[i].villainname,
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
      if(rows[i].villainname.trim()==villain_id.trim()){
        villain={
          name:rows[i].villainname,
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
