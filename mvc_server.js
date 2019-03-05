var express = require('express');//downloads express libraries
var fs = require('fs');//downloads fs libraries, shouldn't be necessary in end project
var favicon = require('serve-favicon');//has to do with icon in the corner of a tab
var models_user = require('./models/User.js');//downloads our library of user functions
var models_villain = require('./models/Villain.js');//downloads our library of villain functions

var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('./client_secret.json');
var doc = new GoogleSpreadsheet('1KpbeLRyGYaPEkCsgKP-XcHVsYePuX1Uwxuxtg12lEGk');

var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));
app.use(express.json());
app.use(express.urlencoded());
//setting up express, do not mess with this

app.use(require('./controllers/user'));
//downloads our library of user controllers

var port = 3000;
app.listen(port, function(){
  console.log('Server started at '+ new Date()+', on port ' + port+'!');
});
//starts server

var count = 0;
var username = " ";
var password = " ";
//strategy component for specific villain Gato, leave alone

app.get('/', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index', {message:false, message2:false});
});//just accessing home without error messages

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

app.get('/login', function(request, response){
  var user_data={
      name: request.query.player_name,
      password: request.query.player_password
  };//reads data fields
  if(user_data["name"]==""||user_data["password"]==""){//does not allow either empty username or empty password
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('index', {message:false, message2:true});//links back to same page with error message
  }
  else{
  var newUserInfo = true;
  models_user.getAllUsers(function(user_info){
    console.log("Login username: " + user_data.name);
    console.log("Login password: " + user_data.password);
    console.log("user_info:"+JSON.stringify(user_info));
    for(i=0;i<user_info.length;i++){
      console.log("Going through user_info, username: "+user_info[i]["name"]);
      if(user_info[i]["name"]==user_data["name"]){
        console.log("Username matches");
        if(user_info[i]["password"]==user_data["password"]){
          console.log("Password matches")
          models_villain.getAllVillains(function(villain_info){
            console.log("villain_info:"+JSON.stringify(villain_info));
            console.log("End of login procedure");
            response.status(200);
            response.setHeader('Content-Type', 'text/html');
            response.render('game', {user:user_data,villain:villain_info,message3:false});//begins name with already existent user
          });
        }
        else{
          console.log("Index rendering");
          response.status(200);
          response.setHeader('Content-Type', 'text/html');
          response.render('index', {message:true, message2:false});//links back to index page with wrong password error message
        }
        newUserInfo = false;//in the event of loop breaking error, does not allow new user with incorrect information to be added
      }
    }
  });
  }
});

app.get('/:user/results', function(request, response){
  var user_data={
      name: request.params.user,
      weapon: request.query.weapon,
      villain_choice: request.query.villain_choice
  };//object of relevant user information from parameters
  console.log("Beginning of results request");
    // var users_file=fs.readFileSync('data/users.csv','utf8');//converts users csv to a string
    // var rows = users_file.split('\n');//generates array of stringified user objects
    // var user_info = [];//array which will hold objectified users
    // for(var i=1; i<rows.length-1; i++){//indexing does not include header or whitespace at the end
    //   var user = userArrayToObject(rows[i].split(','));//converts stringified user object to array of stringified values
    //   user_info.push(user);//adds user to list
    // }
    // var villains_file=fs.readFileSync('data/villains.csv','utf8');
    // var villainsRows = villains_file.split('\n');
    // var villain_data = [];
    // for(var i=1; i<villainsRows.length-1; i++){
    //   var villain_d = villainsRows[i].split(',');
    //   var villain = villainArrayToObject(villain_d);
    //   villain_data.push(villain);
    // }//creates array of villains

    models_user.getAllUsers(function(user_info){
      console.log("user_info at start:"+JSON.stringify(user_info));
      models_villain.getAllVillains(function(villain_data){
        console.log("villain_info at start:"+JSON.stringify(villain_data));
        var ai_throw = 0;//variable that serves as placeholder for randomly chosen throws
        var villain_throw = "";

        if (user_data.villain_choice=="Boss"){ villain_throw = "rock"; }//Boss always throws rock because it's a firm choice
        else if (user_data.villain_choice=="Spock"){ villain_throw = "scissors"; }//Spock always throws scissors because it looks cool
        else if (user_data.villain_choice=="Regal"){ villain_throw = "paper"; }//Regal always throws paper because they're writing up deals
        else if (user_data.villain_choice=="Mickey"){ villain_throw = user_data.weapon; }//Mickey always throws the user's weapon because he's a trickster
        else if (user_data.villain_choice=="Magician"){
          if(user_data.weapon=="paper"){ villain_throw = "scissors"; }
          else if(user_data.weapon=="rock"){ villain_throw = "paper"; }
          else if(user_data.weapon=="scissors"){ villain_throw = "rock"; }
          //Magician always wins because he reads minds
        } else if (user_data.villain_choice=="Bones"){
          if(user_data.weapon=="scissors"){ villain_throw = "paper"; }
          else if(user_data.weapon=="paper"){ villain_throw = "rock"; }
          else if(user_data.weapon=="rock"){ villain_throw = "scissors"; }
          //Bones always loses because they're barely a hand, let alone a funcitioning user
        } else if (user_data.villain_choice=="Pixie"){
          ai_throw = Math.floor(Math.random()*3)+1;
          if(ai_throw==1){ villain_throw = "paper"; }
          else if(ai_throw==2){ villain_throw = "rock"; }
          else if(ai_throw==3){ villain_throw = "scissors"; }
          //randomly chooses a throw with 33/33/33 probability because pixelation seems the most computerized (ie random)
        } else if (user_data.villain_choice=="Harry"){
          ai_throw = Math.floor(Math.random()*2)+1;
          if(ai_throw==1){ villain_throw = "paper"; }
          else if(ai_throw==2){ villain_throw = "rock"; }
          //Harry doesn't have scissors because if he did he would have bothered to cut his hair
        } else if (user_data.villain_choice=="Mr"){
          user_data.villain_choice = "Mr Modern";
          ai_throw = Math.floor(Math.random()*2)+1;
          if(ai_throw==1){ villain_throw = "scissors"; }
          else if(ai_throw==2){ villain_throw = "rock"; }
          //Mr Modern is paperless in a modern world
        } else if (user_data.villain_choice=="Manny"){
          ai_throw = Math.floor(Math.random()*2)+1;
          if(ai_throw==1){ villain_throw = "paper"; }
          else if(ai_throw==2){ villain_throw = "scissors"; }
          //Manny doesn't use rocks to keep the prestine nails in one piece
        } else if (user_data.villain_choice=="Comic"){
          user_data.villain_choice="Comic Hans";
          var d = new Date();
          var n = d.toLocaleTimeString();
          ai_throw = parseInt(n.substring(6,8));
          if(ai_throw%3==0){ villain_throw = "paper"; }
          else if(ai_throw%3==1){ villain_throw = "rock"; }
          else if(ai_throw%3==2){ villain_throw = "scissors"; }
          //Seems like a write that would hold a watch well, takes input based on the seconds value of the time of day
        } else if (user_data.villain_choice=="Gato"){
          if(count%15<=5){ ai_throw = 1; }
          else if(count%15<=10&&count%15>5){ ai_throw = 2; }
          else if(count%15<=15&&count%15>10){ ai_throw = 3; }
          count++;//updates Gato's count of when to pounce and change strategies
          if(ai_throw==1){ villain_throw = "paper"; }
          else if(ai_throw==2){ villain_throw = "rock"; }
          else if(ai_throw==3){ villain_throw = "scissors"; }
          //lulls individual user into a false sense of security (note ignores log on and log offs, only restarts when window is reopened)
        }
        var type = "";
        if(user_data.weapon==villain_throw){
          type="tie";
          //user tied their game
        }
        else if((user_data.weapon=="paper"&&villain_throw=="rock")||(user_data.weapon=="scissors"&&villain_throw=="paper")||(user_data.weapon=="rock"&&villain_throw=="scissors")){
          type="win";
          //user won their game
          for(i=0;i<user_info.length;i++){
            if(user_info[i]["name"]==user_data.name){
              user_info[i]["wins"]++;
              }
          }
          //adds a win tally for user
          for(i=0;i<villain_data.length;i++){
            if(villain_data[i]["name"]==user_data.villain_choice){
              villain_data[i]["losses"]++;
            }
          }
          //adds a loss tally for villain
        }
        else if ((user_data.weapon=="rock"&&villain_throw=="paper")||(user_data.weapon=="paper"&&villain_throw=="scissors")||(user_data.weapon=="scissors"&&villain_throw=="rock")){
          type="loss";
          //user lost their game
          for(i=0;i<user_info.length;i++){
            if(user_info[i]["name"]==user_data.name){
              user_info[i]["losses"]++;
            }
          }
          //adds a loss tally for user
          for(i=0;i<villain_data.length;i++){
            if(villain_data[i]["name"]==user_data.villain_choice){
              villain_data[i]["wins"]++;
            }
          }
          //adds a win tally for villain
        }
        if(user_data.weapon!="blank"&&user_data.villain_choice!="blank"){
          for(i=0;i<user_info.length;i++){
            if(user_info[i]["name"]==user_data.name){
              user_info[i]["gamesPlayed"]++;
              user_data.password = user_info[i]["password"];//first time in loop where password can be taken from csv for linking back to page
              if(user_data.weapon=="paper"){ user_info[i]["paper"]++; }
              if(user_data.weapon=="rock"){ user_info[i]["rock"]++; }
              if(user_data.weapon=="scissors"){ user_info[i]["scissors"]++; }
            }
            //updates choice and games played attributes for users
          }
          for(i=0;i<villain_data.length;i++){
            if(villain_data[i]["name"]==user_data.villain_choice){
              villain_data[i]["gamesPlayed"]++;
              if(villain_throw=="paper"){ villain_data[i]["paper"]++; }
              if(villain_throw=="rock"){ villain_data[i]["rock"]++; }
              if(villain_throw=="scissors"){ villain_data[i]["scissors"]++; }
            }
            //updates choice and games played attributes for users
          }
        }
        // var new_user_data = "name,gamesPlayed,wins,losses,paper,rock,scissors,password,first,last,created,lastUpdated\n";
        // for(i=0; i<user_info.length; i++){
        //   new_user_data += user_info[i]["name"] + ",";
        //   new_user_data += user_info[i]["gamesPlayed"] + ",";
        //   new_user_data += user_info[i]["wins"] + ",";
        //   new_user_data += user_info[i]["losses"] + ",";
        //   new_user_data += user_info[i]["paper"] + ",";
        //   new_user_data += user_info[i]["rock"] + ",";
        //   new_user_data += user_info[i]["scissors"] + ",";
        //   new_user_data += user_info[i]["password"] + ",";
        //   new_user_data += user_info[i]["first"] + ",";
        //   new_user_data += user_info[i]["last"] + ",";
        //   new_user_data += user_info[i]["created"] + ",";
        //   new_user_data += user_info[i]["lastUpdated"];
        //   new_user_data += "\n";
        // }
        // fs.writeFileSync('data/users.csv', new_user_data,'utf8');
        console.log("Updated user database:"+JSON.stringify(user_info));
        models_user.writeUsersToSheet(user_info);
        //rewrites new user information to csv file

        // var new_villain_data = "name,gamesPlayed,wins,losses,paper,rock,scissors,strategy\n";
        // for(i=0; i<villain_data.length; i++){
        //   new_villain_data += villain_data[i]["name"] + ",";
        //   new_villain_data += villain_data[i]["gamesPlayed"] + ",";
        //   new_villain_data += villain_data[i]["wins"] + ",";
        //   new_villain_data += villain_data[i]["losses"] + ",";
        //   new_villain_data += villain_data[i]["paper"] + ",";
        //   new_villain_data += villain_data[i]["rock"] + ",";
        //   new_villain_data += villain_data[i]["scissors"] + ",";
        //   new_villain_data += villain_data[i]["strategy"];
        //   new_villain_data += "\n";
        // }
        // fs.writeFileSync('data/villains.csv', new_villain_data,'utf8');
        console.log("Updated villain database:"+JSON.stringify(villain_data));
        models_villain.updateVillain(villain_data);
        //rewrites new villain information to csv file
        response.status(200);
        response.setHeader('Content-Type', 'text/html')
        response.render('results', {user:user_data,user_info:user_info,villain_data:villain_data,villain_throw:villain_throw, type:type});
      });
    });


});


// app.get('/:user/edit', function(request, response){
//   response.status(200);
//   response.setHeader('Content-Type', 'text/html')
//   response.render('user_details', {username:username,password:password});
// });


app.get('/rules', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules');
});//simple linking, no parameters

app.get('/stats', function(request, response){
  // // var users_file=fs.readFileSync('data/users.csv','utf8');
  //  var villains_file=fs.readFileSync('data/villains.csv','utf8');
  // // var rows = users_file.split('\n');
  //  var villainsRows = villains_file.split('\n');
  // // var user_data = [];
  //  var villain_data = [];
  // // for(var i=1; i<rows.length-1; i++){
  // //   var user = models_user.parseString(rows[i]);
  // //   user_data.push(user);//add the user to the array of users
  // //
  // // }
  models_user.getAllUsers(function(user_info){
    console.log("user_info:"+JSON.stringify(user_info));
    var user_data = user_info;
    models_villain.getAllVillains(function(villain_info){
      console.log("villain_info:"+JSON.stringify(villain_info));
      response.status(200);
      response.setHeader('Content-Type', 'text/html')
      response.render('stats', {user:user_data, villain:villain_info});
    });
  });

      // for(var i=1; i<villainsRows.length-1; i++){
      //   var villain_d = villainsRows[i].split(',');
      //   var villain = villainArrayToObject(villain_d);
      //   villain_data.push(villain);//adds the villain to the array of villains
      // }
      // console.log("Read from Google Sheets below: " + JSON.stringify(user_info) );

  // user_info = models_user.allUsers(function(rows){
  //   for(var i=0; i<rows.length; i++){
  //     user={
  //       name:rows[i].name,
  //       gamesPlayed:rows[i].gamesplayed,
  //       wins: rows[i].wins,
  //       losses: rows[i].losses,
  //       paper: rows[i].paper,
  //       rock: rows[i].rock,
  //       scissors: rows[i].scissors,
  //       password: rows[i].password,
  //       first: rows[i].first,
  //       last: rows[i].last,
  //       created: rows[i].created,
  //       lastUpdated: rows[i].lastupdated
  //     }
  //     console.log(rows[i].name);
  //     user_info.push(user);
  //   }
  //   return user_info;
  // });
  // doc.useServiceAccountAuth(creds, function (err) {
  //   console.log("Successful authentication!");
  //   doc.getRows(1, function (err, rows) {
  //     for(var i=0; i<rows.length; i++){
  //       user_info.push(models_user.parseString(rows[i]));
  //     }
  //     console.log("Read from Google Sheets: " + JSON.stringify(user_info));
  //     //callback(rows);
  //   });
  // });

});
app.get('/about', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about');
});//simple linking, no parameters
