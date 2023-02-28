function operationAdd(a, b) {
  return a + b;
}

function operationSubtract(a, b) {
  return a - b;
}

function operationMultiply(a, b) {
  return a*b;
}

function operationDivide(a, b) {
  return b === 0 ? undefined : a/b;
}

function operate(a, b, operator) {
  switch (operator) {
    case "operator-plus":
      return operationAdd(a, b);
    case "operator-minus":
      return operationSubtract(a, b);
    case "operator-times":
      return operationMultiply(a, b);
    case "operator-divide":
      return operationDivide(a, b);
    default:
      return undefined
  }
}

let accumulator = 0;
let operandOne = 0;
let operandTwo = 0;
let operator = undefined;

let calculatorDisplay = document.querySelector("#display");
let digitButtons = document.querySelectorAll(".button-digit");
let operatorButtons = document.querySelectorAll(".button-operator");
let utilityButtons = document.querySelectorAll(".button-utility");

function updateDisplay(newValue) {
  calculatorDisplay.textContent = newValue;
}

function updateOperator() {
  operatorButtons.forEach((operatorButton) => {
    operatorButton.classList.remove("button-operator-active");
    if (operatorButton.id === operator) {
      operatorButton.classList.add("button-operator-active");
    }
  });
}

function compute() {
  accumulator = operate(operandOne, operandTwo, operator);
}

function pressDigitButton(digitValue) {
  console.log(digitValue);
  accumulator = accumulator === 0 ? digitValue : Number(`${accumulator}${digitValue}`);
  updateDisplay(accumulator);
}

function pressOperatorButton(operatorId) {
  switch(operatorId) {
    case "operator-divide":
    case "operator-times":
    case "operator-minus":
    case "operator-plus":
      operator = operatorId;
      updateOperator();
    case "operator-equals":
      compute();
      operandOne = accumulator;
      operandTwo = 0;
      operator = undefined;
      updateDisplay(operandOne);
      updateOperator();
      break;
    default:
      operator = undefined;
      break;
  }
  console.log(operatorId, operator);
}

function pressUtilityButton(buttonId) {
  console.log(buttonId);
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

utilityButtons.forEach((utilityButton) => {
  utilityButton.addEventListener("click", e => {
    pressUtilityButton(e.target.id);
  });
});