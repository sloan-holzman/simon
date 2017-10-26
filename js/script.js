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
let name = "HillaryC";
let score = 0;
let reverseBonus = 1;
let timerBonus = 1;
let points = 0;
let introSequence = [1, 2, 4, 3];
let nameSubmit = $(".submit");

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

let defaultSpeed = 5;
let speed = defaultSpeed;
// let delay = speeds[`${speed}`];
let delay = speedValues[`${speed}`].milliseconds;
slider.val(`${speed}`);
sliderDisplay.text(`Speed: ${speed}`);
$(".highScoreTable").hide();

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
        .text("WRONG! GAME OVER")
        .css("color", "#b20000");
      checkHighScore();
      return;
    }
  }
  increaseLevel();
}

function checkHighScore() {
  if (localStorage.highScores) {
    var highScores = JSON.parse(localStorage.highScores);
  } else {
    var highScores = [];
  }
  if (highScores.length < 10) {
    inputName();
  } else if (score > highScores[9].score) {
    inputName();
  } else {
    restartGame();
  }
}

//will need to refactor this...it's too long!
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
  showHighScores();
  resetVariables();
  score = 0;
  speed = defaultSpeed;
  slider.val(`${speed}`);
  sliderDisplay.text(`Speed: ${speed}`);
  // delay = speeds[`${speed}`];
  delay = speedValues[`${speed}`].milliseconds;
  updateScoreDisplay();
  $("span").text("Start");
  $(".scoreList").empty();
  setTimeout(function() {
    $("#titleText")
      .text("SIMON")
      .css("color", "black");
  }, 3000);
}

function inputName() {
  $("#myModal").css("display", "block");
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
    timeLeft--;
    $(".countdown").text(`Must begin answering within ${timeLeft} Seconds`);
    if (timeLeft <= defaultTimeLeft / 2) {
      $(".countdown").css("color", "#b20000");
    }
    if (timeLeft <= 0) {
      $("#titleText")
        .text(`You ran out of time.  GAME OVER!`)
        .css("color", "#b20000");
      checkHighScore();
    }
  }
}

function stopTimer() {
  clearInterval(timer);
}

function updateScoreDisplay() {
  scoreDisplay.text(`Score ${score}`);
}

function displayHighestScore() {
  if (localStorage.highScores) {
    var highScores = JSON.parse(localStorage.highScores);
    highestScore.text(`High Score ${highScores[0].score}`);
  }
}

displayHighestScore();

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

  $(".highScoreTable").show();
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

nameSubmit.click(function(e) {
  e.preventDefault();
  name = $("input").val();
  $("#myModal").css("display", "none");
  addHighScore();
});

startButton.click(function(e) {
  e.preventDefault();
  $(".highScoreTable").hide();
  $(".lights").show();
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
  //delay = speeds[parseInt(slider.val())];
  delay = speedValues[parseInt(slider.val())].milliseconds;
});
