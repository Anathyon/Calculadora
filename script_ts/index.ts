interface Calculator {
    display: HTMLInputElement;
    currentInput: string;
    operator: string | null;
    previousInput: string | null;
    shouldResetDisplay: boolean;
    history: string[];
}

class ScientificCalculator {
    display: HTMLInputElement;
    currentInput: string = "0";
    operator: string | null = null;
    previousInput: string | null = null;
    shouldResetDisplay: boolean = false;
    history: string[] = [];

    constructor() {
        this.display = document.getElementById('display') as HTMLInputElement;
        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const value = target.closest('.btn')?.textContent?.trim() || '';
                const isDelete = target.closest('.btn-delete');

                if (isDelete) {
                    this.backspace();
                } else {
                    this.handleButtonClick(value);
                }
            });
        });

        const historyBtn = document.getElementById('history-btn');
        const modal = document.getElementById('history-modal');
        const closeBtn = document.querySelector('.close');
        const clearHistoryBtn = document.getElementById('clear-history');

        historyBtn?.addEventListener('click', () => this.showHistory());
        closeBtn?.addEventListener('click', () => this.hideHistory());
        clearHistoryBtn?.addEventListener('click', () => this.clearHistory());

        window.addEventListener('click', (e) => {
            if (e.target === modal) this.hideHistory();
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e: KeyboardEvent) {
        const key = e.key;
        if (/\d/.test(key)) this.inputNumber(key);
        if (['+', '-', '*', '/', '%'].includes(key)) this.inputOperator(key === '*' ? '×' : key);
        if (key === 'Enter' || key === '=') this.calculate();
        if (key === 'Backspace') this.backspace();
        if (key === 'Escape') this.clear();
        if (key === '.') this.inputNumber('.');
    }

    handleButtonClick(value: string) {
        if (!value) return;

        if (this.isNumber(value) || value === '.') {
            this.inputNumber(value);
        } else if (this.isBasicOperator(value)) {
            this.inputOperator(value);
        } else if (value === '=') {
            this.calculate();
        } else if (value === 'C') {
            this.clear();
        } else if (value === 'CL') {
            this.clearAll();
        } else if (value === '±') {
            this.toggleSign();
        } else {
            this.handleScientificFunction(value);
        }
    }

    isNumber(value: string): boolean {
        return /^\d$/.test(value);
    }

    isBasicOperator(value: string): boolean {
        return ['+', '-', '×', '/', '%'].includes(value);
    }

    inputNumber(num: string): void {
        if (num === '.' && this.currentInput.includes('.')) return;

        if (this.shouldResetDisplay) {
            this.currentInput = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    inputOperator(op: string): void {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = op;
        this.shouldResetDisplay = true;
    }

    calculate(): void {
        if (!this.operator || !this.previousInput) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result: number;

        switch (this.operator) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '/':
                if (current === 0) {
                    this.showError('Erro');
                    return;
                }
                result = prev / current;
                break;
            case '%': result = (prev * current) / 100; break;
            default: return;
        }

        result = Math.round(result * 100000000) / 100000000;

        const expression = `${this.previousInput} ${this.operator} ${this.currentInput} = ${result}`;
        this.addToHistory(expression);

        this.currentInput = result.toString();
        this.operator = null;
        this.previousInput = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handleScientificFunction(func: string): void {
        const current = parseFloat(this.currentInput);
        let result: number;
        let expression: string;

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
                    if (current <= 0) throw new Error('Erro');
                    result = Math.log10(current);
                    expression = `log(${current}) = ${result}`;
                    break;
                case 'ln':
                    if (current <= 0) throw new Error('Erro');
                    result = Math.log(current);
                    expression = `ln(${current}) = ${result}`;
                    break;
                case '√':
                    if (current < 0) throw new Error('Erro');
                    result = Math.sqrt(current);
                    expression = `√(${current}) = ${result}`;
                    break;
                case 'x²':
                    result = Math.pow(current, 2);
                    expression = `(${current})² = ${result}`;
                    break;
                case '1/x':
                    if (current === 0) throw new Error('Erro');
                    result = 1 / current;
                    expression = `1/(${current}) = ${result}`;
                    break;
                case 'n!':
                    if (current < 0 || !Number.isInteger(current)) throw new Error('Erro');
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
                default:
                    return;
            }

            result = Math.round(result * 100000000) / 100000000;
            this.addToHistory(expression);
            this.currentInput = result.toString();
            this.shouldResetDisplay = true;
            this.updateDisplay();

        } catch (e: any) {
            this.showError(e.message || 'Erro');
        }
    }

    toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    factorial(n: number): number {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
    }

    toggleSign(): void {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-')
                ? this.currentInput.slice(1)
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }

    clear(): void {
        this.currentInput = '0';
        this.updateDisplay();
    }

    clearAll(): void {
        this.currentInput = '0';
        this.operator = null;
        this.previousInput = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    backspace(): void {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    updateDisplay(): void {
        this.display.value = this.currentInput;
    }

    showError(msg: string): void {
        this.currentInput = msg;
        this.updateDisplay();
        this.shouldResetDisplay = true;
    }

    addToHistory(expression: string): void {
        this.history.unshift(expression);
        if (this.history.length > 50) this.history = this.history.slice(0, 50);
        this.saveHistory();
    }

    showHistory(): void {
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
            } else {
                this.history.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    historyList.appendChild(li);
                });
            }
        }
        if (modal) modal.style.display = 'block';
    }

    hideHistory(): void {
        const modal = document.getElementById('history-modal');
        if (modal) modal.style.display = 'none';
    }

    clearHistory(): void {
        this.history = [];
        this.saveHistory();
        this.showHistory();
    }

    saveHistory(): void {
        localStorage.setItem('calculator-history', JSON.stringify(this.history));
    }

    loadHistory(): void {
        const saved = localStorage.getItem('calculator-history');
        if (saved) this.history = JSON.parse(saved);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});