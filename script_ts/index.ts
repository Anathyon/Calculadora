interface Calculator {
    display: HTMLInputElement;
    currentInput: string;
    operator: string | null;
    previousInput: string | null;
    shouldResetDisplay: boolean;
    history: string[];
}

class ScientificCalculator implements Calculator {
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

    private initializeEventListeners(): void {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                this.handleButtonClick(target.textContent || '');
            });
        });

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
    }

    private handleButtonClick(value: string): void {
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
        } else if (value === '⌫') {
            this.backspace();
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
        return ['+', '-', '×', '/', '%'].includes(value);
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
                if (current === 0) {
                    alert('Erro: Divisão por zero!');
                    return;
                }
                result = prev / current;
                break;
            case '%':
                result = (prev * current) / 100;
                break;
            default:
                return;
        }
        
        const expression = `${this.previousInput} ${this.operator} ${this.currentInput} = ${result}`;
        this.addToHistory(expression);
        
        this.currentInput = result.toString();
        this.operator = null;
        this.previousInput = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    private handleScientificFunction(func: string): void {
        const current = parseFloat(this.currentInput);
        let result: number;
        let expression: string;
        
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
                if (current <= 0) {
                    alert('Erro: Logaritmo de número não positivo!');
                    return;
                }
                result = Math.log10(current);
                expression = `log(${current}) = ${result}`;
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Erro: Logaritmo natural de número não positivo!');
                    return;
                }
                result = Math.log(current);
                expression = `ln(${current}) = ${result}`;
                break;
            case '√':
                if (current < 0) {
                    alert('Erro: Raiz quadrada de número negativo!');
                    return;
                }
                result = Math.sqrt(current);
                expression = `√(${current}) = ${result}`;
                break;
            case 'x²':
                result = current * current;
                expression = `(${current})² = ${result}`;
                break;
            case '1/x':
                if (current === 0) {
                    alert('Erro: Divisão por zero!');
                    return;
                }
                result = 1 / current;
                expression = `1/(${current}) = ${result}`;
                break;
            case 'n!':
                if (current < 0 || !Number.isInteger(current)) {
                    alert('Erro: Fatorial apenas para números inteiros não negativos!');
                    return;
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
            default:
                return;
        }
        
        this.addToHistory(expression);
        this.currentInput = result.toString();
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    private toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private factorial(n: number): number {
        if (n <= 1) return 1;
        return n * this.factorial(n - 1);
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

    private addToHistory(expression: string): void {
        this.history.unshift(expression);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
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
        
        if (modal) {
            modal.style.display = 'block';
        }
    }

    private hideHistory(): void {
        const modal = document.getElementById('history-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    private clearHistory(): void {
        this.history = [];
        this.saveHistory();
        
        const historyList = document.getElementById('history-list');
        if (historyList) {
            historyList.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = 'Histórico limpo';
            li.style.fontStyle = 'italic';
            li.style.opacity = '0.7';
            historyList.appendChild(li);
        }
    }

    private saveHistory(): void {
        localStorage.setItem('calculator-history', JSON.stringify(this.history));
    }

    private loadHistory(): void {
        const saved = localStorage.getItem('calculator-history');
        if (saved) {
            this.history = JSON.parse(saved);
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScientificCalculator();
});