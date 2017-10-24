console.log("hello world!");
let level = 1;
let sequence = [];
let userAnswer = [];
let lights = $(".lights");
let firstLight = $("#light1");
let secondLight = $("#light2");
let thirdLight = $("#light3");
let fourthLight = $("#light4");
let startButton = $("#start");
let delay = 1000;
let userTurn = false;
let codes = {
  light1: 1,
  light2: 2,
  light3: 3,
  light4: 4
};

function createSequence(level) {
  for (let i = 0; i < level + 3; i++) {
    let randomSquare = Math.round(Math.random() * 3) + 1;
    sequence.push(randomSquare);
  }
}

// (1) define the variable for the array index
var i = 0;

// (2) define the delayed loop function
function loopSequence(sequence) {
  setTimeout(function() {
    // (3) do action
    console.log(`iteration ${i}`);
    console.log(`value ${sequence[i]}`);
    console.log(`sequence length ${sequence.length}`);
    checkLight(sequence[i]);

    // (4) if the end of the array has been reached, stop
    if (++i >= sequence.length) {
      userTurn = true;
      return;
    }
    loopSequence(sequence);
  }, delay);

  // (5) recursively call the delayed loop function with a delay
}

function checkLight(light) {
  switch (light) {
    case 1:
      flashLight(firstLight);
      console.log("1 changed");
      break;
    case 2:
      flashLight(secondLight);
      console.log("2 changed");
      break;
    case 3:
      flashLight(thirdLight);
      console.log("3 changed");
      break;
    case 4:
      flashLight(fourthLight);
      console.log("4 changed");
      break;
    default:
      console.log(light);
  }
}

function flashLight(light) {
  light.css("opacity", 1);
  setTimeout(function() {
    console.log("change");
    light.css("opacity", 0.2);
  }, delay / 2);
}

function checkAnswer(answer, userInput) {
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] !== userInput[i]) {
      alert("incorrect answer");
      reset();
      return;
    }
  }
  alert("you got it!!");
  increaseLevel();
}

//MUST WRITE THESE TWO FUNCTIONS
function reset() {}
function increaseLevel() {}

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
  console.log("clicked");
  createSequence(level);
  loopSequence(sequence);
});
