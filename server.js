const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const questionsData = JSON.parse(fs.readFileSync('questions.json'));

app.get('/api/questions', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const shuffled = questionsData.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  res.json(selected);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
