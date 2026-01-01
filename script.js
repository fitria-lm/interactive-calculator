"use strict";

// Calculator Module dengan IIFE untuk encapsulation
const Calculator = (function() {
    // State kalkulator
    let state = {
        expression: '',
        result: '0',
        lastResult: null,
        memory: 0,
        isScientificMode: false,
        isDarkTheme: false,
        history: [],
        isNewExpression: true,
        decimalEntered: false,
        maxLength: 20
    };

    // Operator precedence untuk evaluasi
    const precedence = {
        '+': 1,
        '-': 1,
        '×': 2,
        '*': 2,
        '÷': 2,
        '/': 2,
        '%': 3
    };

    // Inisialisasi dari localStorage
    function init() {
        const savedTheme = localStorage.getItem('calculator-theme');
        const savedHistory = localStorage.getItem('calculator-history');
        const savedMemory = localStorage.getItem('calculator-memory');
        const savedScientificMode = localStorage.getItem('calculator-scientific-mode');
        
        if (savedTheme === 'dark') {
            state.isDarkTheme = true;
            document.body.classList.add('dark-theme');
        }
        
        if (savedHistory) {
            try {
                state.history = JSON.parse(savedHistory);
                if (!Array.isArray(state.history)) state.history = [];
            } catch (e) {
                state.history = [];
            }
        }
        
        if (savedMemory) {
            state.memory = parseFloat(savedMemory) || 0;
        }
        
        if (savedScientificMode === 'true') {
            state.isScientificMode = true;
            document.body.classList.add('scientific-mode');
        }
        
        updateHistoryCount();
    }

    // Fungsi untuk menyimpan state ke localStorage
    function saveToLocalStorage() {
        localStorage.setItem('calculator-theme', state.isDarkTheme ? 'dark' : 'light');
        localStorage.setItem('calculator-history', JSON.stringify(state.history));
        localStorage.setItem('calculator-memory', state.memory.toString());
        localStorage.setItem('calculator-scientific-mode', state.isScientificMode.toString());
    }

    // Validasi ekspresi matematika
    function isValidExpression(expr) {
        // Cek panjang maksimal
        if (expr.length > state.maxLength) return false;
        
        // Cek kurung seimbang
        let balance = 0;
        for (let char of expr) {
            if (char === '(') balance++;
            if (char === ')') balance--;
            if (balance < 0) return false; // Kurung tutup sebelum kurung buka
        }
        if (balance !== 0) return false; // Kurung tidak seimbang
        
        // Cek operator ganda (tidak boleh ++, --, **, //, ××, ÷÷)
        const operatorRegex = /[+\-×÷*/]{2,}/;
        if (operatorRegex.test(expr)) return false;
        
        // Cek titik desimal ganda dalam satu angka
        const decimalRegex = /\d+\.\d+\./;
        if (decimalRegex.test(expr)) return false;
        
        // Ekspresi tidak boleh berakhir dengan operator
        const endsWithOperator = /[+\-×÷*/%(]$/;
        if (endsWithOperator.test(expr)) return false;
        
        return true;
    }

    // Parse ekspresi menjadi token
    function tokenize(expression) {
        const tokens = [];
        let currentNumber = '';
        
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            if (char >= '0' && char <= '9' || char === '.') {
                currentNumber += char;
            } else {
                if (currentNumber) {
                    tokens.push(currentNumber);
                    currentNumber = '';
                }
                
                if (char !== ' ') {
                    tokens.push(char);
                }
            }
        }
        
        if (currentNumber) {
            tokens.push(currentNumber);
        }
        
        return tokens;
    }

    // Konversi infix ke postfix (Shunting Yard Algorithm)
    function infixToPostfix(tokens) {
        const output = [];
        const operators = [];
        
        for (let token of tokens) {
            // Jika token adalah angka
            if (!isNaN(parseFloat(token)) || token === '.') {
                output.push(parseFloat(token));
            }
            // Jika token adalah operator
            else if (token in precedence) {
                while (operators.length > 0 && 
                       operators[operators.length - 1] !== '(' &&
                       precedence[operators[operators.length - 1]] >= precedence[token]) {
                    output.push(operators.pop());
                }
                operators.push(token);
            }
            // Jika token adalah kurung buka
            else if (token === '(') {
                operators.push(token);
            }
            // Jika token adalah kurung tutup
            else if (token === ')') {
                while (operators.length > 0 && operators[operators.length - 1] !== '(') {
                    output.push(operators.pop());
                }
                operators.pop(); // Buang kurung buka
            }
        }
        
        // Sisa operator
        while (operators.length > 0) {
            output.push(operators.pop());
        }
        
        return output;
    }

    // Evaluasi ekspresi postfix
    function evaluatePostfix(postfix) {
        const stack = [];
        
        for (let token of postfix) {
            if (typeof token === 'number') {
                stack.push(token);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                
                switch (token) {
                    case '+': stack.push(a + b); break;
                    case '-': stack.push(a - b); break;
                    case '×':
                    case '*': stack.push(a * b); break;
                    case '÷':
                    case '/': 
                        if (b === 0) throw new Error('Pembagian dengan nol');
                        stack.push(a / b); 
                        break;
                    case '%': stack.push(a % b); break;
                }
            }
        }
        
        return stack[0];
    }

    // Evaluasi ekspresi matematika
    function evaluateExpression(expression) {
        if (!expression.trim()) return 0;
        
        if (!isValidExpression(expression)) {
            throw new Error('Ekspresi tidak valid');
        }
        
        // Normalisasi operator
        let normalizedExpr = expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // Handle persen (%)
        normalizedExpr = normalizedExpr.replace(/(\d+(\.\d+)?)%/g, (match, num) => {
            return `(${num}/100)`;
        });
        
        // Handle toggle sign (±)
        normalizedExpr = normalizedExpr.replace(/±/g, '*-1');
        
        try {
            // Tokenisasi
            const tokens = tokenize(normalizedExpr);
            
            // Konversi ke postfix
            const postfix = infixToPostfix(tokens);
            
            // Evaluasi
            const result = evaluatePostfix(postfix);
            
            // Handle floating point precision
            if (Math.abs(result) < 1e-10) return 0;
            
            return parseFloat(result.toFixed(10));
        } catch (error) {
            throw new Error('Error dalam evaluasi: ' + error.message);
        }
    }

    // Tambah input ke ekspresi
    function appendToExpression(value) {
        // Jika ekspresi baru, reset
        if (state.isNewExpression) {
            state.expression = '';
            state.isNewExpression = false;
            state.decimalEntered = false;
        }
        
        // Validasi input
        const lastChar = state.expression.slice(-1);
        
        // Cek untuk mencegah multiple decimal points
        if (value === '.') {
            if (state.decimalEntered && !isNaN(lastChar)) {
                return state.expression; // Jangan tambah titik jika sudah ada
            }
            state.decimalEntered = true;
        }
        
        // Reset decimal flag jika operator
        if ('+-×÷%'.includes(value)) {
            state.decimalEntered = false;
        }
        
        // Cek panjang maksimal
        if (state.expression.length >= state.maxLength) {
            showNotification('Maksimum panjang input tercapai');
            return state.expression;
        }
        
        // Tambah ke ekspresi
        state.expression += value;
        return state.expression;
    }

    // Hitung hasil
    function calculate() {
        if (!state.expression.trim()) {
            state.result = '0';
            return;
        }
        
        try {
            const result = evaluateExpression(state.expression);
            state.lastResult = result;
            state.result = result.toString();
            
            // Tambah ke history
            addToHistory(state.expression, result);
            
            // Reset untuk ekspresi baru
            state.isNewExpression = true;
        } catch (error) {
            state.result = 'Error';
            showNotification(error.message);
        }
    }

    // Clear semua
    function clearAll() {
        state.expression = '';
        state.result = '0';
        state.isNewExpression = true;
        state.decimalEntered = false;
    }

    // Clear entry terakhir
    function clearEntry() {
        if (state.isNewExpression) {
            clearAll();
        } else {
            // Hapus karakter terakhir
            state.expression = state.expression.slice(0, -1);
            
            // Reset jika kosong
            if (state.expression === '') {
                state.result = '0';
                state.isNewExpression = true;
            }
        }
    }

    // Toggle tanda positif/negatif
    function toggleSign() {
        if (state.isNewExpression && state.result !== '0') {
            const num = parseFloat(state.result);
            state.result = (-num).toString();
            state.lastResult = -num;
        } else if (state.expression) {
            // Cari angka terakhir dalam ekspresi
            const regex = /(-?\d+(\.\d+)?)$/;
            const match = state.expression.match(regex);
            
            if (match) {
                const num = parseFloat(match[0]);
                const newNum = -num;
                state.expression = state.expression.replace(regex, newNum.toString());
            } else {
                state.expression = '(-' + state.expression + ')';
            }
        }
    }

    // Tambah ke history
    function addToHistory(expression, result) {
        const historyItem = {
            expression,
            result,
            timestamp: new Date().toISOString()
        };
        
        state.history.unshift(historyItem);
        
        // Simpan hanya 10 item terakhir
        if (state.history.length > 10) {
            state.history = state.history.slice(0, 10);
        }
        
        updateHistoryCount();
        saveToLocalStorage();
    }

    // Clear history
    function clearHistory() {
        state.history = [];
        updateHistoryCount();
        saveToLocalStorage();
    }

    // Export history sebagai JSON
    function exportHistory() {
        const dataStr = JSON.stringify(state.history, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'calculator-history.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import history dari JSON
    function importHistory(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const importedHistory = JSON.parse(e.target.result);
                
                if (Array.isArray(importedHistory)) {
                    state.history = importedHistory.slice(0, 10); // Batasi 10 item
                    updateHistoryCount();
                    saveToLocalStorage();
                    showNotification('History berhasil diimport');
                } else {
                    showNotification('Format file tidak valid');
                }
            } catch (error) {
                showNotification('Error membaca file: ' + error.message);
            }
        };
        
        reader.readAsText(file);
    }

    // Update history count display
    function updateHistoryCount() {
        const countElement = document.getElementById('historyCount');
        if (countElement) {
            countElement.textContent = state.history.length;
        }
    }

    // Toggle theme
    function toggleTheme() {
        state.isDarkTheme = !state.isDarkTheme;
        
        if (state.isDarkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        saveToLocalStorage();
    }

    // Toggle scientific mode
    function toggleScientificMode() {
        state.isScientificMode = !state.isScientificMode;
        
        if (state.isScientificMode) {
            document.body.classList.add('scientific-mode');
        } else {
            document.body.classList.remove('scientific-mode');
        }
        
        saveToLocalStorage();
    }

    // Fungsi scientific
    function scientificFunction(func, value = null) {
        let num = value !== null ? value : parseFloat(state.result);
        
        if (isNaN(num)) {
            showNotification('Nilai tidak valid');
            return;
        }
        
        let result;
        
        switch (func) {
            case 'sqrt':
                if (num < 0) {
                    showNotification('Akar dari bilangan negatif tidak valid');
                    return;
                }
                result = Math.sqrt(num);
                break;
            case 'power':
                result = Math.pow(num, 2);
                break;
            case 'sin':
                result = Math.sin(num * Math.PI / 180); // Konversi ke radian
                break;
            case 'cos':
                result = Math.cos(num * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(num * Math.PI / 180);
                break;
            case 'log':
                if (num <= 0) {
                    showNotification('Log dari bilangan non-positif tidak valid');
                    return;
                }
                result = Math.log10(num);
                break;
            default:
                return;
        }
        
        state.result = parseFloat(result.toFixed(10)).toString();
        state.lastResult = result;
        state.isNewExpression = true;
        
        addToHistory(`${func}(${num})`, result);
    }

    // Fungsi memory
    function memoryFunction(action) {
        const currentValue = parseFloat(state.result);
        
        if (isNaN(currentValue)) {
            showNotification('Nilai tidak valid untuk operasi memory');
            return;
        }
        
        switch (action) {
            case 'memory-clear':
                state.memory = 0;
                showNotification('Memory cleared');
                break;
            case 'memory-recall':
                state.expression = state.memory.toString();
                state.result = state.memory.toString();
                state.isNewExpression = true;
                break;
            case 'memory-add':
                state.memory += currentValue;
                showNotification(`Added ${currentValue} to memory`);
                break;
            case 'memory-subtract':
                state.memory -= currentValue;
                showNotification(`Subtracted ${currentValue} from memory`);
                break;
        }
        
        saveToLocalStorage();
    }

    // Copy result ke clipboard
    function copyToClipboard() {
        navigator.clipboard.writeText(state.result)
            .then(() => showNotification('Hasil disalin ke clipboard'))
            .catch(err => showNotification('Gagal menyalin: ' + err));
    }

    // Show notification
    function showNotification(message) {
        // Buat element notification jika belum ada
        let notification = document.getElementById('notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Public API
    return {
        init,
        getState: () => ({ ...state }),
        appendToExpression,
        calculate,
        clearAll,
        clearEntry,
        toggleSign,
        clearHistory,
        exportHistory,
        importHistory,
        toggleTheme,
        toggleScientificMode,
        scientificFunction,
        memoryFunction,
        copyToClipboard,
        showNotification
    };
})();

// UI Handler Module
const UIHandler = (function() {
    // DOM Elements
    let elements = {};
    
    // Inisialisasi UI
    function init() {
        cacheElements();
        bindEvents();
        Calculator.init();
        render();
    }
    
    // Cache DOM elements
    function cacheElements() {
        elements = {
            expressionDisplay: document.getElementById('expressionDisplay'),
            resultDisplay: document.getElementById('resultDisplay'),
            memoryIndicator: document.getElementById('memoryIndicator'),
            historyList: document.getElementById('historyList'),
            historyPanel: document.getElementById('historyPanel'),
            historyCount: document.getElementById('historyCount'),
            themeToggle: document.getElementById('themeToggle'),
            historyToggle: document.getElementById('historyToggle'),
            clearHistory: document.getElementById('clearHistory'),
            exportHistory: document.getElementById('exportHistory'),
            importHistory: document.getElementById('importHistory'),
            importFile: document.getElementById('importFile'),
            scientificToggle: document.getElementById('scientificToggle'),
            currentMode: document.getElementById('currentMode'),
            buttonsGrid: document.querySelector('.buttons-grid')
        };
    }
    
    // Bind event listeners
    function bindEvents() {
        // Event delegation untuk tombol kalkulator
        elements.buttonsGrid.addEventListener('click', handleButtonClick);
        
        // Toggle theme
        elements.themeToggle.addEventListener('click', () => {
            Calculator.toggleTheme();
            updateThemeDisplay();
        });
        
        // Toggle history panel
        elements.historyToggle.addEventListener('click', toggleHistoryPanel);
        
        // Clear history
        elements.clearHistory.addEventListener('click', () => {
            Calculator.clearHistory();
            renderHistory();
        });
        
        // Export history
        elements.exportHistory.addEventListener('click', () => {
            Calculator.exportHistory();
        });
        
        // Import history
        elements.importHistory.addEventListener('click', () => {
            elements.importFile.click();
        });
        
        elements.importFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                Calculator.importHistory(e.target.files[0]);
                renderHistory();
                e.target.value = ''; // Reset input file
            }
        });
        
        // Toggle scientific mode
        elements.scientificToggle.addEventListener('click', () => {
            Calculator.toggleScientificMode();
            updateScientificModeDisplay();
        });
        
        // Keyboard support
        document.addEventListener('keydown', handleKeyboardInput);
        
        // Initial render
        updateThemeDisplay();
        updateScientificModeDisplay();
    }
    
    // Handle button clicks
    function handleButtonClick(e) {
        const button = e.target.closest('.btn');
        if (!button) return;
        
        // Animation feedback
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 200);
        
        const number = button.getAttribute('data-number');
        const action = button.getAttribute('data-action');
        
        if (number !== null) {
            // Input angka
            Calculator.appendToExpression(number);
        } else if (action) {
            // Action buttons
            handleAction(action);
        }
        
        render();
    }
    
    // Handle action buttons
    function handleAction(action) {
        switch (action) {
            case 'clear':
                Calculator.clearAll();
                break;
            case 'clear-entry':
                Calculator.clearEntry();
                break;
            case 'backspace':
                Calculator.clearEntry();
                break;
            case 'equals':
                Calculator.calculate();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'percent':
                Calculator.appendToExpression(getOperatorSymbol(action));
                break;
            case 'decimal':
                Calculator.appendToExpression('.');
                break;
            case 'toggle-sign':
                Calculator.toggleSign();
                break;
            case 'open-parenthesis':
                Calculator.appendToExpression('(');
                break;
            case 'close-parenthesis':
                Calculator.appendToExpression(')');
                break;
            case 'sqrt':
            case 'power':
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
                Calculator.scientificFunction(action);
                break;
            case 'memory-clear':
            case 'memory-recall':
            case 'memory-add':
            case 'memory-subtract':
                Calculator.memoryFunction(action);
                break;
            case 'copy':
                Calculator.copyToClipboard();
                break;
        }
    }
    
    // Get operator symbol
    function getOperatorSymbol(action) {
        const symbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷',
            'percent': '%'
        };
        return symbols[action] || action;
    }
    
    // Handle keyboard input
    function handleKeyboardInput(e) {
        e.preventDefault();
        
        const key = e.key;
        const state = Calculator.getState();
        
        // Angka 0-9
        if (key >= '0' && key <= '9') {
            Calculator.appendToExpression(key);
            render();
        }
        // Operator
        else if (key === '+') {
            Calculator.appendToExpression('+');
            render();
        }
        else if (key === '-') {
            Calculator.appendToExpression('-');
            render();
        }
        else if (key === '*' || key === 'x') {
            Calculator.appendToExpression('×');
            render();
        }
        else if (key === '/') {
            Calculator.appendToExpression('÷');
            render();
        }
        else if (key === '%') {
            Calculator.appendToExpression('%');
            render();
        }
        // Decimal point
        else if (key === '.') {
            Calculator.appendToExpression('.');
            render();
        }
        // Equals / Enter
        else if (key === '=' || key === 'Enter') {
            Calculator.calculate();
            render();
        }
        // Clear / Escape
        else if (key === 'Escape' || key === 'Delete') {
            Calculator.clearAll();
            render();
        }
        // Backspace
        else if (key === 'Backspace') {
            Calculator.clearEntry();
            render();
        }
        // Parentheses
        else if (key === '(') {
            Calculator.appendToExpression('(');
            render();
        }
        else if (key === ')') {
            Calculator.appendToExpression(')');
            render();
        }
    }
    
    // Toggle history panel
    function toggleHistoryPanel() {
        elements.historyPanel.classList.toggle('hidden');
        if (window.innerWidth <= 900) {
            elements.historyPanel.classList.toggle('hidden-mobile');
        }
    }
    
    // Update theme display
    function updateThemeDisplay() {
        const state = Calculator.getState();
        elements.currentMode.textContent = state.isDarkTheme ? 'Dark Mode' : 'Light Mode';
    }
    
    // Update scientific mode display
    function updateScientificModeDisplay() {
        const state = Calculator.getState();
        const span = elements.scientificToggle.querySelector('span');
        span.textContent = state.isScientificMode ? 'ON' : 'OFF';
    }
    
    // Render UI
    function render() {
        const state = Calculator.getState();
        
        // Update display
        elements.expressionDisplay.textContent = state.expression || ' ';
        elements.resultDisplay.textContent = state.result;
        
        // Add error class if result is error
        if (state.result === 'Error') {
            elements.resultDisplay.classList.add('error');
        } else {
            elements.resultDisplay.classList.remove('error');
        }
        
        // Update memory indicator
        if (state.memory !== 0) {
            elements.memoryIndicator.innerHTML = `<i class="fas fa-memory"></i> M: ${state.memory}`;
        } else {
            elements.memoryIndicator.textContent = '';
        }
        
        // Update history
        renderHistory();
    }
    
    // Render history
    function renderHistory() {
        const state = Calculator.getState();
        const historyList = elements.historyList;
        
        if (state.history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">Belum ada riwayat perhitungan</p>';
            return;
        }
        
        historyList.innerHTML = '';
        
        state.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                Calculator.appendToExpression(item.expression);
                render();
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    // Public API
    return {
        init
    };
})();

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    UIHandler.init();
});