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
let delay = 1000;
let userTurn = false;
let loopIndex = 0;
let codes = {
  light1: 1,
  light2: 2,
  light3: 3,
  light4: 4
};

function createSequence(level) {
  if (level === 1) {
    for (let i = 0; i < 4; i++) {
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
    default:
      console.log(light);
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
    if (answer[i] !== userInput[i]) {
      level = 1;
      sequence = [];
      resetVariables();
      delay = 1000;
      alert("incorrect answer");
      return;
    }
  }
  increaseLevel();
}

function resetVariables() {
  userAnswer = [];
  userTurn = false;
  loopIndex = 0;
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
    delay = delay * 0.8;
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
