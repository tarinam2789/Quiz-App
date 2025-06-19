let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timer;
let timeLeft = 60;
let quizEnded = false;

if (window.location.pathname.endsWith('quiz.html')) {
  fetchQuestions();
}

async function fetchQuestions() {
  const count = parseInt(localStorage.getItem('questionCount')) || 10;

  try {
    const res = await fetch('/questions.json');
    const allQuestions = await res.json();

    // Shuffle and pick 'count' questions
    questions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, count);

    startTimer();
    showQuestion();
  } catch (error) {
    console.error("Failed to load questions:", error);
    document.getElementById('question').textContent = "❌ Failed to load questions.";
  }
}

function showQuestion() {
  if (quizEnded) return; // stop showing questions if quiz ended

  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const nextBtn = document.getElementById('nextBtn');
  const feedbackElement = document.getElementById('feedback');

  selectedOption = null;
  nextBtn.disabled = true;
  optionsElement.innerHTML = '';
  feedbackElement.textContent = '';

  const current = questions[currentQuestionIndex];
  questionElement.textContent = current.question;

  const optionKeys = ['A', 'B', 'C', 'D'];
  optionKeys.forEach(letter => {
    const li = document.createElement('li');
    li.textContent = `${letter}. ${current[letter]}`;
    li.onclick = () => {
      document.querySelectorAll('li').forEach(el => el.classList.remove('selected'));
      li.classList.add('selected');
      selectedOption = letter;
      nextBtn.disabled = false;
      feedbackElement.textContent = ''; // clear previous feedback
    };
    optionsElement.appendChild(li);
  });

  nextBtn.onclick = () => {
    if (!selectedOption) return;

    if (selectedOption === current.answer) {
      score++;
      feedbackElement.textContent = '✅ Correct!';
      feedbackElement.style.color = 'green';
    } else {
      feedbackElement.textContent = `❌ Wrong! Correct answer is ${current.answer}`;
      feedbackElement.style.color = 'red';
    }

    nextBtn.disabled = true; // prevent double clicks

    // Delay before next question to show feedback
    setTimeout(() => {
      currentQuestionIndex++;

      if (currentQuestionIndex < questions.length) {
        showQuestion();
      } else {
        finishQuiz();
      }
    }, 1000);
  };
}

function startTimer() {
  const timerDisplay = document.getElementById('timer');
  timerDisplay.textContent = `⏳ Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    if (quizEnded) {
      clearInterval(timer);
      return;
    }

    timeLeft--;
    timerDisplay.textContent = `⏳ Time Left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  quizEnded = true;
  clearInterval(timer);

  // Disable next button so user can't continue
  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.disabled = true;

  localStorage.setItem('quizScore', score);
  window.location.href = 'result.html';
}
