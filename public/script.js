document.addEventListener('DOMContentLoaded', () => {
  const caloriesInEl = document.getElementById('calories-in');
  const caloriesOutEl = document.getElementById('calories-out');
  const netCaloriesEl = document.getElementById('net-calories');
  const logListEl = document.getElementById('log-list');

  const caloriesInput = document.getElementById('calories-input');
  const logInBtn = document.getElementById('log-in-btn');

  const caloriesOutInput = document.getElementById('calories-out-input');
  const logOutBtn = document.getElementById('log-out-btn');

  const stepsInput = document.getElementById('steps-input');
  const logStepsBtn = document.getElementById('log-steps-btn');

  async function fetchSummary() {
    const response = await fetch('/summary');
    const data = await response.json();

    caloriesInEl.textContent = data.caloriesIn;
    caloriesOutEl.textContent = data.caloriesOut;
    netCaloriesEl.textContent = data.netCalories;

    logListEl.innerHTML = '';
    data.log.forEach(entry => {
      const item = document.createElement('li');
      const time = new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const emoji = entry.type === 'in' ? '🥗' : '🔥';
      item.textContent = `${emoji} ${entry.amount.toFixed(2)} cal at ${time}`;
      logListEl.appendChild(item);
    });
  }

  async function logData(url, body) {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    fetchSummary();
  }

  logInBtn.addEventListener('click', () => {
    const amount = parseInt(caloriesInput.value, 10);
    if (amount > 0) {
      logData('/log/calories-in', { amount });
      caloriesInput.value = '';
    }
  });

  logOutBtn.addEventListener('click', () => {
    const calories = parseInt(caloriesOutInput.value, 10);
    if (calories > 0) {
      logData('/log/calories-out', { calories });
      caloriesOutInput.value = '';
    }
  });

  logStepsBtn.addEventListener('click', () => {
    const steps = parseInt(stepsInput.value, 10);
    if (steps > 0) {
      logData('/log/calories-out', { steps });
      stepsInput.value = '';
    }
  });

  fetchSummary();
});
