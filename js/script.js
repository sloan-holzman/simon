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
let output = $(".sliderValue");
let defaultTimeLeft = 5;
let timeLeft = defaultTimeLeft;
let timer;
// let highScores = [];
// let name = "Sloan";
let score = 10;

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
let defaultSpeed = 5;
let speed = defaultSpeed;
let delay = speeds[`${speed}`];
slider.val(`${speed}`);
output.text(`Speed: ${speed}`);

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

function restartGame() {
  level = 1;
  sequence = [];
  resetVariables();
  speed = defaultSpeed;
  slider.val(`${speed}`);
  output.text(`Speed: ${speed}`);
  delay = speeds[`${speed}`];
  //addHighScore();
}

//will need to replace this!!!  also, I haven't really tested if this works
// function addHighScore() {
//   let newScore = new HighScore();
//   if (highScores.length < 10) {
//     highScores.push(newScore);
//     highScores.sort(function(a, b) {
//       return a.score - b.score;
//     });
//   } else if (newScore.score > highScores[9].score) {
//     highScores.pop();
//     highScores.push(newScore);
//     highScores.sort(function(a, b) {
//       return b.score - a.score;
//     });
//   }
// }
//
// class HighScore {
//   constructor() {
//     this.name = name;
//     this.score = score;
//   }
// }

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
  resetVariables();
  increaseSpeed(level);
  alert(`you got it!!  click start when you are ready to begin level ${level}`);
}

function increaseSpeed(level) {
  if (level === 6 || level === 10 || level === 14) {
    speed += speed;
    slider.val(`${speed}`);
    output.text(`Speed: ${speed}`);
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
  createSequence(level);
  loopSequence(sequence);
});

// Update the current slider value (each time you drag the slider handle)
slider.change(function() {
  output.text(`Speed: ${parseInt(slider.val())}`);
  speed = parseInt(slider.val());
  delay = speeds[parseInt(slider.val())];
});

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
