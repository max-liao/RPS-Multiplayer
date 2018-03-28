// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBIevTR-mQFdjL0Up4vopFmlROoboi0p9I",
    authDomain: "test-4e111.firebaseapp.com",
    databaseURL: "https://test-4e111.firebaseio.com",
    projectId: "test-4e111",
    storageBucket: "test-4e111.appspot.com",
    messagingSenderId: "50749461627"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var currenttime = moment().format("hh:mm:ss");
var firsttrainmoment = moment().format("hh:mm:ss");
var frequency = 10;
var name = "Train";
var nextTrain = "";

// Clear Firebase
$("#cleartable").on("click", function(event) {
    database.ref().set({});
    $("#Table").empty();
});

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
});

database.ref().on("child_added", function(snapshot) {
    console.log("Child added");
    var newname = snapshot.val().name;
    var newdestination = snapshot.val().destination;
    var newfirsttrain = snapshot.val().firsttrain;
    var newfrequency = snapshot.val().frequency;
    var newnexttrain = snapshot.val().nextTrain;
    createRow(newname,newdestination,newfirsttrain,newfrequency,newnexttrain);
});

var createRow = function(newname,newdestination,newfirsttrain,newfrequency,newnexttrain) {
    // Get reference to existing tbody element, create a new table row element
    var tBody = $("tbody");
    var tRow = $("<tr>");

    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var nameTd = $("<td>").text(newname);
    var destinationTd = $("<td>").text(newdestination);
    var firsttrainTd = $("<td>").text(newfirsttrain);
    var frequencyTd = $("<td>").text(newfrequency);
    var nexttrainTd = $("<td>").text(newnexttrain);

    // Append the newly created table data to the table row
    tRow.append(nameTd, destinationTd, firsttrainTd, frequencyTd, nexttrainTd);

    // Append the table row to the table body
    tBody.append(tRow);
  };

// This function handles events where the name button is clicked
$("#submit").on("click", function(event) {
    // event.preventDefault() prevents submit button from trying to send a form.
    // Using a submit button instead of a regular button allows the user to hit
    // "Enter" instead of clicking the button if desired
    event.preventDefault();
    
    if ($("#name-input").val().trim() == ""){
        name = "Train";
    } else {
        name = $("#name-input").val().trim();
    }
    if ($("#destination-input").val().trim() == ""){
        destination = "unknown";
    } else {
        destination = $("#destination-input").val().trim();
    }
    if ($("#frequency-input").val().trim() == ""){
        frequency = 10;
    } else {
        frequency = $("#frequency-input").val().trim();
    }
    if ($("#firsttrain-input").val().trim() == ""){
        firsttrain = "unknown";
        nextTrain = " ";
    } else {
        firsttrain = $("#firsttrain-input").val().trim();
        firsttrainmoment = moment(firsttrain, "hh:mm:ss");
        nextTrain = arrivaltime(firsttrainmoment,frequency);
        console.log(nextTrain[0],nextTrain[1]);
    }

    // Save the new post in Firebase
    database.ref().push({
        name: name,
        destination: destination,
        firsttrain: firsttrain,
        frequency: frequency,
        nextTrain: nextTrain[0]
      });
  
});  

function arrivaltime(firsttrain){
    var diffTime = moment().diff(firsttrain, "seconds");
    // console.log(diffTime);
    var tRemainder = diffTime/60 % frequency;
    // console.log(tRemainder);
    var tSecsTillTrain = (frequency - tRemainder)*60;
    // console.log("Seconds TILL TRAIN: " + tSecsTillTrain);
    var nextTrain = moment().add(tSecsTillTrain, "seconds");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextT = moment(nextTrain).format("hh:mm");
    trivia.time = Math.floor(tSecsTillTrain);
    trivia.start();

    return [nextT, tSecsTillTrain]

    // var diffTime = moment().diff(firsttrain, "minutes");
    // // Minute Until Train
    // var tRemainder = diffTime % frequency;
    // var tMinutesTillTrain = frequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }



var clock;
  
var trivia = {
    name: "Train Clock",
    clockRunning: false,
    time: 0,
    
    test: function(){
        // if (!trivia.clockRunning) {
        //     clock = setInterval(trivia.count(10), 1000);
        //     trivia.clockRunning = true;
        // }
        console.log(trivia.time);
    },

    timeOUT: function(valid){
        console.log("Timeout");
        trivia.stop();
        // trivia.time = 10;
        setTimeout(trivia.start, 3000);
    },

    
    reset: function(){
        trivia.stop();
        trivia.clockRunning = false;
        // trivia.time = 10;
    },

    start: function(){
      if (!trivia.clockRunning) {
        clock = setInterval(trivia.count, 1000);
        trivia.clockRunning = true;
      }
    },

    stop: function() {
        // Use clearInterval to stop the count here and set the clock to not be running.
        clearInterval(clock);
        clearTimeout();
        trivia.clockRunning = false;
    },

    count: function() {
        // decrement time by 1, remember we cant use "this" here.
        console.log(trivia.time);
        trivia.time--;

        // Get the current time, pass that into the timeConverter function and save the result in a variable.
        var converted = trivia.timeConverter(trivia.time);

        // console.log(converted);
        if (converted == "00:00"){
          console.log("TIMEOUT");
          trivia.stop();
        //   trivia.time = time;
          trivia.i++;
          // Use the variable we just created to show the converted time in the "display" div.
        } else {
            console.log(converted);
            $("#arriving").text(converted);
        }
    },

    timeConverter: function(t) {

      var minutes = Math.floor(t / 60);
      // console.log(minutes);
      var seconds = t - (minutes * 60);
      // console.log(seconds);

      if (seconds < 10) {
        seconds = "0" + seconds;
      }
  
      if (minutes === 0) {
        minutes = "00";
      }
      else if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return minutes + ":" + seconds;
    }
}