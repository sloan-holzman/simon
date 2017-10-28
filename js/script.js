$(document).ready(function() {
  //collecting elements
  let levelDisplay = $("#level");
  let lights = $(".lights");
  let firstLight = $("#light1");
  let secondLight = $("#light2");
  let thirdLight = $("#light3");
  let fourthLight = $("#light4");
  let startButton = $("#start");
  let slider = $("#myRange");
  let sliderDisplay = $("#sliderValue");
  let scoreDisplay = $("#scoreDisplay");
  let highestScore = $("#highScore");
  let nameSubmit = $(".submit");
  //declaring key variables and setting initial values
  //this will go up each round
  let level = 1;
  //this is where the computer generated answer will live (i.e. the correct pattern of lights)
  let sequence = [];
  //this is where the player's answer will live
  let userAnswer = [];
  //the user won't be able to enter an answer until this variable is true.  it will flip back and forth each level
  let userTurn = false;
  //used for a loop later
  let loopIndex = 0;
  //how many seconds a user has to answer, if the timer is on
  let defaultTimeLeft = 10;
  //intially set to the default value, but decreases every second
  let timeLeft = defaultTimeLeft;
  //a variable used in the function to create the timer
  let timer;
  //a variable that will be replaced by user input if they get a high enough score
  let name = "";
  //the score will increase each level, depending on the speed, reverse, time element
  let score = 0;
  //just declaring the variable.  if reverse is on, it will become 1.5x.  that's how much the points will be boosted by
  let reverseBonus = 1;
  //see last answer, but if the timer is on
  let timerBonus = 1;
  //each level, they start with zero points and it will go up if they get the answer correct and then it will be added to the overall score
  let points = 0;
  // let introSequence = [1, 2, 4, 3];

  //each light corresponds to a value, which will be pushed into the sequence and useAnswer arrays
  let codes = {
    light1: 1,
    light2: 2,
    light3: 3,
    light4: 4
  };
  // let speeds = {
  //   1: 1000,
  //   2: 900,
  //   3: 800,
  //   4: 700,
  //   5: 600,
  //   6: 500,
  //   7: 400,
  //   8: 300,
  //   9: 200
  // };
  //
  // //clean this up later to combine speeds and points into one object/array structure
  // let basePoints = {
  //   1: 1,
  //   2: 2,
  //   3: 3,
  //   4: 4,
  //   5: 5,
  //   6: 6,
  //   7: 7,
  //   8: 8,
  //   9: 9
  // };

  //the milliseconds and points associated with each speed level (1-9), which is the user sets with the slider
  const speedValues = {
    "1": {
      milliseconds: 1000,
      points: 1
    },
    "2": {
      milliseconds: 900,
      points: 2
    },
    "3": {
      milliseconds: 800,
      points: 3
    },
    "4": {
      milliseconds: 700,
      points: 4
    },
    "5": {
      milliseconds: 600,
      points: 5
    },
    "6": {
      milliseconds: 500,
      points: 6
    },
    "7": {
      milliseconds: 400,
      points: 7
    },
    "8": {
      milliseconds: 300,
      points: 8
    },
    "9": {
      milliseconds: 200,
      points: 9
    }
  };

  //the default speed is set to 5
  let defaultSpeed = 5;
  //and the initial speed is set to the default speed
  let speed = defaultSpeed;
  // let delay = speeds[`${speed}`];
  //the delay is a function of which speed is chosen
  let delay = speedValues[`${speed}`].milliseconds;
  //the slider initially displays 5
  slider.val(`${speed}`);
  sliderDisplay.text(`Speed: ${speed}`);
  //the high score table is hidden to start.  it will show up when the game is over
  $(".highScoreTable").hide();

  //creates the sequence of lights that the player has to match
  function createSequence(level) {
    //for level 1, the sequence is two lights at random
    if (level === 1) {
      for (let i = 0; i < 2; i++) {
        let randomLight = Math.round(Math.random() * 3) + 1;
        sequence.push(randomLight);
      }
      //if it's not level one, start with the old sequence and add one
    } else {
      let randomLight = Math.round(Math.random() * 3) + 1;
      sequence.push(randomLight);
    }
  }

  function loopSequence(sequence) {
    //after the delay...
    setTimeout(function() {
      // flash the a light in the sequence
      checkLight(sequence[loopIndex]);
      // if it's the end of the array has been reached, stop the function...
      if (++loopIndex >= sequence.length) {
        //make it the user's turn
        userTurn = true;
        //and turn on the timer program, which will run every 1000 milliseconds
        timer = setInterval(function() {
          responseTimer();
        }, 1000);
        return;
      }
      //...if not, run through the function again
      loopSequence(sequence);
    }, delay);
  }

  //checkLight reads a number and runs flashLight for the corresponding div
  function checkLight(light) {
    switch (light) {
      case 1:
        flashLight(firstLight);
        break;
      case 2:
        flashLight(secondLight);
        break;
      case 3:
        flashLight(thirdLight);
        break;
      case 4:
        flashLight(fourthLight);
        break;
    }
  }

  //flashes the light (turns the opacity up to 1 for half the delay)
  function flashLight(light) {
    light.css("opacity", 1);
    setTimeout(function() {
      light.css("opacity", 0.2);
    }, delay / 2);
  }

  //runs through the user's sequence and checks against the computer's sequence to see if they're the same
  function checkAnswer(answer, userInput) {
    for (let i = 0; i < answer.length; i++) {
      //checks if reverse order if set to reverse
      if ($("#reverseSwitch").is(":checked")) {
        var userInputIndex = userInput.length - i - 1;
        //runs in regular order if not set to reverse
      } else {
        var userInputIndex = i;
      }
      //if answer is wrong, changes title to wrong answer, and runs checkHighScore (i.e. check if the user's score qualifies for high score)
      if (answer[i] !== userInput[userInputIndex]) {
        $("#titleText")
          .text("GAME OVER!")
          .css("color", "#b20000");
        checkHighScore();
        return;
      }
    }
    //if none of the answers are wrong, run increase level
    increaseLevel();
  }

  //checks if the score is high enough to qualify for top 10
  function checkHighScore() {
    //if there's already a list of high scores in store, pull it into the variable highScores
    if (localStorage.highScores) {
      var highScores = JSON.parse(localStorage.highScores);
    } else {
      //if not, create an empty array
      var highScores = [];
    }
    //if there are less than 10 high scores, the score automatically qualifies
    if (highScores.length < 10) {
      inputName();
      //if there are more than 10, it has to be higher than the 10th highest score
    } else if (score > highScores[9].score) {
      inputName();
      //if not higher than 10th highest, just restart the game
    } else {
      restartGame();
    }
  }

  //pops up the form for the user to enter their name (to be recorded in high scores)
  function inputName() {
    $("#myModal").css("display", "block");
  }

  //after the user enters his/her name, hide the form and run addHighScore
  nameSubmit.click(function(e) {
    e.preventDefault();
    name = $("input").val();
    $("#myModal").css("display", "none");
    addHighScore();
  });

  //will need to refactor this...it's too long!
  //create a new high score, add it to the list, and re-order the list, then restart the game
  function addHighScore() {
    if (localStorage.highScores) {
      var highScores = JSON.parse(localStorage.highScores);
    } else {
      var highScores = [];
    }
    if (highScores.length < 10) {
      let newScore = new HighScore();
      highScores.push(newScore);
      highScores.sort(function(a, b) {
        return b.score - a.score;
      });
      localStorage.highScores = JSON.stringify(highScores);
      restartGame();
    } else if (score > highScores[9].score) {
      let newScore = new HighScore();
      highScores.pop();
      highScores.push(newScore);
      highScores.sort(function(a, b) {
        return b.score - a.score;
      });
      localStorage.highScores = JSON.stringify(highScores);
      restartGame();
    }
  }

  //this creates the new high score
  class HighScore {
    constructor() {
      this.name = name;
      this.score = score;
    }
  }

  //too long...will need to refactor
  //refresh some key variables, clear out the sequence of correct answers
  function restartGame() {
    level = 1;
    sequence = [];
    showHighScores();
    resetVariables();
    score = 0;
    speed = defaultSpeed;
    slider.val(`${speed}`);
    sliderDisplay.text(`Speed: ${speed}`);
    delay = speedValues[`${speed}`].milliseconds;
    //display the new high scores
    updateScoreDisplay();
    $("span").text("Start New Game");
    $(".scoreList").empty();
    //after 3 seconds, update the header back to Simon
    setTimeout(function() {
      $("#titleText")
        .text("SIMON")
        .css("color", "black");
    }, 3000);
  }

  //reset some of the key variables, necessary when changing levels or restarting the game
  function resetVariables() {
    userAnswer = [];
    userTurn = false;
    loopIndex = 0;
    timeLeft = defaultTimeLeft;
    stopTimer();
    showElements();
    $(".countdown").text(``);
    levelDisplay.text(`Level ${level}`);
  }

  //when increasing levels, calculate how many points were earned, increase the speed if necessary, increase the score, update the score display
  function increaseLevel() {
    if (level === 1) {
      $("span").text("Next Level");
    }
    level += 1;
    decidePoints();
    increaseSpeed(level);
    score += points;
    resetVariables();
    updateScoreDisplay();
    $("#titleText")
      .text(`CORRECT!`)
      .css("color", "#4caf50");
  }

  //increase the speed at levels 6, 10, and 14
  function increaseSpeed(level) {
    if (level === 6 || level === 10 || level === 14) {
      speed = Math.min(9, speed + 1);
      slider.val(`${speed}`);
      sliderDisplay.text(`Speed: ${speed}`);
    }
  }

  //calculate how many points were earned at the end of each level
  function decidePoints() {
    if ($("#reverseSwitch").is(":checked")) {
      reverseBonus = 1.5;
    } else {
      reverseBonus = 1;
    }
    if ($("#timerSwitch").is(":checked")) {
      timerBonus = 1.5;
    } else {
      timerBonus = 1;
    }
    // points = basePoints[`${speed}`] * reverseBonus * timerBonus;
    points = speedValues[`${speed}`].points * reverseBonus * timerBonus;
  }

  //hide reverse, timer, and speed so that player can't touch them after the sequence has started flashing
  function hideElements() {
    $(".optionRow").hide();
    startButton.hide();
  }

  //bring back reverse, timer, and speed after the level is over
  function showElements() {
    $(".optionRow").show();
    startButton.show();
  }

  //if the timer is one, count down from 10 and change to red once there are 5 seconds left
  //note, function is run using SetInterval every second in the LoopSequence function
  function responseTimer() {
    if ($("#timerSwitch").is(":checked")) {
      timeLeft--;
      $(".countdown").text(`Must begin answering within ${timeLeft} Seconds`);
      if (timeLeft <= defaultTimeLeft / 2) {
        $(".countdown").css("color", "#b20000");
      }
      if (timeLeft <= 0) {
        $("#titleText")
          .text(`OUT OF TIME!`)
          .css("color", "#b20000");
        checkHighScore();
      }
    }
  }

  //clears the timer
  function stopTimer() {
    clearInterval(timer);
  }

  //updates the score shown on the screen
  function updateScoreDisplay() {
    scoreDisplay.text(`Score ${score}`);
  }

  //displays the highest score of all time
  function displayHighestScore() {
    if (localStorage.highScores) {
      var highScores = JSON.parse(localStorage.highScores);
      highestScore.text(`High Score ${highScores[0].score}`);
    }
  }

  //displays it when the screen starts
  displayHighestScore();

  //creates a row for each of the 10 highest scores
  function showHighScores() {
    $(".lights").hide();
    hideElements();
    $(".scoreTable").empty();
    tr = document.createElement("tr");
    td1 = document.createElement("td");
    tr.appendChild(td1);
    td1.innerHTML = "Rank";
    td2 = document.createElement("td");
    tr.appendChild(td2);
    td2.innerHTML = "Name";
    td3 = document.createElement("td");
    tr.appendChild(td3);
    td3.innerHTML = "Scores";
    $(".scoreTable").append(tr);
    var highScores = JSON.parse(localStorage.highScores);
    for (let k = 0; k < highScores.length; k++) {
      tr = document.createElement("tr");
      td1 = document.createElement("td");
      tr.appendChild(td1);
      td1.innerHTML = k + 1;
      td2 = document.createElement("td");
      tr.appendChild(td2);
      td2.innerHTML = highScores[k].name;
      td3 = document.createElement("td");
      tr.appendChild(td3);
      td3.innerHTML = highScores[k].score;
      $(".scoreTable").append(tr);
    }
    //then shows the table
    $(".highScoreTable").show();
  }

  //when each light is clicked, adds a number to the userAnswer array
  lights.click(function(e) {
    e.preventDefault();
    //can only add numbers if it's the user's turn and the array isn't at length
    if (
      userAnswer.length < sequence.length &&
      userTurn &&
      $(e.target).is(".light")
    ) {
      userAnswer.push(codes[$(e.target).attr("id")]);
      //stops the timer from running
      stopTimer();
      flashLight($(e.target));
      //once the array is full, start checking if the answer is right
      if (userAnswer.length === sequence.length) {
        checkAnswer(sequence, userAnswer);
      }
    }
  });

  //start button...
  startButton.click(function(e) {
    e.preventDefault();
    //hides the high score table
    $(".highScoreTable").hide();
    //shows the gameboard
    $(".lights").show();
    //hides the Return, Timer, and Speed
    hideElements();
    //creates the correct answer
    createSequence(level);
    //flashes it to the user
    loopSequence(sequence);
    $("#titleText")
      .text(`SIMON`)
      .css("color", "black");
  });

  // Update the current slider value (each time you drag the slider handle)
  slider.change(function() {
    sliderDisplay.text(`Speed: ${parseInt(slider.val())}`);
    speed = parseInt(slider.val());
    //delay = speeds[parseInt(slider.val())];
    delay = speedValues[parseInt(slider.val())].milliseconds;
  });
});
