class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resetNext = false;
    }

    delete() {
        if (this.resetNext) {
            this.clear();
            return;
        }
        if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.resetNext) {
            this.currentOperand = '';
            this.resetNext = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
            case '-':
                computation = prev - current;
                break;
            case '×':
            case '*':
                computation = prev * current;
                break;
            case '÷':
            case '/':
                if (current === 0) {
                    computation = 'Error';
                } else {
                    computation = prev / current;
                }
                break;
            default:
                return;
        }
        if (computation !== 'Error') {
             // Handle float precision issues
             computation = Math.round(computation * 10000000000) / 10000000000;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.resetNext = true;
    }

    toggleSign() {
        if (this.currentOperand === '0' || this.currentOperand === 'Error') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    percentage() {
        if (this.currentOperand === 'Error') return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.resetNext = true;
    }

    getDisplayNumber(number) {
        if (number === 'Error' || number === '-' || number === '') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const numberButtons = document.querySelectorAll('.number');
    const operationButtons = document.querySelectorAll('.op:not(.equals)');
    const equalsButton = document.querySelector('.equals');
    const clearButton = document.querySelector('[data-action="clear"]');
    const toggleSignButton = document.querySelector('[data-action="toggle-sign"]');
    const percentageButton = document.querySelector('[data-action="percentage"]');
    const previousOperandTextElement = document.getElementById('previous-operand');
    const currentOperandTextElement = document.getElementById('current-operand');

    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    operationButtons.forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
            calculator.updateDisplay();
        });
    });

    equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    clearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    toggleSignButton.addEventListener('click', () => {
        calculator.toggleSign();
        calculator.updateDisplay();
    });

    percentageButton.addEventListener('click', () => {
        calculator.percentage();
        calculator.updateDisplay();
    });

    // Add keyboard support
    document.addEventListener('keydown', e => {
        if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        }
        if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            calculator.compute();
            calculator.updateDisplay();
        }
        if (e.key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
        if (e.key === 'Escape') {
            calculator.clear();
            calculator.updateDisplay();
        }
        if (['+', '-', '*', '/'].includes(e.key)) {
            let op = e.key;
            if (op === '*') op = '×';
            if (op === '/') op = '÷';
            if (op === '-') op = '−';
            calculator.chooseOperation(op);
            calculator.updateDisplay();
        }
    });
});
