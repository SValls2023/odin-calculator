/* Calculator Object */
 function Calculator(prevOperandText, currOperandText) {
    this.prevOperandText = prevOperandText,
    this.currOperandText = currOperandText,
    this.currOperand = '',
    this.prevOperand = '',
    this.operation = undefined,

    this.clear = function() {
        this.currOperand = '';
        this.prevOperand = '';
        this.operation = undefined;
    },

    this.delete = function() {
        this.currOperand = this.currOperand.toString().slice(0, -1);
        if (this.currOperand.toString().length <= 1 && isNaN(this.currOperand)) {
            this.currOperand = '';
        }
    },

    this.appendNumber = function(number) {
        if(number === '.' && this.currOperand.toString().includes('.')) return;
        if(this.currOperand.toString().includes('%')) {
            const index = this.currOperand.toString().indexOf('%');
            this.currOperand = this.currOperand.toString().slice(0, index) + 
                               number.toString() +
                               this.currOperand.toString().slice(index);
        } else {
            this.currOperand = this.currOperand.toString() + number.toString();
        }
    },

    this.negateNumber = function() {
        if (this.currOperand === '') return;
        if (this.currOperand.toString().includes('-')) {
            this.currOperand = this.currOperand.toString().slice(1, this.currOperand.toString().length);
        } else {
            this.currOperand = '-' + this.currOperand.toString();
        }
    }

    this.appendPercentage = function () {
        if (this.currOperand === '') return;
        this.currOperand = this.currOperand.toString() + '%';
    },

    this.chooseOperation = function(operation) {
        if(this.currOperand === '' && this.prevOperand === '') return;
        if (this.currOperand !== '' && this.prevOperand !== '') this.compute();
        if(this.currOperand === '' && this.prevOperand !== '') {
            this.operation = operation
        } else {
            this.operation = operation;
            this.prevOperand = this.currOperand;
            this.currOperand = '';
        }
    },

    this.compute = function() {
        let answer;
        let a = parseFloat(this.prevOperand);
        a = this.convertPercentage(a, this.prevOperand);
        let b = parseFloat(this.currOperand);
        b = this.convertPercentage(b, this.currOperand);
        if (isNaN(a) || isNaN(b)) return;
        switch(this.operation) {
            case '*':
                answer = a * b;
                break;
            case '÷':
                answer = a / b;
                break;
            case '+':
                answer = a + b;
                break;
            case '-':
                answer = a - b;
                break;
            default:
                return;
        }
        this.currOperand = answer;
        this.operation = undefined;
        this.prevOperand = '';
    },

    this.countDecimals = function(number) {
        const stringNumber = number.toString();
        const decimalDigits = stringNumber.split('.')[1];
        if (decimalDigits != null) {
            return decimalDigits.length;
        } else {
            return 0;
        }
    },

    this.convertPercentage = function(number, operand) {
        if(!operand.toString().includes('%')) return number;
        const index = operand.indexOf('%');
        const percentSlice = operand.slice(index);
        for (let i = 0; i < percentSlice.length; i++) {
            number /= 100;
        }
        return number;
    },

    this.getDisplayNumber = function(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFraction: 0});
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            if (stringNumber.includes('%')) {
                const index = stringNumber.indexOf('%');
                integerDisplay = integerDisplay + stringNumber.slice(index);
            }
            return integerDisplay;
        }
    },

    this.updateDisplay = function() {
        this.currOperandText.innerHTML = this.getDisplayNumber(this.currOperand);
        if (this.operation != null) {
            this.prevOperandText.innerHTML = `${this.prevOperand} ${this.operation}`;
        } else {
            this.prevOperandText.innerHTML = '';
        }
    }
}

/* Query Selectors */
const prevOperandText = document.querySelector('[data-previous-op]');
const currOperandText = document.querySelector('[data-current-op]');
const numBtn = document.querySelectorAll('[data-number]');
const operationBtn = document.querySelectorAll('[data-operation]');
const negativeBtn = document.querySelector('[data-negative]');
const percentBtn = document.querySelector('[data-percent]');
const deleteBtn = document.querySelector('[data-delete]');
const clearBtn = document.querySelector('[data-clear]');
const computeBtn = document.querySelector('[data-compute');

/* Calculator Object Declaration */
const calc = new Calculator(prevOperandText, currOperandText);

/* Calulator Button Event Listeners */
numBtn.forEach(button => {
    button.addEventListener('click', () => {
        calc.appendNumber(button.innerHTML);
        calc.updateDisplay();
    });
});

operationBtn.forEach(button => {
    button.addEventListener('click', () => {
        calc.chooseOperation(button.innerHTML);
        calc.updateDisplay();
    });
});

negativeBtn.addEventListener('click', () => {
    calc.negateNumber();
    calc.updateDisplay();
});

percentBtn.addEventListener('click', () => {
    calc.appendPercentage();
    calc.updateDisplay();
})

computeBtn.addEventListener('click', () => {
    calc.compute();
    calc.updateDisplay();
});

clearBtn.addEventListener('click', () => {
    calc.clear();
    calc.updateDisplay();
});

deleteBtn.addEventListener('click', () => {
    calc.delete();
    calc.updateDisplay();
});