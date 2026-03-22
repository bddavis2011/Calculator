const select = document.getElementById('calc-select');
select.addEventListener('change', function() {
    const selected = this.value;
    document.querySelector('.calc-panel.active').classList.remove('active');
    document.getElementById(selected).classList.add('active');
});



let current = '0';
let previous = null;
let operator = null;
let shouldReset = false;
const stdDisplay = document.querySelector('#std-display');
const sciDisplay = document.querySelector('#sci-display');
const historyPanel = document.getElementById('historyPanel');
const historyEmpty = document.getElementById('historyEmpty');
const historyClear = document.getElementById('historyClear');
const historyToggle = document.querySelector('.history-toggle');
const sciHistoryPanel = document.getElementById('sciHistoryPanel');
const sciHistoryEmpty = document.getElementById('SciHistoryEmpty');
const sciHistoryClear = document.getElementById('SciHistoryClear');
const sciHistoryToggle = document.querySelector('#scientific .history-toggle');  

historyToggle.addEventListener('click', () => {
    historyPanel.classList.toggle('open');
    historyToggle.textContent = historyPanel.classList.contains('open') ? 'Close History' : 'History';
});

sciHistoryToggle.addEventListener('click', () => {
    sciHistoryPanel.classList.toggle('open');
    sciHistoryToggle.textContent = sciHistoryPanel.classList.contains('open') ? 'Close History' : 'History';
});

sciHistoryClear.addEventListener('click', () => {
    sciHistoryPanel.querySelectorAll('.history-entry').forEach(entry => entry.remove());
    sciHistoryEmpty.style.display = 'block';
});

historyClear.addEventListener('click', () => {
    historyPanel.querySelectorAll('.history-entry').forEach(entry => entry.remove());
    historyEmpty.style.display = 'block';
});

function addToHistory(expression, disp, hPanel, hEmpty) {
    hEmpty.style.display = 'none';
    const entry = document.createElement('div');
    entry.classList.add('history-entry');
    entry.textContent = expression;
    entry.addEventListener('click', () => {
    const result = expression.split('=')[1];
    current = result.trim();
    shouldReset = true;
    updateDisplay(disp);    
});

hPanel.insertBefore(entry, hEmpty.nextSibling);
};

function updateDisplay(disp) {
    disp.textContent = current;
}

function handleDigit(val, disp) {
    if (shouldReset) {
        current = val;
        shouldReset = false;
    } else {
        current = current === '0' ? val : current + val;
    }
    updateDisplay(disp);

};

function calculate(disp, hPanel, hEmpty) {
    if (!operator || previous === null) return;

    const a = previous;
    const b = parseFloat(current);
    let result;

    if (operator === '+') result = a + b;
    else if (operator === '-') result = a - b;
    else if (operator === '*') result = a * b;
    else if (operator === '/') {
        if (b === 0) {
            current = 'Error';
            operator = null;
            previous = null;
            shouldReset = true;
            updateDisplay(disp);
            return;
        }; 
        result = a / b;
    };
    const opSymbols = { '+': '+', '-': '-', '*': '×', '/': '÷' };
    const expression = `${a} ${opSymbols[operator]} ${b} = ${result}`;
    addToHistory(expression, disp, hPanel, hEmpty);
    current = result.toString();
    operator = null;
    previous = null;
    shouldReset = true;
    updateDisplay(disp);
}

function handleScientific(fn, disp) {
    const a = parseFloat(current);
    let result;

    if (fn === 'sin') result = Math.sin(a * Math.PI / 180);
    if (fn === 'cos') result = Math.cos(a * Math.PI / 180);
    if (fn === 'tan') result = Math.tan(a * Math.PI / 180);
    if (fn === 'log') result = Math.log10(a);
    if (fn === 'ln') result = Math.log(a);
    if (fn === 'sqrt') result = Math.sqrt(a);
    if (fn === 'square') result = a * a;
    if (fn === 'inv') result = 1 / a;
    if (fn === 'pi') { current = String(Math.PI); updateDisplay(disp); return; };
    if (fn === 'e') { current = String(Math.E); updateDisplay(disp); return; };

    current = String(parseFloat(result.toFixed(10)));
    shouldReset = true;
    updateDisplay(disp);
};

function handleOperator(op, disp, hPanel, hEmpty) {
    if (operator && !shouldReset) {
        calculate(disp, hPanel, hEmpty );
    } 
    previous = parseFloat(current);
    operator = op;
    shouldReset = true;
};

document.querySelectorAll('#scientific button').forEach(button => {
    button.addEventListener('click', () => {
        const disp = sciDisplay;
        const hPanel = sciHistoryPanel;
        const hEmpty = sciHistoryEmpty;
        const action = button.dataset.action;
        const value = button.dataset.value;
        if (action === 'scientific') handleScientific(value, disp);
        if (action === 'digit') handleDigit(value, disp);
        if (action === 'operator') handleOperator(value, disp, hPanel, hEmpty);
        if (action === 'equals') calculate(disp, hPanel, hEmpty);
        if (action === 'clear') {
            current = '0';
            previous = null;
            operator = null;
            shouldReset = false;
            updateDisplay(disp);
        };
        if (action === 'clearCurrent') {
            current = '0';
            updateDisplay(disp);
        };
        if (action === 'decimal') {
            if (!current.includes('.')) {
                current += '.';
                updateDisplay(disp);
            };
        };
        if (action === 'sign') { current = String(parseFloat(current) * -1); updateDisplay(sciDisplay); };
        if (action === 'percent') { current = String(parseFloat(current) / 100); updateDisplay(sciDisplay); }; 
    });
});


document.querySelectorAll('#standard button').forEach(button => {
    button.addEventListener('click', () => {
        const disp = stdDisplay;
        const hPanel = historyPanel;
        const hEmpty = historyEmpty;
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === 'digit') handleDigit(value, disp);
        if (action === 'operator') handleOperator(value, disp, hPanel, hEmpty);
        if (action === 'equals') calculate(disp, hPanel, hEmpty);
        if (action === 'clear') {
            current = '0';
            previous = null;
            operator = null;
            shouldReset = false;
            updateDisplay(disp);
        };
        if (action === 'clearCurrent') {
            current = '0';
            updateDisplay(disp);
        };
        if (action === 'decimal') {
            if (!current.includes('.')) {
                current += '.';
                updateDisplay(disp);
            };
        };
        if (action === 'sign') { current = String(parseFloat(current) * -1); updateDisplay(disp); };
        if (action === 'percent') { current = String(parseFloat(current) / 100); updateDisplay(disp); };
    });
});