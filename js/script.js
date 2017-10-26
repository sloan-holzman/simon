let level = 1;
let sequence = [];
let userAnswer = [];
let levelDisplay = $("#level");
let lights = $(".lights");
let firstLight = $("#light1");
let secondLight = $("#light2");
let thirdLight = $("#light3");
let fourthLight = $("#light4");
let startButton = $("#start");
let userTurn = false;
let loopIndex = 0;
let slider = $("#myRange");
let sliderDisplay = $("#sliderValue");
let scoreDisplay = $("#scoreDisplay");
let highestScore = $("#highScore");
let defaultTimeLeft = 10;
let timeLeft = defaultTimeLeft;
let timer;
let name = "Sloan";
let score = 0;
let reverseBonus = 1;
let timerBonus = 1;
let points = 0;
let introSequence = [1, 2, 4, 3];

let codes = {
  light1: 1,
  light2: 2,
  light3: 3,
  light4: 4
};
let speeds = {
  1: 1000,
  2: 900,
  3: 800,
  4: 700,
  5: 600,
  6: 500,
  7: 400,
  8: 300,
  9: 200
};

//clean this up later to combine speeds and points into one object/array structure
let basePoints = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9
};

// const array = {
//   "1": {
//     speed: 1000,
//     points: 1
//   }
// }
// array[1]

let defaultSpeed = 5;
let speed = defaultSpeed;
let delay = speeds[`${speed}`];
slider.val(`${speed}`);
sliderDisplay.text(`Speed: ${speed}`);
displayHighScores();

function createSequence(level) {
  if (level === 1) {
    for (let i = 0; i < 2; i++) {
      let randomLight = Math.round(Math.random() * 3) + 1;
      sequence.push(randomLight);
    }
  } else {
    let randomLight = Math.round(Math.random() * 3) + 1;
    sequence.push(randomLight);
  }
}

function loopSequence(sequence) {
  setTimeout(function() {
    // (3) do action
    checkLight(sequence[loopIndex]);

    // (4) if the end of the array has been reached, stop
    if (++loopIndex >= sequence.length) {
      userTurn = true;
      timer = setInterval(function() {
        responseTimer();
      }, 1000);
      return;
    }
    loopSequence(sequence);
  }, delay);
  console.log(sequence);
}

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

function flashLight(light) {
  light.css("opacity", 1);
  setTimeout(function() {
    light.css("opacity", 0.2);
  }, delay / 2);
}

function checkAnswer(answer, userInput) {
  for (let i = 0; i < answer.length; i++) {
    if ($("#reverseSwitch").is(":checked")) {
      var userInputIndex = userInput.length - i - 1;
    } else {
      var userInputIndex = i;
    }
    if (answer[i] !== userInput[userInputIndex]) {
      $("#titleText")
        .text("Incorrect answer! GAME OVER")
        .css("color", "#b20000");
      restartGame();
      return;
    }
  }
  increaseLevel();
}

//will need to refactor this...it's too long!
function addHighScore() {
  if (localStorage.highScores) {
    var highScores = JSON.parse(localStorage.highScores);
  } else {
    var highScores = [];
  }
  if (highScores.length < 10) {
    name = prompt(
      "Congrats!  You got a new high score.  Please enter your name"
    );
    let newScore = new HighScore();
    highScores.push(newScore);
    highScores.sort(function(a, b) {
      return b.score - a.score;
    });
    localStorage.highScores = JSON.stringify(highScores);
  } else if (score > highScores[9].score) {
    name = prompt(
      "Congrats!  You got a new high score.  Please enter your name"
    );
    let newScore = new HighScore();
    highScores.pop();
    highScores.push(newScore);
    highScores.sort(function(a, b) {
      return b.score - a.score;
    });
    localStorage.highScores = JSON.stringify(highScores);
  }
}

class HighScore {
  constructor() {
    this.name = name;
    this.score = score;
  }
}

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

function restartGame() {
  level = 1;
  sequence = [];
  addHighScore();
  resetVariables();
  score = 0;
  speed = defaultSpeed;
  slider.val(`${speed}`);
  sliderDisplay.text(`Speed: ${speed}`);
  delay = speeds[`${speed}`];
  updateScoreDisplay();
  $("span").text("Start");
  $(".scoreList").empty();
  displayHighScores();
  setTimeout(function() {
    $("#titleText")
      .text("SIMON")
      .css("color", "black");
  }, 3000);
}

function increaseSpeed(level) {
  if (level === 6 || level === 10 || level === 14) {
    speed = Math.min(9, speed + 1);
    slider.val(`${speed}`);
    sliderDisplay.text(`Speed: ${speed}`);
  }
}

function decidePoints() {
  if ($("#reverseSwitch").is(":checked")) {
    reverseBonus = 1.5;
    console.log("reverse");
  } else {
    reverseBonus = 1;
    console.log("normal");
  }
  if ($("#timerSwitch").is(":checked")) {
    timerBonus = 1.5;
    console.log("checked");
  } else {
    timerBonus = 1;
    console.log("not checked");
  }
  points = basePoints[`${speed}`] * reverseBonus * timerBonus;
}

function hideElements() {
  $(".optionRow").hide();
  startButton.hide();
}

function showElements() {
  $(".optionRow").show();
  startButton.show();
}

function responseTimer() {
  if ($("#timerSwitch").is(":checked")) {
    console.log("timer selected");
    timeLeft--;
    $(".countdown").text(`Must begin answering within ${timeLeft} Seconds`);
    if (timeLeft <= defaultTimeLeft / 2) {
      $(".countdown").css("color", "#b20000");
    }
    if (timeLeft <= 0) {
      $("#titleText")
        .text(`You ran out of time.  GAME OVER!`)
        .css("color", "#b20000");
      restartGame();
    }
  }
}

function stopTimer() {
  clearInterval(timer);
}

function updateScoreDisplay() {
  scoreDisplay.text(`Score ${score}`);
}

function displayHighScores() {
  if (localStorage.highScores) {
    var highScores = JSON.parse(localStorage.highScores);
    for (var j = 0; j < highScores.length; j++) {
      $(".scoreList").append(
        "<li>" + highScores[j].score + " - " + highScores[j].name + "</li>"
      );
    }
  }
}

function displayHighestScore() {
  if (localStorage.highScores) {
    var highScores = JSON.parse(localStorage.highScores);
    highestScore.text(`High Score ${highScores[0].score}`);
  }
}

displayHighestScore();

lights.click(function(e) {
  e.preventDefault();
  if (
    userAnswer.length < sequence.length &&
    userTurn &&
    $(e.target).is(".light")
  ) {
    userAnswer.push(codes[$(e.target).attr("id")]);
    stopTimer();
    flashLight($(e.target));
    if (userAnswer.length === sequence.length) {
      checkAnswer(sequence, userAnswer);
    }
  }
});

startButton.click(function(e) {
  e.preventDefault();
  hideElements();
  createSequence(level);
  loopSequence(sequence);
  $("#titleText")
    .text(`SIMON`)
    .css("color", "black");
});

// Update the current slider value (each time you drag the slider handle)
slider.change(function() {
  sliderDisplay.text(`Speed: ${parseInt(slider.val())}`);
  speed = parseInt(slider.val());
  delay = speeds[parseInt(slider.val())];
});
