const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'log.json');

function readLog() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function writeLog(log) {
  fs.writeFileSync(dataPath, JSON.stringify(log, null, 2));
}

module.exports = {
  readLog,
  writeLog,
};
