/*





*/
const bankDebtReminder = (() => {
  // Constants and Selectors
  const SELECTORS = {
    remaining: '.remaining',
    container: '.container',
    badDebt: '.bad-debt',
    payment: '.payment',
    days: '.days',
    plan: '.plan',
    save: '.save',
    reset: '.reset',
  };

  let currentDebt = localStorage.getItem('standDebt');
  if (currentDebt === null) {
    currentDebt = 70000000;
    localStorage.setItem('standDebt', currentDebt);
  } else {
    currentDebt = Number(currentDebt);
  }

  let outstandingDebt = 0;

  // Helper Functions
  const queryElement = (selector) => document.querySelector(selector);
  const queryElements = (selector) => document.querySelectorAll(selector);
  const formatNumber = (number) => number.toLocaleString('de-DE');

  const parseFormattedNumber = (str) => {
    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
  };

  const updateElementText = (element, text) => {
    if (element) {
      element.innerText = text;
    }
  };

  // DOM Elements
  const remainingElement = queryElement(SELECTORS.remaining);
  const badDebtElement = queryElement(SELECTORS.badDebt);
  const paymentElements = queryElements(SELECTORS.payment);
  const daysElements = queryElements(SELECTORS.days);
  const planElement = queryElement(SELECTORS.plan);
  const saveButton = queryElement(SELECTORS.save);
  const resetButton = queryElement(SELECTORS.reset);

  // Initial Setup
  const initialize = () => {
    console.log(currentDebt);
    if (currentDebt === 0) {
      completeDebtProcess();
    } else {
      outstandingDebt = renderBadDebt(badDebtElement, currentDebt);
    }
    attachEventListeners();
  };

  // Rendering Functions
  const renderBadDebt = (element, debt) => {
    if (typeof debt !== 'number' || isNaN(debt)) {
      debt = '00';
    }
    const formattedDebt = formatNumber(debt);
    updateElementText(element, formattedDebt);
    renderDays(debt);
    return debt;
  };

  const renderDays = (totalDebt) => {
    paymentElements.forEach((payment, index) => {
      const paymentValue = parseFormattedNumber(payment.innerText) || 0;
      const days = Math.ceil(totalDebt / (paymentValue * 1000)) || 0;
      updateElementText(daysElements[index], days);
    });
  };

  // Event Handlers
  const handlePlanInput = (event) => {
    event.preventDefault();
    const sanitizedValue = planElement.value.replace(/[^0-9]/g, '');
    planElement.value = sanitizedValue;

    if (sanitizedValue && outstandingDebt !== 0) {
      const remainingDebt = outstandingDebt - parseFloat(sanitizedValue);
      updateElementText(remainingElement, formatNumber(Math.max(remainingDebt, 0)));
      renderDays(Math.max(remainingDebt, 0));
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    const remainingText = remainingElement.innerText;
    const remainingValue = parseFormattedNumber(remainingText) || 0;
    if (remainingValue !== 0) {
      localStorage.setItem('standDebt', remainingValue);
      currentDebt = remainingValue;
      outstandingDebt = renderBadDebt(badDebtElement, currentDebt);
      updateElementText(remainingElement, '0000');
    } else {
      completeDebtProcess();
    }
    planElement.focus();
  };

  const handleReset = (event) => {
    event.preventDefault();
    const planValue = parseFloat(planElement.value.replace(/[^0-9]/g, '')) || 0;
    if (planValue > 0) {
      currentDebt = planValue;
      outstandingDebt = renderBadDebt(badDebtElement, currentDebt);
      updateElementText(remainingElement, '0000');
      if (confirm('Are you sure you want to add this item locally?')) {
        localStorage.setItem('standDebt', planElement.value);
        planElement.focus();
      }
      checkIfComplete(outstandingDebt);
    }
  };

  const checkIfComplete = (debt) => {
    if (debt === 0) completeDebtProcess();
  };

  const completeDebtProcess = () => {
    currentDebt = 0;
    outstandingDebt = 0;
    updateElementText(badDebtElement, '0');
    localStorage.setItem('standDebt', '0');
    updateElementText(remainingElement, '0000');

    const containerElement = queryElement(SELECTORS.container);
    badDebtElement.classList.add('complete');
    containerElement.classList.add('complete');
  };

  // Attach Event Listeners
  const attachEventListeners = () => {
    if (planElement) {
      planElement.addEventListener('input', handlePlanInput);
      planElement.addEventListener('focus', () => (planElement.value = ''));
    }
    if (saveButton) {
      saveButton.addEventListener('click', handleSave);
    }
    if (resetButton) {
      resetButton.addEventListener('click', handleReset);
    }
  };

  // Initialize the module
  initialize();
})();
