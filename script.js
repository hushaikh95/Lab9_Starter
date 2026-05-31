class CalculatorError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CalculatorError';
  }
}

class InvalidInputError extends CalculatorError {
  constructor(field) {
    super(`Invalid number entered for ${field}.`);
    this.name = 'InvalidInputError';
    this.field = field;
  }
}

class DivisionByZeroError extends CalculatorError {
  constructor() {
    super('Cannot divide by zero.');
    this.name = 'DivisionByZeroError';
  }
}

const sampleUser = {
  id: 42,
  name: 'Alex Rivera',
  role: 'student',
  courses: ['CSE 110', 'CSE 101'],
  active: true,
};

const sampleGrades = [
  { course: 'CSE 110', score: 92, letter: 'A-' },
  { course: 'CSE 101', score: 88, letter: 'B+' },
  { course: 'CSE 120', score: 95, letter: 'A' },
];

const TIMER_LABEL = 'lab9-demo-timer';

window.addEventListener('error', (event) => {
  console.log('Global error caught by error listener:', {
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
});

function parseOperand(value, fieldName) {
  const trimmed = value.trim();
  if (trimmed === '') {
    throw new InvalidInputError(fieldName);
  }
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) {
    throw new InvalidInputError(fieldName);
  }
  return parsed;
}

function calculate(firstNum, operator, secondNum) {
  switch (operator) {
    case '+':
      return firstNum + secondNum;
    case '-':
      return firstNum - secondNum;
    case '*':
      return firstNum * secondNum;
    case '/':
      if (secondNum === 0) {
        throw new DivisionByZeroError();
      }
      return firstNum / secondNum;
    default:
      throw new CalculatorError(`Unsupported operator: ${operator}`);
  }
}

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const output = document.querySelector('output');
  const firstNumInput = document.querySelector('#first-num');
  const secondNumInput = document.querySelector('#second-num');
  const operator = document.querySelector('#operator').value;

  output.textContent = 'Calculating...';

  try {
    const firstNum = parseOperand(firstNumInput.value, 'first number');
    const secondNum = parseOperand(secondNumInput.value, 'second number');
    const result = calculate(firstNum, operator, secondNum);
    output.textContent = `${firstNum} ${operator} ${secondNum} = ${result}`;
    console.log('Calculation succeeded:', { firstNum, operator, secondNum, result });
  } catch (error) {
    if (error instanceof CalculatorError) {
      output.textContent = `[${error.name}] ${error.message}`;
      console.error('Calculator error caught:', error);
    } else {
      output.textContent = 'An unexpected error occurred.';
      console.error('Unexpected error caught:', error);
    }
  } finally {
    output.classList.toggle('has-result', output.textContent !== 'Calculating...');
    console.log('Calculator attempt finished.');
  }
});

const errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));

const consoleHandlers = {
  'Console Log': () => {
    console.log('Console Log Demo:', sampleUser);
  },
  'Console Error': () => {
    console.error('Console Error Demo: something went wrong while loading grades.', {
      user: sampleUser.name,
      attemptedAction: 'fetchGrades',
    });
  },
  'Console Count': () => {
    console.count('button-click-count');
  },
  'Console Warn': () => {
    console.warn('Console Warn Demo: score below passing threshold.', {
      course: 'CSE 110',
      score: 58,
    });
  },
  'Console Assert': () => {
    const passingScore = 70;
    const studentScore = 58;
    console.assert(
      studentScore >= passingScore,
      'Console Assert Demo: student score should be at least passing.',
      { studentScore, passingScore },
    );
  },
  'Console Clear': () => {
    console.clear();
    console.log('Console was cleared. Fresh log started.');
  },
  'Console Dir': () => {
    console.dir(sampleUser);
  },
  'Console dirxml': () => {
    const gradeList = document.querySelector('#grade-list');
    console.dirxml(gradeList);
  },
  'Console Group Start': () => {
    console.group('Grade Report');
    console.log('Student:', sampleUser.name);
    console.table(sampleGrades);
    console.groupCollapsed('Course Details');
    sampleGrades.forEach(({ course, score, letter }) => {
      console.log(`${course}: ${score} (${letter})`);
    });
    console.groupEnd();
    console.groupEnd();
  },
  'Console Group End': () => {
    console.groupEnd();
    console.log('Closed the most recent console group.');
  },
  'Console Table': () => {
    console.table(sampleGrades);
  },
  'Start Timer': () => {
    console.time(TIMER_LABEL);
    console.log(`Timer "${TIMER_LABEL}" started. Click "End Timer" to finish.`);
  },
  'End Timer': () => {
    console.timeEnd(TIMER_LABEL);
  },
  'Console Trace': () => {
    function innerHelper() {
      console.trace('Console Trace Demo: call stack at this point');
    }
    function outerHelper() {
      innerHelper();
    }
    outerHelper();
  },
  'Trigger a Global Error': () => {
    renderCalculationSummary();
  },
};

errorBtns.forEach((button) => {
  button.addEventListener('click', () => {
    const handler = consoleHandlers[button.textContent.trim()];
    if (handler) {
      handler();
    }
  });
});

function renderCalculationSummary() {
  const summaryNode = document.getElementById('calc-summary');
  summaryNode.textContent = `Last result: ${document.querySelector('output').textContent}`;
}
