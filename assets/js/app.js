 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyB44Xy48CI6ZFHvNFw-H06IM8S3KQxK5cc",
  authDomain: "awesome-f5c50.firebaseapp.com",
  databaseURL: "https://awesome-f5c50.firebaseio.com",
  projectId: "awesome-f5c50",
  storageBucket: "awesome-f5c50.appspot.com",
  messagingSenderId: "804765112886"
};

firebase.initializeApp(config);

var database = firebase.database();
var ref = firebase.database().ref();
var name1Ref= database.ref('/player1');
var name2Ref= database.ref('/player2');
var identityRef;

var player1Data={};
var player2Data={};
var identity="bleh";
go(identity);
//identity="player1";

ref.on("value", function(snapshot){
 // .then(function(snapshot) {
    //var a = snapshot.exists();  // true
    var booleanPlayer1 = snapshot.child("player1").exists(); // true
    var booleanPlayer2 = snapshot.child("player2").exists(); // true
    
    if(booleanPlayer1&&booleanPlayer2){
      console.log("player1 & 2 exists");
      $("#nameInputDiv1").remove();
      $("#nameInputDiv2").remove();
    }
    else if(booleanPlayer1){
      console.log("player1 exists");
      $("#nameInputDiv1").remove();
    }
    
    else if(booleanPlayer2){
      console.log("player2 exists");
      $("#nameInputDiv2").remove();
    }
    else{
      console.log("player 1 and player 2 does not exist");
    }
 
  });

// ref.child("users").orderByChild("ID").equalTo("U1EL5623").once("value", function(snapshot) {
//     var userData = snapshot.val();
//     if (userData){
//       console.log("exists!");
//     }
// });


var connectionsRef = database.ref("/connections");

var connectedRef = database.ref(".info/connected");

function go(P_id){

  var connectionsRef = database.ref("/connections");

  var connectedRef = database.ref(".info/connected");

  var name1Ref= database.ref('/player1');

  connectedRef.on("value", function(snap) {
    // If they are connected..
    if (snap.val()) {
      // Add user to the connections list.
      var con = connectionsRef.push(true);
      
      // Remove user from the connection list when they disconnect.
      //con.onDisconnect().remove(name1Ref);
      con.onDisconnect().remove();
      if(P_id=="player1"){
        name1Ref.onDisconnect().remove();
      }
           
      
    };
  });
}
// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {
   $("#numViewers").html(snap.numChildren());
});


$("#addNameButton1").on('click', function(event){
	event.preventDefault();
  identity="player1";
  go(identity);
  //identityRef=database.ref('/player1');
  $("#identity").html("You Are "+identity);
  player1Data.name = $('#name-input').val().trim();
  $("#nameInputDiv1").remove();
  addGameStuff(1);
  
  database.ref("/player1").set({
    name1: player1Data.name
  });
});

$("#addNameButton2").on('click', function(event){
  event.preventDefault();
  identity="player2";
  identityRef=database.ref('/player1');
  $("#identity").html("You Are "+identity);
  player2Data.name = $('#name-input2').val().trim();
  $("#nameInputDiv2").remove();
  addGameStuff("1");
  database.ref("/player2").set({
    name2: player2Data.name
  });
});

function addGameStuff(num){
  console.log("hi");
  var newDiv=$('<div class="col-md-2">')
  

  var rock= $('<p class="choice" id="rock">');
  rock.text("Rock");
  var paper= $('<p class="choice" id="paper"+num>');
  paper.text("paper");
  var scissors= $('<p class="choice" id="scissors"+num>');
  scissors.text("scissors");
  newDiv.append(rock, paper, scissors);
  $("#choices"+num).append(newDiv);
  //$("#choices"+num).append($(rock));
  //$("#choices"+num).append("paper");
  //$("#choices"+num).append("scissors");

}


    //    database.ref("/bidderData").set({
    //   highBidder: bidderName,
    //   highPrice: bidderPrice
    // });




name1Ref.on("value", function(snapshot) {
  console.log(snapshot.val());
  // $("#nameInputDiv1").remove();
  $("#player1Name").html(" - " +snapshot.val().name1);

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

name2Ref.on("value", function(snapshot) {
  console.log(snapshot.val());
  // $("#nameInputDiv1").remove();
  $("#player2Name").html(" - " +snapshot.val().name2);

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


// database.ref().on("child_added",function(snapshot){ 
//   var a=snapshot.val();

//   console.log(snapshot.val().name1);
//   var newDiv=$('<div class="col-md-2">');
//     $("#player1Name").html("boy");



//     }, 
//     function(errorObject) {          
//        console.log("Errors handled: " + errorObject.code);
//     });

