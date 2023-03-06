let accumulator = "0";
let operandOne = undefined;
let operandTwo = undefined;
let operator = undefined;
let state = "allClear";

const calculatorAccumulatorDisplay = document.querySelector("#display-accumulator-text");
const calculatorHistoryDisplay = document.querySelector("#display-history-text");
const digitButtons = document.querySelectorAll(".button-digit");
const operatorButtons = document.querySelectorAll(".button-operator");
const utilityButtons = document.querySelectorAll(".button-utility");
const clearButton = document.querySelector("#utility-clear");

const maxAccumulatorFontSize = parseInt(getComputedStyle(calculatorAccumulatorDisplay).fontSize);
const calculatorAccumulatorDisplayContainer = document.querySelector("#display-accumulator");
const maxAccumulatorWidth = calculatorAccumulatorDisplayContainer.clientWidth - 
  parseInt(getComputedStyle(calculatorAccumulatorDisplayContainer).paddingLeft) -
  parseInt(getComputedStyle(calculatorAccumulatorDisplayContainer).paddingRight);

const maxHistoryFontSize = parseInt(getComputedStyle(calculatorHistoryDisplay).fontSize);
const calculatorHistoryDisplayContainer = document.querySelector("#display-history");
const maxHistoryWidth = calculatorHistoryDisplayContainer.clientWidth -
  parseInt(getComputedStyle(calculatorHistoryDisplayContainer).paddingLeft) -
  parseInt(getComputedStyle(calculatorHistoryDisplayContainer).paddingRight);

const maxNumDigits = 9;

function divideOperands(a, b) {
  return b === 0 ? undefined : a/b;
}

function multiplyOperands(a, b) {
  return a*b;
}

function subtractOperands(a, b) {
  return a - b;
}

function addOperands(a, b) {
  return a + b;
}

function compute(operandOne, operandTwo, operator) {
  switch (operator) {
    case "operator-divide":
      return divideOperands(operandOne, operandTwo);
    case "operator-times":
      return multiplyOperands(operandOne, operandTwo);
    case "operator-minus":
      return subtractOperands(operandOne, operandTwo);
    case "operator-plus":
      return addOperands(operandOne, operandTwo);
    default:
      console.error(`Attempting to compute using unsupported operator "${operator}".`);
      return undefined;
  }
}

function formatFloat(value, maxNumDigits) {

}

function parseAccumulator() {
  return parseFloat(accumulator);
}

function resetCalculator(
  { clearAccumulator=true, clearOperandOne=true,
    clearOperandTwo=true, clearOperator=true } = {})
{
  console.log(clearAccumulator, clearOperandOne, clearOperandTwo, clearOperator);
  if (clearAccumulator) accumulator = "0";
  if (clearOperandOne) operandOne = undefined;
  if (clearOperandTwo) operandTwo = undefined;
  if (clearOperator) operator = undefined;
  return "allClear";
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

function resizeFont(textElement, maxTextWidth=maxAccumulatorWidth, maxFontSize=maxAccumulatorFontSize) {
  textElement.style.fontSize = `${maxFontSize}px`;
  if (textElement.clientWidth > maxTextWidth) {
    decreaseFontSize(textElement, maxTextWidth)
  }
  else if (parseInt(getComputedStyle(textElement).fontSize) < maxFontSize) {
    increaseFontSize(textElement, maxFontSize);
  }
}

function updateAccumulatorDisplay() {
  calculatorAccumulatorDisplay.textContent = parseAccumulator();
  resizeFont(calculatorAccumulatorDisplay, maxAccumulatorWidth, maxAccumulatorFontSize);
}




// digit inputs
function parseDigitId(digitId) {
  if (typeof digitId !== "string")
    return [undefined, undefined];

  let splitId = digitId.split("-");
  if (splitId.length !== 2)
    return [undefined, undefined];
  else if (splitId[0] !== "digit")
    return [undefined, undefined];

  let [prefix, id] = splitId;
  if (id === "decimal")
    return splitId;
  else {
    let integerId = parseInt(id);
    if (0 <= integerId && integerId <= 9)
      return [prefix, integerId];
    else
      return [undefined, undefined];
  }
}

function inputDecimalDigit() {
  accumulator = accumulator.includes(".") ? accumulator : `${accumulator}.`;
}

function inputIntegerDigit(integer) {
  accumulator = accumulator === "0" ? `${integer}` : `${accumulator}${integer}`;
}

function stateTransitionDigit() {
  switch (state) {
    case "allClear":
    case "operandOne":
      operandOne = parseAccumulator();
      return "operandOne";
    case "operator":
    case "operandTwo":
      operandTwo = parseAccumulator();
      return "operandTwo";
    case "result":
      operandOne = parseAccumulator();
      resetCalculator({clearOperandOne: false});
      return "operandOne";
    default:
      console.error(`Attempting to transition from unsupported state "${state}". Resetting calculator...`);
      return resetCalculator();
  }
}

function inputDigit(digitId) {
  let [prefix, id] = parseDigitId(digitId);
  if (prefix === undefined && id === undefined) {
    console.error(`Attempting to input digit "${digitId}". Resetting calculator...`);
    return resetCalculator();
  }
  else {
    if (id === "decimal")
      inputDecimalDigit();
    else
      inputIntegerDigit(id);

    return stateTransitionDigit();
  }
}
// digit inputs



// operator inputs
function inputEqualsOperator() {
  switch (state) {
    case "allClear":
      return resetCalculator();
    case "operandOne":
      return "result";
    case "operator":
      operandOne = parseAccumulator();
      operandTwo = parseAccumulator();
      accumulator = `${compute(operandOne, operandTwo, operator)}`;
      return "result"
    case "operandTwo":
      accumulator = `${compute(operandOne, operandTwo, operator)}`;
      return "result";
    case "result":
      operandOne = parseAccumulator();
      accumulator = `${compute(operandOne, operandTwo, operator)}`;
      return state;
    default:
      console.error(`In unknown state "${state}". Resetting calculator...`);
      return resetCalculator();
  }
}

function inputMdasOperator(operatorId) {
  switch (state) {
    case "operandOne":
      operandOne = parseAccumulator();
      accumulator = "0";
    case "allClear":
    case "operator":
      operator = operatorId;
      return "operator";
    case "operandTwo":
      accumulator = `${compute(operandOne, operandTwo, operator)}`;
      operandOne = parseAccumulator();
      operator = operatorId;
      return "operator";
    case "result":
      operandOne = parseAccumulator();
      operator = operatorId;
      resetCalculator({clearOperandOne: false, clearOperator: false});
      return "operator";
    default:
      console.error(`In unknown state "${state}". Resetting calculator...`);
      return resetCalculator();
  }
}

function inputOperator(operatorId) {
  switch (operatorId) {
    case "operator-divide":
    case "operator-times":
    case "operator-minus":
    case "operator-plus":
      return inputMdasOperator(operatorId);
    case "operator-equals":
      return inputEqualsOperator();
    default:
      console.error(`Attempting to use unknown operator "${operatorId}". Resetting calculator...`);
      return resetCalculator();
  }
}
// operator inputs



// utility inputs
function inputClearUtility() {
  return resetCalculator();
}

function inputPercentUtiltiy() {
  accumulator = `${parseFloat(accumulator)/100}`;
  return state;
}

function inputPlusMinusUtility() {
  accumulator = `${-1*parseFloat(accumulator)}`;
  return state;
}

function inputUtility(utilityId) {
  switch (utilityId) {
    case "utility-clear":
      return inputClearUtility();
    case "utility-percent":
      return inputPercentUtiltiy();
    case "utility-plusminus":
      return inputPlusMinusUtility();
    default:
      console.error(`Attempting to use unsupported utility "${utilityId}". Resetting calculator...`);
      return resetCalculator();
  }
}
// utility inputs



digitButtons.forEach((digitButton) => {
  digitButton.addEventListener("click", e => {
    state = inputDigit(e.target.id);
    updateAccumulatorDisplay();
    console.log(accumulator, operandOne, operandTwo, operator, state);
    console.log(accumulator.includes("e"));
  });
});

operatorButtons.forEach((operatorButton) => {
  operatorButton.addEventListener("click", e => {
    state = inputOperator(e.target.id);
    updateAccumulatorDisplay();
    console.log(accumulator, operandOne, operandTwo, operator, state);
    console.log(accumulator.includes("e"));
  });
});

utilityButtons.forEach((utilityButton) => {
  utilityButton.addEventListener("click", e => {
    state = inputUtility(e.target.id);
    updateAccumulatorDisplay();
    console.log(accumulator, operandOne, operandTwo, operator, state);
    console.log(accumulator.includes("e"));
  });
});
