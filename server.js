const express = require('express');
const app = express();
const port = 3000;
const { readLog, writeLog } = require('./database');

app.use(express.json());
app.use(express.static('public'));

app.post('/log/calories-in', (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const log = readLog();
  const newEntry = {
    type: 'in',
    amount,
    timestamp: new Date().toISOString(),
  };
  log.push(newEntry);
  writeLog(log);

  res.status(201).json(newEntry);
});

app.post('/log/calories-out', (req, res) => {
  const { calories, steps } = req.body;
  let amount;

  if (typeof calories === 'number' && calories > 0) {
    amount = calories;
  } else if (typeof steps === 'number' && steps > 0) {
    amount = steps * 0.04;
  } else {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const log = readLog();
  const newEntry = {
    type: 'out',
    amount,
    timestamp: new Date().toISOString(),
  };
  log.push(newEntry);
  writeLog(log);

  res.status(201).json(newEntry);
});

app.get('/summary', (req, res) => {
  const log = readLog();
  const today = new Date().toISOString().slice(0, 10);

  const todayEntries = log.filter(entry => entry.timestamp.slice(0, 10) === today);

  const caloriesIn = todayEntries
    .filter(entry => entry.type === 'in')
    .reduce((total, entry) => total + entry.amount, 0);

  const caloriesOut = todayEntries
    .filter(entry => entry.type === 'out')
    .reduce((total, entry) => total + entry.amount, 0);

  const netCalories = caloriesIn - caloriesOut;

  res.json({
    caloriesIn,
    caloriesOut,
    netCalories,
    log: todayEntries,
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
