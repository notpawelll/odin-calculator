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

let accumulatorInteger = 0;
let accumulatorDecimal = false;
let accumulatorFractional = "";
let operandOne = 0;
let operandTwo = 0;
let operator = undefined;
let currentState = "allClear";

const calculatorDisplayText = document.querySelector("#display-text");
const digitButtons = document.querySelectorAll(".button-digit");
const operatorButtons = document.querySelectorAll(".button-operator");
const utilityButtons = document.querySelectorAll(".button-utility");
const clearButton = document.querySelector("#utility-clear");

const calculatorDisplayContainer = document.querySelector("#display");
const maxDisplayWidth = calculatorDisplayContainer.clientWidth - 
  parseInt(getComputedStyle(calculatorDisplayContainer).paddingLeft) -
  parseInt(getComputedStyle(calculatorDisplayContainer).paddingRight);

const maxDisplayFontSize = parseInt(getComputedStyle(calculatorDisplayText).fontSize);

const numMaxDigits = 9;

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
          updateOperand();
          resetAccumulator();
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
          updateOperand();
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
          updateOperand();
          resetAccumulator();
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
          updateOperand();
          resetAccumulator();
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

function decreaseFontSize(textElement, maxTextWidth) {
  while (textElement.clientWidth > maxTextWidth) {
    textElement.style.fontSize = `${parseInt(getComputedStyle(textElement).fontSize) - 1}px`;
  }
}

function increaseFontSize(textElement, maxFontSize) {
  while (parseInt(getComputedStyle(textElement).fontSize) < maxFontSize) {
    textElement.style.fontSize = `${parseInt(getComputedStyle(textElement).fontSize) + 1}px`;
  }
}

function resizeFont(textElement, maxTextWidth=maxDisplayWidth, maxFontSize=maxDisplayFontSize) {
  if (textElement.clientWidth > maxTextWidth) {
    decreaseFontSize(textElement, maxTextWidth)
  }
  else if (parseInt(getComputedStyle(textElement).fontSize) < maxFontSize) {
    increaseFontSize(textElement, maxFontSize);
  }
}

function updateDisplay(integer, decimal, fractional) {
  calculatorDisplayText.textContent = integer.toLocaleString()
  if (decimal) {
    calculatorDisplayText.textContent += `.${fractional}`;
  }
  resizeFont(calculatorDisplayText, maxDisplayWidth, maxDisplayFontSize);
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

// https://stackoverflow.com/questions/14879691/get-number-of-digits-with-javascript
function numDigits(x) {
  if (typeof x === "string") return x.length;
  x = Number(String(x).replace(/[^0-9]/g, ''));
  return Math.max(Math.floor(Math.log10(Math.abs(x))), 0) + 1;
}

function appendToInteger(base, digit) {
  return base === 0 ? digit : Number(`${base}${digit}`);
}

function appendToFractional(base, digit) {
  return `${base}${digit}`;
}

function splitValue(value) {
  let valueString = value.toString();
  let decimalIndex = valueString.indexOf(".");
  if (decimalIndex === -1) {
    return [value, false, ""];
  }
  else {
    let valueInteger = Number(valueString.substring(0, decimalIndex));
    let valueFractional = valueString.substring(decimalIndex + 1);

    let fractionalDigits = numMaxDigits - numDigits(valueInteger);
    console.log(fractionalDigits);
    if (fractionalDigits < 0) {
      console.log("OVERFLOW");
      valueInteger = undefined;
    }

    valueFractional = parseFloat(`.${valueFractional}`).toFixed(fractionalDigits).substring(2).toString();

    return [valueInteger, true, valueFractional];
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
      let result = operate(operandOne, operandTwo, operator);
      let [accumulatorInteger, accumulatorDecimal, accumulatorFractional] = splitValue(result);
      highlightOperator(null);
      updateDisplay(accumulatorInteger, accumulatorDecimal, accumulatorFractional);
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

function updateOperand() {
  switch (currentState) {
    case "result":
    case "operandOne":
      operandOne = parseFloat(`${accumulatorInteger}.${accumulatorFractional}`);
      break;
    case "operandTwo":
      operandTwo = parseFloat(`${accumulatorInteger}.${accumulatorFractional}`);
      break;
    default:
      break;
  }
  console.log(`update operand ${operandOne} ${operandTwo}`)
}

function resetAccumulator() {
  accumulatorInteger = 0;
  accumulatorDecimal = false;
  accumulatorFractional = "";
}

function pressDigitButton(digitValue) {
  if (accumulatorDecimal && (numDigits(accumulatorInteger) + numDigits(accumulatorFractional) < numMaxDigits)) {
    accumulatorFractional = appendToFractional(accumulatorFractional, digitValue);
    updateDisplay(accumulatorInteger, accumulatorDecimal, accumulatorFractional);
  }
  else if (!accumulatorDecimal && numDigits(accumulatorInteger) < numMaxDigits) {
    accumulatorInteger = appendToInteger(accumulatorInteger, digitValue);
    updateDisplay(accumulatorInteger, accumulatorDecimal, accumulatorFractional);
  }
}

function pressPeriodButton() {
  if (!accumulatorDecimal && numDigits(accumulatorInteger) < numMaxDigits) {
    accumulatorDecimal = true;
    updateDisplay(accumulatorInteger, accumulatorDecimal, accumulatorFractional);
  }
}

digitButtons.forEach((digitButton) => {
  digitButton.addEventListener("click", e => {
    currentState = stateTransition(currentState, "digit");
    if (e.target.id === "digit-period") {
      pressPeriodButton();
    }
    else {
      pressDigitButton(Number(digitButton.textContent));
    }
    updateOperand();
    console.log(`op1: ${operandOne} ; op2: ${operandTwo}`);
  });
});

operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", e => {
    currentState = stateTransition(currentState, "operator");
    pressOperatorButton(e.target.id);
    // updateClearButtonText(currentState);
  });
});

utilityButtons.forEach((utilityButton) => {
  utilityButton.addEventListener("click", e => {
    currentState = stateTransition(currentState, "utility");
    pressUtilityButton(e.target.id);
    // updateClearButtonText(currentState);
  });
});