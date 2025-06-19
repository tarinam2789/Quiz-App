// const express = require('express');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const PORT = 3000;

// app.use(express.static(path.join(__dirname, 'public')));

// const questionsData = JSON.parse(fs.readFileSync('questions.json'));

// app.get('/api/questions', (req, res) => {
//   const count = parseInt(req.query.count) || 10;
//   const shuffled = questionsData.sort(() => 0.5 - Math.random());
//   const selected = shuffled.slice(0, count);
//   res.json(selected);
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });



const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve everything inside public/ as static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Read the questions.json from the public folder
const questionsPath = path.join(__dirname, 'public', 'questions.json');
const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));

app.get('/api/questions', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const shuffled = questionsData.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  res.json(selected);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
