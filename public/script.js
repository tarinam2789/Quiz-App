let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timer;
let timeLeft = 60;

if (window.location.pathname.endsWith('quiz.html')) {
  fetchQuestions();
}

async function fetchQuestions() {
  const count = localStorage.getItem('questionCount') || 10;
  const res = await fetch(`/api/questions?count=${count}`);
  
  questions = await res.json();
  startTimer();
  showQuestion();
}

function showQuestion() {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const nextBtn = document.getElementById('nextBtn');

  selectedOption = null;
  nextBtn.disabled = true;
  optionsElement.innerHTML = '';

  const current = questions[currentQuestionIndex];
  questionElement.textContent = current.question;

  // Convert A, B, C, D into a list
  const optionKeys = ['A', 'B', 'C', 'D'];
  optionKeys.forEach(letter => {
    const li = document.createElement('li');
    li.textContent = `${letter}. ${current[letter]}`;
    li.onclick = () => {
      document.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
      li.classList.add('selected');
      selectedOption = letter;
      nextBtn.disabled = false;
    };
    optionsElement.appendChild(li);
  });

  nextBtn.onclick = () => {
    if (selectedOption === current.answer) score++;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      finishQuiz();
    }
  };
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) timerDisplay.textContent = `⏳ Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(timer);
  localStorage.setItem('quizScore', score);
  window.location.href = 'result.html';
}

