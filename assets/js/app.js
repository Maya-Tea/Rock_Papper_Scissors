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
var newDiv;
var username;
var numGame=0;
var database = firebase.database();
var playersRef = firebase.database().ref("players");

var name1Ref= database.ref('players/player1/player1Data/name');
var name2Ref= database.ref('players/player2/player2Data/name');

var player1Ref= database.ref('players/player1');
var player2Ref= database.ref('players/player2');

var choice1Ref= database.ref('players/player1/player1Data/choice');
var choice2Ref= database.ref('players/player2/player2Data/choice');
var win1Ref= database.ref('players/player1/player1Data/wins');
var win2Ref= database.ref('players/player2/player2Data/wins');
var loss1Ref= database.ref('players/player1/player1Data/losses');
var loss2Ref= database.ref('players/player2/player2Data/losses');



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
  player1Data.name = $('#name-input1').val().trim();
  username=player1Data.name;
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

  username=player2Data.name;
  player2Data.wins = 0;
  player2Data.losses = 0;
  $("#nameInputDiv2").css('display','none');  
 
  database.ref("players/player2").set({
    player2Data
  });
});
// var entry=0;
// $("#chatButton").on('click', function(event){
//     event.preventDefault();
//     entry++;

//     //varprop=username+entry;
//   database.ref("chatlog").push({
//     username
//   });
// });

function addGameStuff(num){
  $("#choices"+num).css("display","block");
}

function player1Choice(){
  var choiceOne=$(this).text();
 //$("#choices1").css('display','none');
 $("#choices1").empty();
  $("#choseAlert1").html(choiceOne);
  player1Data.choice = choiceOne;
  database.ref("players/player1").set({
    player1Data
  });
}

function player2Choice(){
  var choice=$(this).text();
  // choice1=player1Data.choice;

  $("#choices2").empty();
  $("#choseAlert2").html(choice);
  player2Data.choice = choice;
  database.ref("players/player2").set({
     player2Data
   });
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
  if(identity==="player1"){
    $("#player1Name").html(player1Data.name+"-Make a Choice");
  }
  if(identity==="player2"){
    $("#player1Name").html(player1Data.name+"-Chosing Now");
  }

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

win1Ref.on("value", function(snap){
    if(parseInt(snap.val())>=0){
      console.log(snap.val());
      $("#wins1").html("Wins: "+snap.val());
    }
});

loss1Ref.on("value", function(snap){
    if(parseInt(snap.val())>=0){
      console.log(snap.val());
      $("#losses1").html("Losses: "+snap.val());
    }
});

win2Ref.on("value", function(snap){
    if(parseInt(snap.val())>=0){
      console.log(snap.val());
      $("#wins2").html("Wins: "+snap.val());
    }
});

loss2Ref.on("value", function(snap){
    if(parseInt(snap.val())>=0){
      console.log(snap.val());
      $("#losses2").html("Losses: "+snap.val());
    }
});



choice1Ref.on("value", function(snapshot) {
 
  if(identity=="player2"&&snapshot.val()){
      if(numGame===0){
      addGameStuff(2)
      $("#player2Name").html(player2Data.name+"-Make a Choice");
    }
    else{
      $("#choices2").append(newDiv);
       $("#player1Name").html(player1Data.name);
       $("#player2Name").html(player2Data.name+"-Make a Choice");
    }
  
  }
  
    $("#player1Name").html(player1Data.name);
  
  if(identity==="player1"||identity==="viewer"){
    $("#player2Name").html(player2Data.name+"-Chosing Now");
  }

}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});


choice2Ref.on("value", function(snapshot) {
  
  var choice1=player1Data.choice;
  var choice2=snapshot.val();
  $("#choseAlert1").html(choice1);
  $("#choseAlert2").html(choice2);
  $("#player2Name").html(player2Data.name);
  console.log(choice1);
  console.log(choice2);
  console.log("hello NUrse");
  if(choice1&&choice2){  

  if((choice1=="scissors"&&choice2=="paper")||(choice1=="paper"&&choice2=="rock")||(choice1=="rock"&&choice2=="scissors")){

    wonMessage="Player 1 Won";
    player1Data.wins++;
    player2Data.losses++;
                
  }

  else if (choice1==choice2){
    wonMessage="Tie";
  }

  else{
    wonMessage="Player 2 Won";
    player2Data.wins++;
    player1Data.losses++;
  }
  player2Data.choice=choice2;
  $("#wonMessage").html(wonMessage);
  
  updateFireBase();
  setTimeout(reset, 4000);
}

function reset(){
  numGame++;
  $("#wonMessage").html("");
  console.log("hellllllooooo");
  delete player1Data.choice;
  delete player2Data.choice;
  $("#choseAlert1").html("");
  updateFireBase();

  newDiv=$('<div id="choicesDiv">');
  var rock= $('<p class="choice">');
  rock.text("rock");
  var paper= $('<p class="choice">');
  paper.text("paper");
  var scissors= $('<p class="choice">');
  scissors.text("scissors");
  newDiv.append(rock, paper, scissors);

  $("#choicesDiv").css("text-align", "center");
 

  if(identity==="player1"){
   $("#choices1").append(newDiv);
      $("#player1Name").html(player1Data.name+"-Make A choice");
      
     
      // $( ".choice" ).hover(
      //   function() {
      //     $(".choice").css("border", "2px solid yellow")
      //   }, function() {
      //     $(".choice").css("border", "none")
      //   }
      // );
  }
  if(identity==="player2"||identity==="viewer"){
    $("#player1Name").html(player1Data.name+"-Chosing Now");
  }

  //$("#choices1").append(newDiv);
}


  

});

