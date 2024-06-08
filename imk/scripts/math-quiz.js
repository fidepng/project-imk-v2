// math-quiz.js
const questions = [
  {
    question: "Berapa hasil dari {0} - {1}?",
    answerOperands: [12, 7],
    answers: [
      { text: 3, correct: false },
      { text: 5, correct: true },
      { text: 7, correct: false },
      { text: 9, correct: false },
    ],
  },
  {
    question: "Berapa hasil dari {0} × {1}?",
    answerOperands: [4, 6],
    answers: [
      { text: 18, correct: false },
      { text: 22, correct: false },
      { text: 24, correct: true },
      { text: 28, correct: false },
    ],
  },
  {
    question: "Berapa hasil dari {0} ÷ {1}?",
    answerOperands: [15, 3],
    answers: [
      { text: 3, correct: false },
      { text: 5, correct: true },
      { text: 6, correct: false },
      { text: 7, correct: false },
    ],
  },
  {
    question: "Berapa hasil dari {0} - {1} × {2}?",
    answerOperands: [20, 3, 4],
    answers: [
      { text: 8, correct: true },
      { text: 10, correct: false },
      { text: 12, correct: false },
      { text: 14, correct: false },
    ],
  },
  {
    question: "Berapa hasil dari {0} + {1} - {2}?",
    answerOperands: [15, 7, 9],
    answers: [
      { text: 11, correct: false },
      { text: 13, correct: true },
      { text: 15, correct: false },
      { text: 17, correct: false },
    ],
  },
  {
    question: "Berapa hasil dari {0} + {1}?",
    answerOperands: [9, 7],
    answers: [
      { text: 16, correct: true },
      { text: 15, correct: false },
      { text: 14, correct: false },
      { text: 17, correct: false },
    ],
  },
  {
    question: "Berapa hasil dari {0} ÷ {1} × {2}?",
    answerOperands: [18, 3, 2],
    answers: [
      { text: 6, correct: false },
      { text: 8, correct: false },
      { text: 10, correct: false },
      { text: 12, correct: true },
    ],
  },
  {
    question: "Berapa hasil dari {0} x {1}?",
    answerOperands: [10, 2],
    answers: [
      { text: 15, correct: false },
      { text: 21, correct: false },
      { text: 23, correct: false },
      { text: 20, correct: true },
    ],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = new Array(questions.length).fill(false);
let selectedAnswers = new Array(questions.length).fill(null);

const questionContainer = document.getElementById("question-container");
const answerOptions = document.getElementById("answer-options");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const scoreModal = new bootstrap.Modal(document.getElementById("scoreModal"));

const questionTimers = {}; // Objek untuk menyimpan timer setiap pertanyaan

// Fungsi Utama
document.addEventListener("DOMContentLoaded", init);

function init() {
  displayQuestion();
  displayQuestionNumbers();
  initEventListeners();
  startLoading();
}

function startLoading() {
  document.body.insertAdjacentHTML("afterbegin", '<div class="loading"></div>');
  setTimeout(() => {
    document.querySelector(".loading").remove();
    initTimer(currentQuestionIndex);
  }, 1500);
}

function initEventListeners() {
  prevBtn.addEventListener("click", showPreviousQuestion);
  nextBtn.addEventListener("click", () =>
    currentQuestionIndex === questions.length - 1
      ? handleFinishClick()
      : showNextQuestion()
  );
  document
    .querySelector(".modal-footer .btn-primary")
    .addEventListener("click", restartQuiz);
  [prevBtn, nextBtn].forEach((btn) =>
    btn.addEventListener("click", removeWarning)
  );
}

// Fungsi Tampilan
function displayQuestion() {
  const currentQuestion = generateQuestion();
  questionContainer.innerHTML = `<p class="question-text">${currentQuestion.question}</p>`;

  answerOptions.innerHTML = "";
  currentQuestion.answers.forEach((answer, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = answer.text;
    answerBtn.classList.add("btn", "btn-lg", "answer-btn");
    answerBtn.dataset.correct = answer.correct;
    answerBtn.dataset.index = index;
    answerBtn.addEventListener("click", selectAnswer);
    answerOptions.appendChild(answerBtn);

    if (
      selectedAnswers[currentQuestionIndex] !== null ||
      answeredQuestions[currentQuestionIndex]
    ) {
      const selectedIndex = selectedAnswers[currentQuestionIndex];
      if (index === selectedIndex || answer.correct) {
        answerBtn.classList.add(answer.correct ? "correct" : "incorrect");
      }
      answerBtn.disabled = true;
    }
  });

  updateButtons();

  if (answeredQuestions[currentQuestionIndex]) {
    stopTimer(currentQuestionIndex);
    const timerBar = document.querySelector(".timer-bar");
    timerBar.style.width = "100%";
    timerBar.classList.remove("timer-animation");
  } else {
    initTimer(currentQuestionIndex);
  }

  questionContainer.classList.add("fade-in");
  setTimeout(() => questionContainer.classList.remove("fade-in"), 500);
}

function displayQuestionNumbers() {
  const container = document.getElementById("question-number");
  container.innerHTML = "";

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const maxButtonsPerRow = isMobile ? 4 : 8;

  const totalRows = Math.ceil(questions.length / maxButtonsPerRow);
  for (let row = 0; row < totalRows; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("question-nav-row");

    const startIndex = row * maxButtonsPerRow;
    const endIndex = Math.min(startIndex + maxButtonsPerRow, questions.length);

    for (let i = startIndex; i < endIndex; i++) {
      const navBtn = document.createElement("div");
      navBtn.textContent = i + 1;
      navBtn.classList.add("question-nav");
      if (answeredQuestions[i]) {
        navBtn.classList.add("answered");
      }
      if (i === currentQuestionIndex) {
        navBtn.classList.add("current");
      }
      navBtn.addEventListener("click", () => goToQuestion(i));
      rowDiv.appendChild(navBtn);
    }

    container.appendChild(rowDiv);
  }
}

function showWarning(message) {
  removeWarning();
  const warningDiv = document.createElement("div");
  warningDiv.id = "warningAlert";
  warningDiv.innerHTML = `
    <div class="alert alert-warning" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
      <span class="warning-message">${message}</span>
    </div>
  `;
  document.querySelector(".math-quiz-container").prepend(warningDiv);

  setTimeout(() => {
    warningDiv.classList.add("fade-in");
  }, 50);

  setTimeout(removeWarning, 5000);
}

function removeWarning() {
  const warningDiv = document.getElementById("warningAlert");
  if (warningDiv) {
    warningDiv.classList.add("fade-out");
    setTimeout(() => {
      warningDiv.remove();
    }, 300);
  }
}

function showFinalScore() {
  const finalScoreElement = document.getElementById("finalScore");
  const finalMessageElement = document.getElementById("finalMessage");
  const trophyImage = document.querySelector(".trophy-image");

  finalScoreElement.textContent = `${score} / ${questions.length}`;

  let message = "";
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    message = "Sempurna! Kamu jenius matematika! 🌟";
  } else if (percentage >= 80) {
    message = "Luar biasa! Terus berlatih ya! 😄";
  } else if (percentage >= 60) {
    message = "Bagus! Kamu sudah hampir menguasainya! 👍";
  } else {
    message = "Jangan menyerah, terus belajar! 💪";
  }
  trophyImage.src = "/imk/assets/gold-trophy.svg";

  finalMessageElement.textContent = message;
  playSound("finish");
  scoreModal.show();
}

// Fungsi Logika
function generateQuestion() {
  const question = questions[currentQuestionIndex];
  const questionText = question.question.replace(/\{(\d+)\}/g, (_, number) => {
    const index = parseInt(number, 10);
    return question.answerOperands[index] ?? _;
  });

  return {
    question: questionText,
    answers: question.answers,
    operands: question.answerOperands,
  };
}

function selectAnswer(event) {
  const selectedBtn = event.target;
  const isCorrect = selectedBtn.dataset.correct === "true";

  Array.from(answerOptions.children).forEach((btn) => {
    btn.classList.remove("correct", "incorrect", "selected");
    btn.disabled = true;
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
  });

  selectedBtn.classList.add(isCorrect ? "correct" : "incorrect", "selected");

  if (isCorrect) {
    score++;
    playSound("correct");
  } else {
    playSound("incorrect");
  }

  selectedAnswers[currentQuestionIndex] = parseInt(
    selectedBtn.dataset.index,
    10
  );
  answeredQuestions[currentQuestionIndex] = true;
  updateButtons();
  displayQuestionNumbers();
  stopTimer(currentQuestionIndex);
  removeWarning();

  if (
    currentQuestionIndex === questions.length - 1 &&
    answeredQuestions[currentQuestionIndex]
  ) {
    nextBtn.focus();
  } else {
    nextBtn.disabled = false;
    nextBtn.focus();
  }
}

function allQuestionsAnswered() {
  return answeredQuestions.every((answered) => answered);
}

function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.disabled =
    currentQuestionIndex === questions.length - 1 &&
    answeredQuestions[currentQuestionIndex];

  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.innerHTML = 'Finish <i class="bi bi-trophy-fill ms-2"></i>';
    nextBtn.classList.add("finish-btn");
    nextBtn.disabled = false;
  } else {
    nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right ms-2"></i>';
    nextBtn.classList.remove("finish-btn");
  }

  [prevBtn, nextBtn].forEach((btn) => {
    btn.classList.toggle("disabled", btn.disabled);
  });
}

function handleFinishClick() {
  if (allQuestionsAnswered()) {
    showFinalScore();
  } else {
    const unansweredQuestions = answeredQuestions.reduce(
      (acc, answered, index) => {
        if (!answered) acc.push(index + 1);
        return acc;
      },
      []
    );

    const message = `Harap jawab soal nomor ${unansweredQuestions.join(
      ", "
    )} sebelum menyelesaikan kuis.`;
    showWarning(message);

    nextBtn.classList.add("shake-animation");
    setTimeout(() => nextBtn.classList.remove("shake-animation"), 500);
  }
}

// Fungsi Navigasi
async function showNextQuestion() {
  questionContainer.classList.add("fade-out");
  await new Promise((resolve) => {
    setTimeout(() => {
      stopTimer(currentQuestionIndex);
      currentQuestionIndex++;
      displayQuestion();
      displayQuestionNumbers();
      questionContainer.classList.remove("fade-out");
      resolve();
    }, 500);
  });
}

async function showPreviousQuestion() {
  questionContainer.classList.add("fade-out");
  await new Promise((resolve) => {
    setTimeout(() => {
      stopTimer(currentQuestionIndex);
      currentQuestionIndex--;
      displayQuestion();
      displayQuestionNumbers();
      questionContainer.classList.remove("fade-out");
      resolve();
    }, 500);
  });
}

function goToQuestion(index) {
  if (index !== currentQuestionIndex) {
    stopTimer(currentQuestionIndex);
    currentQuestionIndex = index;
    displayQuestion();
    displayQuestionNumbers();
    if (answeredQuestions[index]) {
      const timerBar = document.querySelector(".timer-bar");
      timerBar.style.width = "100%";
      timerBar.classList.remove("timer-animation");
    } else {
      initTimer(currentQuestionIndex);
    }
  }
}

// Fungsi Timer
function initTimer(questionIndex) {
  questionTimers[questionIndex] = {
    remainingTime: 30000, // 30 detik
    isPaused: false,
  };
  const timerBar = document.querySelector(".timer-bar");
  timerBar.style.width = "100%";
  timerBar.classList.add("timer-animation", "smooth-transition");
  timerBar.classList.remove("time-warning", "warning-pulse");
  animationFrameId = requestAnimationFrame(updateTimer);
}

let animationFrameId = null;
let lastTimestamp = null;

function updateTimer(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }

  for (let i = 0; i < questions.length; i++) {
    if (i === currentQuestionIndex && !questionTimers[i].isPaused) {
      const elapsedTime = timestamp - lastTimestamp;
      questionTimers[i].remainingTime -= elapsedTime;

      const progress = (questionTimers[i].remainingTime / 30000) * 100;
      const timerBar = document.querySelector(".timer-bar");
      timerBar.style.width = `${progress}%`;

      if (questionTimers[i].remainingTime <= 0) {
        stopTimer(i);
        answeredQuestions[i] = true;
        updateButtons();
        displayQuestionNumbers();
        if (i < questions.length - 1) {
          setTimeout(() => showNextQuestion(), 0);
        } else {
          updateButtons();
          setTimeout(() => showFinalScore(), 500);
        }
        break;
      }

      if (
        questionTimers[i].remainingTime <= 10000 &&
        !timerBar.classList.contains("time-warning")
      ) {
        timerBar.classList.add("time-warning", "warning-pulse");
        playSound("tick");
      } else if (questionTimers[i].remainingTime > 10000) {
        timerBar.classList.remove("time-warning", "warning-pulse");
      }
    }
  }

  lastTimestamp = timestamp;
  animationFrameId = requestAnimationFrame(updateTimer);
}

function stopTimer(questionIndex) {
  questionTimers[questionIndex].isPaused = true;
}

// Fungsi Utilitas
function playSound(type) {
  const audio = new Audio(`/imk/assets/sound/${type}.wav`);
  audio.play().catch((error) => {
    console.error(`Error playing sound: ${type}`, error);
  });
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answeredQuestions.fill(false);
  selectedAnswers.fill(null);
  scoreModal.hide();

  const quizCard = document.querySelector(".quiz-card");
  quizCard.classList.add("restart-animation");
  setTimeout(() => {
    displayQuestion();
    quizCard.classList.remove("restart-animation");
  }, 500);
}
