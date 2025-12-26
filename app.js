// --- Карточки (позже заменим на свои наборы) ---
const cards = [
  { front: 'гарантия', back: 'assurance' },
  { front: 'обязать', back: 'obligate' },
  { front: 'определить', back: 'determine' },
  { front: 'устанавливать', back: 'establish' },
  { front: 'сократить', back: 'reduce' },
  { front: 'расширять', back: 'expand' },
  { front: 'согласие', back: 'agreement' },
  { front: 'отказ', back: 'refusal' },
  { front: 'доставка', back: 'delivery' },
  { front: 'платёж', back: 'payment' },
  { front: 'доход', back: 'income' },
  { front: 'расход', back: 'expense' },
  { front: 'сделка', back: 'deal' },
  { front: 'клиент', back: 'customer' },
  { front: 'поставщик', back: 'supplier' },
  { front: 'спрос', back: 'demand' },
  { front: 'предложение', back: 'supply' },
  { front: 'переговоры', back: 'negotiation' },
  { front: 'штраф', back: 'penalty' },
  { front: 'контракт', back: 'contract' },
  { front: 'акция', back: 'stock' },
  { front: 'облигация', back: 'bond' },
  { front: 'прибыль', back: 'profit' },
  { front: 'убыток', back: 'loss' },
  { front: 'рынок', back: 'market' },
  { front: 'бюджет', back: 'budget' },
  { front: 'инвестиции', back: 'investment' },
  { front: 'конкуренция', back: 'competition' },
  { front: 'банкротство', back: 'bankruptcy' },
  { front: 'заём', back: 'loan' }
];

const ROUND_SIZE = 20;

let rounds = [];
let currentRoundIndex = 0;
let currentQuestionIndex = 0;
let answered = false;
let correctCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  buildRounds();
  startRound(0);

  const closeBtn = document.querySelector('.quiz-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      alert('Потом сделаем главное меню 🙂');
    });
  }
});

function buildRounds() {
  const allQuizQuestions = buildQuizFromCards(cards);
  shuffleArray(allQuizQuestions);

  for (let i = 0; i < allQuizQuestions.length; i += ROUND_SIZE) {
    const chunk = allQuizQuestions.slice(i, i + ROUND_SIZE);
    rounds.push(chunk);
  }
}

function startRound(roundIndex) {
  currentRoundIndex = roundIndex;
  currentQuestionIndex = 0;
  correctCount = 0;
  answered = false;
  renderQuestion();
}

function buildQuizFromCards(cards) {
  const result = [];

  cards.forEach((card, idx) => {
    const correct = card.back;
    const others = cards.filter((_, i) => i !== idx).map(c => c.back);
    shuffleArray(others);
    const wrongOptions = others.slice(0, 3);
    const options = [correct, ...wrongOptions];
    shuffleArray(options);

    result.push({
      word: card.front,
      correct,
      options
    });
  });

  return result;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function renderQuestion() {
  const round = rounds[currentRoundIndex];
  const item = round[currentQuestionIndex];

  const wordEl = document.getElementById('quiz-word');
  const optionsContainer = document.getElementById('quiz-options');
  const progressEl = document.getElementById('quiz-progress');
  const resultEl = document.getElementById('quiz-result');

  answered = false;
  resultEl.textContent = '';

  wordEl.textContent = item.word;

  const totalInRound = Math.min(ROUND_SIZE, round.length);
  progressEl.textContent = `${currentQuestionIndex + 1} / ${totalInRound}`;

  optionsContainer.innerHTML = '';
  item.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(btn, opt === item.correct);
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(button, isCorrect) {
  if (answered) return;
  answered = true;

  const resultEl = document.getElementById('quiz-result');
  const optionButtons = document.querySelectorAll('.quiz-option');
  const round = rounds[currentRoundIndex];

  optionButtons.forEach(b => {
    if (b.textContent === round[currentQuestionIndex].correct) {
      b.classList.add('correct');
    }
  });

  if (!isCorrect) {
    button.classList.add('wrong');
    resultEl.textContent = 'Неправильно. Правильный ответ подсвечен зелёным.';
  } else {
    correctCount++;
    resultEl.textContent = 'Правильно! 🎉';
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < Math.min(ROUND_SIZE, round.length)) {
      optionButtons.forEach(b => b.classList.remove('correct', 'wrong'));
      renderQuestion();
    } else {
      showFinishScreen();
    }
  }, 1200);
}

function showFinishScreen() {
  const wordEl = document.getElementById('quiz-word');
  const optionsContainer = document.getElementById('quiz-options');
  const progressEl = document.getElementById('quiz-progress');
  const resultEl = document.getElementById('quiz-result');

  const round = rounds[currentRoundIndex];
  const questionsInThisRound = Math.min(ROUND_SIZE, round.length);
  const percent = Math.round((correctCount / questionsInThisRound) * 100);

  progressEl.textContent = '✓';
  wordEl.textContent = 'Раунд завершён';
  optionsContainer.innerHTML = '';

  let html = `Результат: <b>${correctCount}</b> из <b>${questionsInThisRound}</b> (${percent}%)`;

  const hasNextRound = currentRoundIndex < rounds.length - 1;

  if (hasNextRound) {
    html += `<br><br><button id="next-round-btn" class="quiz-option">Следующий раунд</button>`;
  } else {
    html += `<br><br>Слова закончились. 👍`;
  }

  resultEl.innerHTML = html;

  const nextBtn = document.getElementById('next-round-btn');
  if (nextBtn) {
    nextBtn.onclick = () => {
      startRound(currentRoundIndex + 1);
    };
  }
}