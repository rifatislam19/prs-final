var fs = require("fs");

exports.getUser = function(user_id) {
  console.log("User.getUser("+user_id+") called");

  var user = createBlankUser();
  var all_users = getRows();

  for(var i=1; i<all_users.length; i++){
    var u = parseString(all_users[i]);
    if(u.name==user_id){
      user=u;
    }
  }
  console.log("JSON.stringify called on output object: "+JSON.stringify(user));
  return user;
}

exports.updateUser = function(user_id, new_info) {
  console.log("Users.updateUser()");
  var user={
    name:"test"
  };

  return user;
}

var getRows= function(){
  console.log("User.getRows() called");
  return fs.readFileSync(__dirname +'/../data/users.csv', 'utf8').split('\n');
}
//reads the users.csv and converts it into an array

var parseString= function (str){
  console.log("User.parseString() called on: "+str);
  var arr = str.split(',');
  var output = {name:arr[0], games_played:arr[1], lost:arr[2], won:arr[3], password:arr[4]};
  console.log("JSON.stringify() called on output object: "+JSON.stringify(output));
  return output;
}

var createBlankUser= function(){
  console.log("User.createBlankUser() called");
  return {name:"", games_played:0, lost:0, won:0, password:""};
}
//creates a blank user object
