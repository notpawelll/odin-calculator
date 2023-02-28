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
let currentState = "allClear";

let calculatorDisplay = document.querySelector("#display");
let digitButtons = document.querySelectorAll(".button-digit");
let operatorButtons = document.querySelectorAll(".button-operator");
let utilityButtons = document.querySelectorAll(".button-utility");
let clearButton = document.querySelector("#utility-clear");

function stateTransition(currentState, transitionType) {
  let nextState;
  switch (currentState) {
    case "allClear":
      switch (transitionType) {
        case "clear":
        case "equals":
          nextState = "allClear";
          break;
        case "digit":
          nextState = "operandOne";
          break;
        case "operator":
          nextState = "operator";
          break;
        default:
          console.log(`attempted unsupported transition from state ${currentState} with transition ${transitionType}!`);
          nextState = currentState;
          break;
      }
      break;
    case "clear":
      switch (transitionType) {
        case "clear":
        case "operator":
          nextState = "allClear";
          break;
        case "digit":
          nextState = "operandTwo";
          break;
        case "equals":
          nextState = "result";
          break;
        default:
          console.log(`attempted unsupported transition from state ${currentState} with transition ${transitionType}!`);
          nextState = currentState;
          break;
      }
      break;
    case "operandOne":
      switch (transitionType) {
        case "clear":
          nextState = "allClear";
          break;
        case "digit":
        case "equals":
          nextState = "operandOne";
          break;
        case "operator":
          nextState = "operator";
          break;
        default:
          console.log(`attempted unsupported transition from state ${currentState} with transition ${transitionType}!`);
          nextState = currentState;
          break;
      }
      break;
    case "operator":
      switch (transitionType) {
        case "clear":
          nextState = "operator";
          break;
        case "digit":
          nextState = "operandTwo";
          break;
        case "equals":
          nextState = "result";
          break;
        case "operator":
          nextState = "operator";
          break;
        default:
          console.log(`attempted unsupported transition from state ${currentState} with transition ${transitionType}!`);
          nextState = currentState;
          break;
      }
      break;
    case "operandTwo":
      switch (transitionType) {
        case "clear":
          nextState = "clear";
          break;
        case "operator":
          nextState = "operator";
          break;
        case "digit":
          nextState = "operandTwo";
          break;
        case "equals":
          nextState = "result";
          break;
        default:
          console.log(`attempted unsupported transition from state ${currentState} with transition ${transitionType}!`);
          nextState = currentState;
          break;
      }
      break;
    case "result":
      switch (transitionType) {
        case "clear":
          nextState = "clear";
          break;
        case "digit":
          nextState = "operandOne";
          break;
        case "equals":
          nextState = "result";
          break;
        case "operator":
          nextState = "operator";
          break;
        default:
          console.log(`attempted unsupported transition from state ${currentState} with transition ${transitionType}!`);
          nextState = currentState;
          break;
      }
      break;
    default:
      console.log(`currently in unknown state ${currentState}. resetting to allClear!`);
      nextState = "allClear";
      break;
  }
  console.log(`${currentState} --(${transitionType})-> ${nextState}`);
  return nextState;
}

function updateDisplay(newValue) {
  calculatorDisplay.textContent = newValue;
}

function updateClearButtonText(currentState) {
  switch (currentState) {
    case "allClear":
    case "clear":
      clearButton.textContent = "AC";
      break;
    default:
      clearButton.textContent = "C";
      break;
  }
}

function highlightOperator(operatorId) {
  operatorButtons.forEach((operatorButton) => {
    operatorButton.classList.remove("button-operator-active");
    if (operatorButton.id === operatorId) {
      operatorButton.classList.add("button-operator-active");
    }
  });
}

function appendToOperand(operandValue, digitValue) {
  return operandValue === 0 ? digitValue : Number(`${operandValue}${digitValue}`);
}

function pressDigitButton(digitValue) {
  currentState = stateTransition(currentState, "digit");
  switch (currentState) {
    case "operandOne":
      operandOne = appendToOperand(operandOne, digitValue)
      updateDisplay(operandOne);
      break;
    case "operandTwo":
      operandTwo = appendToOperand(operandTwo, digitValue);
      updateDisplay(operandTwo);
      break;
    default:
      break;
  }
}

function pressOperatorButton(operatorId) {
  switch(operatorId) {
    case "operator-divide":
    case "operator-times":
    case "operator-minus":
    case "operator-plus":
      currentState = stateTransition(currentState, "operator");
      operator = operatorId;
      operandTwo = 0;
      highlightOperator(operatorId);
      break;
    case "operator-equals":
      currentState = stateTransition(currentState, "equals");
      accumulator = operate(operandOne, operandTwo, operator);
      console.log(`${operandOne} ${operator} ${operandTwo} = ${accumulator}`);
      highlightOperator(null);
      updateDisplay(accumulator);
      operandOne = accumulator;
      break;
    default:
      break;
  }
}

function pressUtilityButton(utilityId) {
  switch (utilityId) {
    case "utility-clear":
      currentState = stateTransition(currentState, "clear");
      switch (currentState) {
        case "clear":
          operandOne = operandTwo;
          operandTwo = 0;
          accumulator = 0;
          highlightOperator(operator);
          updateDisplay(operandTwo);
          break;
        case "allClear":
          operandOne = 0;
          operandTwo = 0;
          operator = undefined;
          accumulator = 0;
          highlightOperator(null);
          updateDisplay(operandOne);
          break;
        case "operandOne":
          operandOne = 0;
          updateDisplay(operandOne);
          break;
        case "operator":
          operandTwo = 0;
          updateDisplay(operandTwo);
        default:
          break;
      }
      break;
    default:
      break;
  }
}

digitButtons.forEach((digitButton) => {
  digitButton.addEventListener("click", e => {
    pressDigitButton(Number(digitButton.textContent));
    updateClearButtonText(currentState);
  });
});

operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", e => {
    pressOperatorButton(e.target.id);
    updateClearButtonText(currentState);
  });
});

utilityButtons.forEach((utilityButton) => {
  utilityButton.addEventListener("click", e => {
    pressUtilityButton(e.target.id);
    updateClearButtonText(currentState);
  });
});