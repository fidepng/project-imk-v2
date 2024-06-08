// Data pertanyaan dan jawaban
const questions = [
  {
    image: "/imk/assets/animal/kucing2.svg",
    question: "Apa nama hewan ini?",
    answers: [
      { text: "Kucing", correct: true },
      { text: "Badak", correct: false },
      { text: "Anjing", correct: false },
      { text: "Burung", correct: false },
    ],
  },
  {
    image: "/imk/assets/animal/kucing1.svg",
    question: "Apa nama hewan ini?",
    answers: [
      { text: "Anjing", correct: false },
      { text: "Bebek", correct: false },
      { text: "Kucing", correct: true },
      { text: "Ayam", correct: false },
    ],
  },
  // Tambahkan pertanyaan dan jawaban lainnya di sini
];

let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = new Array(questions.length).fill(false);
let selectedAnswers = new Array(questions.length).fill(null);
let timerInterval;

const questionContainer = document.getElementById("question-container");
const questionImage = document.getElementById("question-image");
const questionText = document.getElementById("question-text");
const answerOptions = document.getElementById("answer-options");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const scoreModal = new bootstrap.Modal(document.getElementById("scoreModal"));
const timerBar = document.getElementById("timer-bar");

function generateQuestion() {
  const question = questions[currentQuestionIndex];
  return {
    image: question.image,
    question: question.question,
    answers: shuffleArray(question.answers),
  };
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function displayQuestionNumbers() {
  const container = document.getElementById("question-number");
  container.innerHTML = "";
  questions.forEach((_, index) => {
    const navBtn = document.createElement("div");
    navBtn.textContent = index + 1;
    navBtn.classList.add("question-nav");
    if (answeredQuestions[index]) {
      navBtn.classList.add("answered");
    }
    if (index === currentQuestionIndex) {
      navBtn.classList.add("current");
    }
    navBtn.addEventListener("click", () => goToQuestion(index));
    container.appendChild(navBtn);
  });
}

function goToQuestion(index) {
  if (index !== currentQuestionIndex) {
    stopTimer();
    currentQuestionIndex = index;
    displayQuestion();
    displayQuestionNumbers();
  }
}

function displayQuestion() {
  const currentQuestion = generateQuestion();
  questionImage.src = currentQuestion.image;
  questionText.textContent = currentQuestion.question;

  answerOptions.innerHTML = "";
  currentQuestion.answers.forEach((answer, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.textContent = answer.text;
    answerBtn.classList.add("btn", "btn-lg", "answer-btn");
    answerBtn.dataset.correct = answer.correct;
    answerBtn.dataset.index = index;
    answerBtn.addEventListener("click", selectAnswer);
    answerOptions.appendChild(answerBtn);

    if (selectedAnswers[currentQuestionIndex] !== null) {
      const selectedIndex = selectedAnswers[currentQuestionIndex];
      if (index === selectedIndex) {
        answerBtn.classList.add(answer.correct ? "correct" : "incorrect");
      }
      answerBtn.disabled = true;
    }
  });

  displayQuestionNumbers();
  updateButtons();
  startTimer();
}

function selectAnswer(event) {
  const selectedBtn = event.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  const selectedIndex = parseInt(selectedBtn.dataset.index, 10);

  Array.from(answerOptions.children).forEach((btn) => {
    btn.classList.remove("correct", "incorrect");
    btn.disabled = true;
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
  });

  selectedBtn.classList.add(isCorrect ? "correct" : "incorrect");

  if (isCorrect) {
    score++;
    playSound("correct");
  } else {
    playSound("incorrect");
  }

  answeredQuestions[currentQuestionIndex] = true;
  selectedAnswers[currentQuestionIndex] = selectedIndex;
  updateButtons();
  displayQuestionNumbers();
  stopTimer();
}

function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;

  if (
    currentQuestionIndex === questions.length - 1 &&
    answeredQuestions[currentQuestionIndex]
  ) {
    nextBtn.innerHTML = 'Selesai <i class="bi bi-trophy-fill ms-2"></i>';
    nextBtn.classList.remove("btn-primary");
    nextBtn.classList.add("btn-success");
  } else {
    nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right ms-2"></i>';
    nextBtn.classList.remove("btn-success");
    nextBtn.classList.add("btn-primary");
  }

  nextBtn.disabled =
    currentQuestionIndex === questions.length - 1 &&
    !answeredQuestions[currentQuestionIndex];
}

function showNextQuestion() {
  stopTimer();
  currentQuestionIndex++;
  setTimeout(() => {
    displayQuestion();
    displayQuestionNumbers();
  }, 500);
}

function showPreviousQuestion() {
  stopTimer();
  currentQuestionIndex--;
  setTimeout(() => {
    displayQuestion();
    displayQuestionNumbers();
  }, 500);
}

function showFinalScore() {
  const finalScoreElement = document.getElementById("finalScore");
  const finalMessageElement = document.getElementById("finalMessage");
  const trophyImage = document.querySelector(".trophy-image");

  finalScoreElement.textContent = `${score} / ${questions.length}`;

  let message = "";
  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    message = "Sempurna! Kamu jenius pengetahuan umum! 🌟";
    trophyImage.src = "/imk/assets/gold-trophy.svg";
  } else if (percentage >= 80) {
    message = "Luar biasa! Terus berlatih ya! 😄";
    trophyImage.src = "/imk/assets/silver-trophy.svg";
  } else if (percentage >= 60) {
    message = "Bagus! Kamu sudah hampir menguasainya! 👍";
    trophyImage.src = "/imk/assets/bronze-trophy.svg";
  } else {
    message = "Jangan menyerah, terus belajar! 💪";
    trophyImage.src = "/imk/assets/participation-trophy.svg";
  }

  finalMessageElement.textContent = message;
  playSound("finish");
  scoreModal.show();
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  answeredQuestions.fill(false);
  selectedAnswers.fill(null);
  scoreModal.hide();
  displayQuestion();
}

function playSound(type) {
  const audio = new Audio(`/imk/assets/sound/${type}.wav`);
  audio.play().catch((error) => {
    console.error(`Error playing sound: ${type}`, error);
  });
}

function startTimer() {
  const titleElement = document.querySelector("h1");
  titleElement.classList.remove("time-warning", "time-danger");
  titleElement.style.setProperty("--timer-width", "100%");

  clearInterval(timerInterval);
  let timeLeft = 100;

  timerInterval = setInterval(() => {
    timeLeft--;
    titleElement.style.setProperty("--timer-width", `${timeLeft}%`);

    if (timeLeft <= 25) {
      titleElement.classList.add("time-danger");
    } else if (timeLeft <= 50) {
      titleElement.classList.add("time-warning");
    }

    if (timeLeft === 0) {
      stopTimer();
      showNextQuestion();
    }
  }, 1000); // Setiap 1 detik
}

function stopTimer() {
  clearInterval(timerInterval);
  const titleElement = document.querySelector("h1");
  titleElement.classList.remove("time-warning", "time-danger");
}

prevBtn.addEventListener("click", showPreviousQuestion);
nextBtn.addEventListener("click", () => {
  if (
    currentQuestionIndex === questions.length - 1 &&
    answeredQuestions[currentQuestionIndex]
  ) {
    showFinalScore();
  } else {
    showNextQuestion();
  }
});

document
  .querySelector(".modal-footer .btn-primary")
  .addEventListener("click", restartQuiz);

document.body.insertAdjacentHTML("afterbegin", '<div class="loading"></div>');
setTimeout(() => {
  document.querySelector(".loading").remove();
  displayQuestion();
}, 1500);

document.addEventListener("DOMContentLoaded", () => {
  displayQuestion();
  displayQuestionNumbers();
});
