interface Calculator {
    display: HTMLInputElement;
    currentInput: string;
    operator: string | null;
    previousInput: string | null;
    shouldResetDisplay: boolean;
    history: string[];
    isScientificMode: boolean;
}

class ScientificCalculator implements Calculator {
    display: HTMLInputElement;
    currentInput: string = "0";
    operator: string | null = null;
    previousInput: string | null = null;
    shouldResetDisplay: boolean = false;
    history: string[] = [];
    isScientificMode: boolean = true;

    private readonly MAX_HISTORY = 50;
    private readonly PRECISION = 10;
    private readonly MODE_KEY = 'calculator-mode';

    constructor() {
        this.display = document.getElementById('display') as HTMLInputElement;
        this.initializeEventListeners();
        this.loadHistory();
        this.loadMode();
    }

    private initializeEventListeners(): void {
        // Button clicks
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });

        // Mode toggle
        const modeToggle = document.getElementById('mode-toggle') as HTMLInputElement;
        modeToggle?.addEventListener('change', () => this.toggleMode());

        // Modal controls
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

        // Keyboard support
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }

    private toggleMode(): void {
        const modeToggle = document.getElementById('mode-toggle') as HTMLInputElement;
        if (modeToggle) {
            this.isScientificMode = modeToggle.checked;
            this.applyMode();
            this.saveMode();
        }
    }

    private applyMode(): void {
        const container = document.querySelector('.calculator-container');
        const modeToggle = document.getElementById('mode-toggle') as HTMLInputElement;

        if (this.isScientificMode) {
            container?.classList.remove('simple-mode');
            if (modeToggle) modeToggle.checked = true;
        } else {
            container?.classList.add('simple-mode');
            if (modeToggle) modeToggle.checked = false;
        }
    }

    private saveMode(): void {
        localStorage.setItem(this.MODE_KEY, this.isScientificMode ? 'scientific' : 'simple');
    }

    private loadMode(): void {
        const savedMode = localStorage.getItem(this.MODE_KEY);
        this.isScientificMode = savedMode !== 'simple'; // Default to scientific
        this.applyMode();
    }

    private handleButtonClick(e: Event): void {
        const target = e.target as HTMLElement;
        const button = target.closest('.btn') as HTMLElement;
        if (!button) return;

        const value = button.textContent?.trim() || '';
        const isDelete = button.classList.contains('btn-delete');

        if (isDelete) {
            this.backspace();
        } else {
            this.processInput(value);
        }
    }

    private handleKeyboard(e: KeyboardEvent): void {
        const key = e.key;

        if (/\d/.test(key)) this.inputNumber(key);
        else if (['+', '-', '*', '/', '%'].includes(key)) this.inputOperator(key === '*' ? '×' : key);
        else if (key === 'Enter' || key === '=') this.calculate();
        else if (key === 'Backspace') this.backspace();
        else if (key === 'Escape') this.clear();
        else if (key === '.') this.inputNumber('.');
    }

    private processInput(value: string): void {
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

    private isNumber(value: string): boolean {
        return /^\d$/.test(value);
    }

    private isBasicOperator(value: string): boolean {
        return ['+', '-', '×', '/', '%', '^'].includes(value);
    }

    private inputNumber(num: string): void {
        if (num === '.' && this.currentInput.includes('.')) return;

        if (this.shouldResetDisplay) {
            this.currentInput = num === '.' ? '0.' : num;
            this.shouldResetDisplay = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    private inputOperator(op: string): void {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        this.previousInput = this.currentInput;
        this.operator = op;
        this.shouldResetDisplay = true;
    }

    private calculate(): void {
        if (!this.operator || !this.previousInput) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result: number;

        try {
            switch (this.operator) {
                case '+': result = prev + current; break;
                case '-': result = prev - current; break;
                case '×': result = prev * current; break;
                case '/':
                    if (current === 0) throw new Error('Divisão por zero');
                    result = prev / current;
                    break;
                case '%': result = (prev * current) / 100; break;
                case '^': result = Math.pow(prev, current); break;
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

        } catch (error) {
            this.showError('Erro');
        }
    }

    private handleScientificFunction(func: string): void {
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
                    if (current <= 0) throw new Error('Logaritmo inválido');
                    result = Math.log10(current);
                    expression = `log(${current}) = ${result}`;
                    break;
                case 'ln':
                    if (current <= 0) throw new Error('Logaritmo inválido');
                    result = Math.log(current);
                    expression = `ln(${current}) = ${result}`;
                    break;
                case '√':
                    if (current < 0) throw new Error('Raiz inválida');
                    result = Math.sqrt(current);
                    expression = `√(${current}) = ${result}`;
                    break;
                case 'x²':
                    result = Math.pow(current, 2);
                    expression = `(${current})² = ${result}`;
                    break;
                case '1/x':
                    if (current === 0) throw new Error('Divisão por zero');
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

        } catch (error) {
            this.showError('Erro');
        }
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private factorial(n: number): number {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    private roundToPrecision(num: number): number {
        return Math.round(num * Math.pow(10, this.PRECISION)) / Math.pow(10, this.PRECISION);
    }

    private toggleSign(): void {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-')
                ? this.currentInput.slice(1)
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }

    private clear(): void {
        this.currentInput = '0';
        this.updateDisplay();
    }

    private clearAll(): void {
        this.currentInput = '0';
        this.operator = null;
        this.previousInput = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    private backspace(): void {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    private updateDisplay(): void {
        this.display.value = this.currentInput;
    }

    private showError(msg: string): void {
        this.currentInput = msg;
        this.updateDisplay();
        this.shouldResetDisplay = true;
    }

    private addToHistory(expression: string): void {
        this.history.unshift(expression);
        if (this.history.length > this.MAX_HISTORY) {
            this.history = this.history.slice(0, this.MAX_HISTORY);
        }
        this.saveHistory();
    }

    private showHistory(): void {
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

    private hideHistory(): void {
        const modal = document.getElementById('history-modal');
        if (modal) modal.style.display = 'none';
    }

    private clearHistory(): void {
        this.history = [];
        this.saveHistory();
        this.showHistory();
    }

    private saveHistory(): void {
        try {
            localStorage.setItem('calculator-history', JSON.stringify(this.history));
        } catch (error) {
            console.warn('Não foi possível salvar o histórico:', error);
        }
    }

    private loadHistory(): void {
        try {
            const saved = localStorage.getItem('calculator-history');
            if (saved) this.history = JSON.parse(saved);
        } catch (error) {
            console.warn('Não foi possível carregar o histórico:', error);
            this.history = [];
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});