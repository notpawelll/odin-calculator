/*
states:
"allClear"
"clear"
"operandOne"
"operator"
"oprandTwo"
"result"
*/

let state = "allClear";
let operandOne = 0;
let operator = null;
let operandTwo = 0;
let result = 0;

calculatorHistory = document.querySelector("#history");
calculatorDisplay = document.querySelector("#display");
digitButtons = document.querySelectorAll(".digit", ".button");
operatorButtons = document.querySelectorAll(".operator-off", ".button");
clearButton = document.querySelector("#utility-clear");
plusMinusButton = document.querySelector("utility-plusminus");
percentButton = document.querySelector("utility-percent");

function logInternal() {
  console.log(state);
  console.log(operandOne);
  console.log(operator);
  console.log(operandTwo);
  console.log(result);
}

function updateDisplay(data) {
  calculatorDisplay.textContent = data;
}

function updateOperand(operandValue, digitValue) {
  return operandValue === 0 ? digitValue : Number(`${operandValue}${digitValue}`);
}

function pressDigitButton(digitValue) {
  switch (state) {
    case "allClear":
      operandOne = updateOperand(operandOne, digitValue);
      state = "operandOne";
      break;
    case "clear":
      state = "operandTwo";
      break;
    case "operandOne":
      operandOne = updateOperand(operandOne, digitValue);
      state = "operandOne";
      break;
    case "operator":
      state = "operandTwo";
      break;
    case "oprandTwo":
      operandTwo = updateOperand(operandTwo, digitValue);
      state = "operandTwo";
      break
    case "result":
      state = "operandOne";
      break;
  }
  logInternal();
}
function pressNonEqualsOperatorButton(buttonId) {
  switch (state) {
    case "allClear":
      state = "operator";
      break;
    case "clear":
      state = "allClear";
      break;
    case "operandOne":
      state = "operator";
      break;
    case "operator":
      state = "operator";
      break;
    case "oprandTwo":
      state = "operator";
      break
    case "result":
      state = "operator";
      break;
  }
  logInternal();
}

function pressEqualsOperatorButton() {
  switch (state) {
    case "allClear":
      state = "allClear";
      break;
    case "clear":
      state = "result";
      break;
    case "operandOne":
      state = "operandOne";
      break;
    case "operator":
      state = "result";
      break;
    case "oprandTwo":
      state = "result";
      break
    case "result":
      state = "result";
      break;
  }
  logInternal();
}

function pressOperatorButton(buttonId) {
  switch(buttonId) {
    case "operator-equals":
      pressEqualsOperatorButton();
      break;
    default:
      pressNonEqualsOperatorButton(buttonId);
  }
}

function pressUtilityButton(buttonId) {
  switch (buttonId) {
    case "utility-clear":
      pressClearUtilityButton();
      break;
    default:
      break;
  }
}

function pressClearUtilityButton() {
  switch (state) {
    case "allClear":
      state = "allClear";
      break;
    case "clear":
      state = "allClear";
      break;
    case "operandOne":
      state = "allClear";
      break;
    case "operator":
      state = "clear";
      break;
    case "oprandTwo":
      state = "clear";
      break
    case "result":
      state = "clear";
      break;
  }
  logInternal();
}

function pressPlusMinusUtilityButton() {
  
}

function pressPercentUtilityButton() {

}

digitButtons.forEach((digitButton) => {
  digitButton.addEventListener("click", e => {
    pressDigitButton(Number(digitButton.textContent));
  });
});

operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", e => {
    pressOperatorButton(e.target.id);
  });
});
