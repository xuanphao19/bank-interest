/*






*/
const bankDebtReminder = (() => {
  const remaining = document.querySelector('.remaining');
  const badDebt = document.querySelector('.bad-debt');
  const pays = document.querySelectorAll('.payment');
  const days = document.querySelectorAll('.days');
  const plan = document.querySelector('.plan');
  const save = document.querySelector('.save');
  const reset = document.querySelector('.reset');
  let standDebt = localStorage.getItem('standDebt'),
    outsValue = 0;

  const renderBadDebt = (element, total, pays, days) => {
    if (element && total) {
      element.innerText = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    renderDays(pays, days, total);
    return total;
  };

  const renderDays = (pays, days, total) => {
    pays.forEach((pay, i) => {
      days[i].innerText = Math.ceil(total / (pay.innerText * 1000));
    });
  };

  if (standDebt === null) {
    localStorage.setItem('standDebt', 70000000);
    standDebt = localStorage.getItem('standDebt');
  }

  if (badDebt && standDebt) {
    outsValue = Number(renderBadDebt(badDebt, standDebt, pays, days));
  }

  if (plan) {
    plan.oninput = (event) => {
      event.preventDefault();
      const value = (plan.value = plan.value.replace(/[^0-9]/g, ''));
      if (value && outsValue !== 0 && remaining) {
        remaining.innerText = outsValue - value;
        renderDays(pays, days, outsValue - value);
      }
    };
    plan.onfocus = () => {
      plan.value = '';
    };
  }

  if (save) {
    save.onclick = () => {
      if (remaining.innerText !== '0000') {
        localStorage.setItem('standDebt', remaining.innerText);
        standDebt = remaining.innerText;
        remaining.innerText = '0000';
        outsValue = Number(renderBadDebt(badDebt, standDebt, pays, days));
      }
      plan.focus();
    };
  }

  if (reset) {
    reset.onclick = (event) => {
      event.preventDefault();
      if (plan.value) {
        outsValue = Number(renderBadDebt(badDebt, plan.value, pays, days));
        remaining.innerText = '0000';
        const isConfirmed = confirm('Are you sure you want to add this item locally?');
        if (isConfirmed) {
          localStorage.setItem('standDebt', plan.value);
          plan.focus();
        }
      }
    };
  }
})();
