let level = 1;
let sequence = [];
let userAnswer = [];
let levelDisplay = $(".level");
let lights = $(".lights");
let firstLight = $("#light1");
let secondLight = $("#light2");
let thirdLight = $("#light3");
let fourthLight = $("#light4");
let startButton = $("#start");
let userTurn = false;
let loopIndex = 0;
let slider = $("#myRange");
let sliderDisplay = $(".sliderValue");
let scoreDisplay = $(".scoreDisplay");
let defaultTimeLeft = 5;
let timeLeft = defaultTimeLeft;
let timer;
let name = "Sloan";
let score = 0;
let reverseBonus = 1;
let timerBonus = 1;
let points = 0;

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
    if ($(".order option:selected").val() === "reverse") {
      var userInputIndex = userInput.length - i - 1;
    } else {
      var userInputIndex = i;
    }
    if (answer[i] !== userInput[userInputIndex]) {
      alert("incorrect answer");
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
  $(".countdown").text(``);
  levelDisplay.text(`Level ${level}`);
}
function increaseLevel() {
  level += 1;
  showTimer();
  showSlider();
  decidePoints();
  increaseSpeed(level);
  score += points;
  resetVariables();
  updateScoreDisplay();
  alert(`you got it!!  click start when you are ready to begin level ${level}`);
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
  $(".scoreList").empty();
  displayHighScores();
}

function increaseSpeed(level) {
  if (level === 6 || level === 10 || level === 14) {
    speed = Math.min(9, speed + 1);
    slider.val(`${speed}`);
    sliderDisplay.text(`Speed: ${speed}`);
  }
}

function decidePoints() {
  if ($(".order option:selected").val() === "reverse") {
    reverseBonus = 1.5;
  } else {
    reverseBonus = 1;
  }
  if ($(".timer option:selected").val() === "on") {
    timerBonus = 1.5;
  } else {
    timerBonus = 1;
  }
  points = basePoints[`${speed}`] * reverseBonus * timerBonus;
}

function hideTimer() {
  $(".timer").hide();
}

function showTimer() {
  $(".timer").show();
}

function hideSlider() {
  $("#slidecontainer").hide();
}

function showSlider() {
  $("#slidecontainer").show();
}

function responseTimer() {
  if ($(".timer option:selected").val() === "on") {
    timeLeft--;
    $(".countdown").text(`Must begin answering within ${timeLeft} Seconds`);
    if (timeLeft <= 0) {
      alert("ran out of time!  you lose");
      restartGame();
    }
  }
}

function stopTimer() {
  clearInterval(timer);
}

function updateScoreDisplay() {
  scoreDisplay.text(`Score: ${score}`);
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
  hideTimer();
  hideSlider();
  createSequence(level);
  loopSequence(sequence);
});

// Update the current slider value (each time you drag the slider handle)
slider.change(function() {
  sliderDisplay.text(`Speed: ${parseInt(slider.val())}`);
  speed = parseInt(slider.val());
  delay = speeds[parseInt(slider.val())];
});
