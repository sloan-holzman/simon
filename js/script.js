$(document).ready(function() {
  let level = 1;
  let sequence = [];
  let userAnswer = [];
  let firstLight = $("#light1");
  let secondLight = $("#light2");
  let thirdLight = $("#light3");
  let fourthLight = $("#light4");
  let startButton = $("#start");
  let delay = 500;

  function createSequence(level) {
    for (let i = 0; i < level + 2; i++) {
      let randomSquare = Math.round(Math.random() * 3) + 1;
      sequence.push(randomSquare);
    }
  }
});
