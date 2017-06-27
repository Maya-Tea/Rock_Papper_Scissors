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
var playersRef = firebase.database().ref("players");

var name1Ref= database.ref('players/player1/player1Data/name');
var name2Ref= database.ref('players/player2/player2Data/name');

var player1Ref= database.ref('players/player1');
var player2Ref= database.ref('players/player2');

var choice1Ref= database.ref('players/player1/player1Data/choice');
var choice2Ref= database.ref('players/player2/player2Data/choice');

// var win1Ref= database.ref('players/player1/player1Data/wins');
// var wins2Ref= database.ref('players/player2/player2Data/wins');

// var loss1Ref= database.ref('players/player1/player1Data/losses');
// var loss2Ref= database.ref('players/player2/player2Data/losses');

var numWins=0;
var numLosses=0;
var player1Chose=false;
var player2Chose=false;
var choice1;
var choice2;
var wonMessage;

var player1Data={};
var player2Data={};

var player1Snap={};
var player2Snap={};

var identity="viewer";
go(identity);

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

 connectedRef.on("value", function(snap) {
    if (snap.val()) {
     
      var con = connectionsRef.push(true);
      
      con.onDisconnect().remove();
           
    };
  });

playersRef.on("value", function(snapshot){

    var booleanPlayer1 = snapshot.child("player1").exists(); // true
    var booleanPlayer2 = snapshot.child("player2").exists(); // true
    
    if(!booleanPlayer1&&identity!=="viewer"){
      $("#player1Name").html("Waiting for Player 1");
    }
    if(!booleanPlayer2&&identity!=="viewer"){
      $("#player2Name").html("Waiting for Player 2");
    }

    
    if(!booleanPlayer1&&identity=="viewer"){
        $("#nameInputDiv1").css('display','block');
        $("#player1Name").html("Player 1 Sign-Up");
    }
     if(!booleanPlayer2&&identity=="viewer"){
        $("#nameInputDiv2").css('display','block');
        $("#player2Name").html("Player 2 Sign-Up");
    }

    if(booleanPlayer1){
      $("#nameInputDiv1").css('display','none');
    }
    if(booleanPlayer2){
      $("#nameInputDiv2").css('display','none');
    }
    if(booleanPlayer1&&booleanPlayer2&&identity=="player1"){
      addGameStuff(1);
    }
    
    if(identity=="player1"){
      $("#nameInputDiv2").css('display','none');
    }
    if(identity=="player2"){
      $("#nameInputDiv1").css('display','none');
    }
 
  });



function go(P_id){

  var connectedRef = database.ref(".info/connected");

  var player1Ref= database.ref('players/player1');
  var player2Ref= database.ref('players/player2');

  connectedRef.on("value", function(snap) {
    if (snap.val()) {
     
      if(P_id=="player1"){
        player1Ref.onDisconnect().remove();

      }

      if(P_id=="player2"){
        player2Ref.onDisconnect().remove();
      }
           
      
    };
  });
}

connectionsRef.on("value", function(snap) {
   $("#numViewers").html(snap.numChildren());
});


$("#addNameButton1").on('click', function(event){
	event.preventDefault();
  identity="player1";
  go(identity);
 
  $("#identity").html("You Are "+identity);
  player1Data.name = $('#name-input').val().trim();
  player1Data.wins = 0;
  player1Data.losses = 0;
  $("#nameInputDiv1").css('display','none');
  database.ref("players/player1").set({
    player1Data
  });
});

$("#addNameButton2").on('click', function(event){
  event.preventDefault();
  identity="player2";
  go(identity);
  
  $("#identity").html("You Are "+identity);
  player2Data.name = $('#name-input2').val().trim();
  player2Data.wins = 0;
  player2Data.losses = 0;
  $("#nameInputDiv2").css('display','none');  
  //addGameStuff(2);
  database.ref("players/player2").set({
    player2Data
  });
});

function addGameStuff(num){
  console.log("hi");
  var newDiv=$('<div class="col-md-2"> id="choicesDiv"')
  

  var rock= $('<p class="choice" id="rock">');
  rock.text("rock");
  var paper= $('<p class="choice" id="paper"+num>');
  paper.text("paper");
  var scissors= $('<p class="choice" id="scissors"+num>');
  scissors.text("scissors");
  newDiv.append(rock, paper, scissors);
  $("#choices"+num).append(newDiv);
}
function player1Choice(){
  choice1=$(this).text();
  $("#choices1").css('display','none');
  $("#choseAlert1").html("YOU CHOSE "+choice1)
  player1Data.choice = choice1;
  database.ref("players/player1").set({
    player1Data
  });
  
}
function player2Choice(){
  choice2=$(this).text();
  choice1=player1Data.choice;

  $("#choices2").css('display','none');
  $("#choseAlert2").html("YOU CHOSE "+choice2)
  player2Data.choice = choice2;
  database.ref("players/player2").set({
    player2Data
  });
  player2Chose=true;
  var wonMessage=$("<p class='win_message'>");
  $("#fightArea").append(choice1+" vs "+choice2);
  if((choice1=="scissors"&&choice2=="paper")||(choice1=="paper"&&choice2=="rock")||(choice1=="rock"&&choice2=="scissors")){

    wonMessage="player 1 Won";
    player1Data.wins++;
    player2Data.losses++;
                
  }

  else if (choice1==choice2){
    wonMessage="Tie";
  }

  else{
    wonMessage="player 2 Won";
    player2Data.wins++;
    player1Data.losses++;
  }

  $("#fightArea").append(wonMessage);
  console.log(player1Data);
  console.log(player2Data);



  updateFireBase();

 

}
function updateFireBase(){
  
  database.ref("players/player1").set({
    player1Data
  });

  database.ref("players/player2").set({
    player2Data
  });
}



$("#choices1").on("click", ".choice", player1Choice);

$("#choices2").on("click", ".choice", player2Choice);



player2Ref.on("value", function(snapshot) {
  player2Data=snapshot.val().player2Data;
  console.log(player2Data);
  console.log(player2Data.choice);
 
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

player1Ref.on("value", function(snapshot) {
  player1Data=snapshot.val().player1Data;
  console.log(player1Data);
  console.log(player1Data.choice);

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});








name1Ref.on("value", function(snapshot) {
  $("#player1Name").html(snapshot.val());

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

name2Ref.on("value", function(snapshot) {
  $("#player2Name").html(snapshot.val());

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


choice1Ref.on("value", function(snapshot) {
  if(identity=="player2"){
  addGameStuff(2)
  }

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//function war(){

//choice2Ref.on("value", function(snapshot) {
  // choice1=player1Snap.choice;
  //choice2=player2Snap.choice;

  
  //updateFirebase();
  

//});

