"use strict";
class ScientificCalculator {
    constructor() {
        this.currentInput = "0";
        this.operator = null;
        this.previousInput = null;
        this.shouldResetDisplay = false;
        this.history = [];
        this.isScientificMode = true;
        this.MAX_HISTORY = 50;
        this.PRECISION = 10;
        this.MODE_KEY = 'calculator-mode';
        this.display = document.getElementById('display');
        this.initializeEventListeners();
        this.loadHistory();
        this.loadMode();
    }
    initializeEventListeners() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
        const modeToggle = document.getElementById('mode-toggle');
        modeToggle?.addEventListener('change', () => this.toggleMode());
        const historyBtn = document.getElementById('history-btn');
        const modal = document.getElementById('history-modal');
        const closeBtn = document.querySelector('.close');
        const clearHistoryBtn = document.getElementById('clear-history');
        historyBtn?.addEventListener('click', () => this.showHistory());
        closeBtn?.addEventListener('click', () => this.hideHistory());
        clearHistoryBtn?.addEventListener('click', () => this.clearHistory());
        window.addEventListener('click', (e) => {
            if (e.target === modal)
                this.hideHistory();
        });
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    toggleMode() {
        const modeToggle = document.getElementById('mode-toggle');
        if (modeToggle) {
            this.isScientificMode = modeToggle.checked;
            this.applyMode();
            this.saveMode();
        }
    }
    applyMode() {
        const container = document.querySelector('.calculator-container');
        const modeToggle = document.getElementById('mode-toggle');
        if (this.isScientificMode) {
            container?.classList.remove('simple-mode');
            if (modeToggle)
                modeToggle.checked = true;
        }
        else {
            container?.classList.add('simple-mode');
            if (modeToggle)
                modeToggle.checked = false;
        }
    }
    saveMode() {
        localStorage.setItem(this.MODE_KEY, this.isScientificMode ? 'scientific' : 'simple');
    }
    loadMode() {
        const savedMode = localStorage.getItem(this.MODE_KEY);
        this.isScientificMode = savedMode !== 'simple';
        this.applyMode();
    }
    handleButtonClick(e) {
        const target = e.target;
        const button = target.closest('.btn');
        if (!button)
            return;
        const value = button.textContent?.trim() || '';
        const isDelete = button.classList.contains('btn-delete');
        if (isDelete) {
            this.backspace();
        }
        else {
            this.processInput(value);
        }
    }
    handleKeyboard(e) {
        const key = e.key;
        if (/\d/.test(key))
            this.inputNumber(key);
        else if (['+', '-', '*', '/', '%'].includes(key))
            this.inputOperator(key === '*' ? '×' : key);
        else if (key === 'Enter' || key === '=')
            this.calculate();
        else if (key === 'Backspace')
            this.backspace();
        else if (key === 'Escape')
            this.clear();
        else if (key === '.')
            this.inputNumber('.');
    }
    processInput(value) {
        if (!value)
            return;
        if (this.isNumber(value) || value === '.') {
            this.inputNumber(value);
        }
        else if (this.isBasicOperator(value)) {
            this.inputOperator(value);
        }
        else if (value === '=') {
            this.calculate();
        }
        else if (value === 'C') {
            this.clear();
        }
        else if (value === 'CL') {
            this.clearAll();
        }
        else if (value === '±') {
            this.toggleSign();
        }
        else {
            this.handleScientificFunction(value);
        }
    }
    isNumber(value) {
        return /^\d$/.test(value);
    }
    isBasicOperator(value) {
        return ['+', '-', '×', '/', '%', '^'].includes(value);
    }
    inputNumber(num) {
        if (num === '.' && this.currentInput.includes('.'))
            return;
        if (this.shouldResetDisplay) {
            this.currentInput = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
        }
        else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }
    inputOperator(op) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = op;
        this.shouldResetDisplay = true;
    }
    calculate() {
        if (!this.operator || !this.previousInput)
            return;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;
        try {
            switch (this.operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0)
                        throw new Error('Divisão por zero');
                    result = prev / current;
                    break;
                case '%':
                    result = (prev * current) / 100;
                    break;
                case '^':
                    result = Math.pow(prev, current);
                    break;
                default: return;
            }
            result = this.roundToPrecision(result);
            const expression = `${this.previousInput} ${this.operator} ${this.currentInput} = ${result}`;
            this.addToHistory(expression);
            this.currentInput = result.toString();
            this.operator = null;
            this.previousInput = null;
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
        catch (error) {
            this.showError('Erro');
        }
    }
    handleScientificFunction(func) {
        const current = parseFloat(this.currentInput);
        let result;
        let expression;
        try {
            switch (func) {
                case 'sin':
                    result = Math.sin(this.toRadians(current));
                    expression = `sin(${current}) = ${result}`;
                    break;
                case 'cos':
                    result = Math.cos(this.toRadians(current));
                    expression = `cos(${current}) = ${result}`;
                    break;
                case 'tan':
                    result = Math.tan(this.toRadians(current));
                    expression = `tan(${current}) = ${result}`;
                    break;
                case 'log':
                    if (current <= 0)
                        throw new Error('Logaritmo inválido');
                    result = Math.log10(current);
                    expression = `log(${current}) = ${result}`;
                    break;
                case 'ln':
                    if (current <= 0)
                        throw new Error('Logaritmo inválido');
                    result = Math.log(current);
                    expression = `ln(${current}) = ${result}`;
                    break;
                case '√':
                    if (current < 0)
                        throw new Error('Raiz inválida');
                    result = Math.sqrt(current);
                    expression = `√(${current}) = ${result}`;
                    break;
                case 'x²':
                    result = Math.pow(current, 2);
                    expression = `(${current})² = ${result}`;
                    break;
                case '1/x':
                    if (current === 0)
                        throw new Error('Divisão por zero');
                    result = 1 / current;
                    expression = `1/(${current}) = ${result}`;
                    break;
                case 'n!':
                    if (current < 0 || !Number.isInteger(current) || current > 170) {
                        throw new Error('Fatorial inválido');
                    }
                    result = this.factorial(current);
                    expression = `${current}! = ${result}`;
                    break;
                case 'π':
                    result = Math.PI;
                    expression = `π = ${result}`;
                    break;
                case 'e':
                    result = Math.E;
                    expression = `e = ${result}`;
                    break;
                case 'x^y':
                    this.inputOperator('^');
                    return;
                case '|x|':
                    result = Math.abs(current);
                    expression = `|${current}| = ${result}`;
                    break;
                case '∛':
                    result = Math.cbrt(current);
                    expression = `∛(${current}) = ${result}`;
                    break;
                case '10^x':
                    result = Math.pow(10, current);
                    expression = `10^${current} = ${result}`;
                    break;
                default:
                    return;
            }
            result = this.roundToPrecision(result);
            this.addToHistory(expression);
            this.currentInput = result.toString();
            this.shouldResetDisplay = true;
            this.updateDisplay();
        }
        catch (error) {
            this.showError('Erro');
        }
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    factorial(n) {
        if (n <= 1)
            return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    roundToPrecision(num) {
        return Math.round(num * Math.pow(10, this.PRECISION)) / Math.pow(10, this.PRECISION);
    }
    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-')
                ? this.currentInput.slice(1)
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }
    clear() {
        this.currentInput = '0';
        this.updateDisplay();
    }
    clearAll() {
        this.currentInput = '0';
        this.operator = null;
        this.previousInput = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    updateDisplay() {
        this.display.value = this.currentInput;
    }
    showError(msg) {
        this.currentInput = msg;
        this.updateDisplay();
        this.shouldResetDisplay = true;
    }
    addToHistory(expression) {
        this.history.unshift(expression);
        if (this.history.length > this.MAX_HISTORY) {
            this.history = this.history.slice(0, this.MAX_HISTORY);
        }
        this.saveHistory();
    }
    showHistory() {
        const modal = document.getElementById('history-modal');
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = '';
            if (this.history.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Nenhum cálculo realizado ainda';
                li.style.fontStyle = 'italic';
                li.style.opacity = '0.7';
                historyList.appendChild(li);
            }
            else {
                this.history.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    historyList.appendChild(li);
                });
            }
        }
        if (modal)
            modal.style.display = 'block';
    }
    hideHistory() {
        const modal = document.getElementById('history-modal');
        if (modal)
            modal.style.display = 'none';
    }
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.showHistory();
    }
    saveHistory() {
        try {
            localStorage.setItem('calculator-history', JSON.stringify(this.history));
        }
        catch (error) {
            console.warn('Não foi possível salvar o histórico:', error);
        }
    }
    loadHistory() {
        try {
            const saved = localStorage.getItem('calculator-history');
            if (saved)
                this.history = JSON.parse(saved);
        }
        catch (error) {
            console.warn('Não foi possível carregar o histórico:', error);
            this.history = [];
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});
