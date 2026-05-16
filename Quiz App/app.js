const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Transfer Markup Language",
    ],
    correct: 0,
  },
  {
    question: "Which tag is used to link a CSS file?",
    options: ["<script>", "<style>", "<link>", "<css>"],
    correct: 2,
  },
  {
    question: "Inside which HTML tag do we put JavaScript?",
    options: ["<js>", "<scripting>", "<script>", "<javascript>"],
    correct: 2,
  },
  {
    question: "Which company created JavaScript?",
    options: ["Microsoft", "Google", "Netscape", "Apple"],
    correct: 2,
  },
  {
    question: "How do you write a comment in JavaScript?",
    options: ["<!-- comment -->", "// comment", "** comment **", "## comment"],
    correct: 1,
  },
  {
    question: "Which method adds an item to the END of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correct: 0,
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Cascading Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets",
    ],
    correct: 1,
  },
  {
    question: "Which symbol is used for strict equality in JS?",
    options: ["=", "==", "===", "!=="],
    correct: 2,
  },
  {
    question: "What does 'DOM' stand for?",
    options: [
      "Document Object Model",
      "Data Object Method",
      "Display Output Mode",
      "Dynamic Object Management",
    ],
    correct: 0,
  },
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "def", "dim"],
    correct: 1,
  },
];

let currentIndex = 0;
let score = 0;

const showQuestion = () => {
  const pt = Math.round((currentIndex / questions.length) * 100);
  document.getElementById("progress-bar").style.width = pt + "%";
  const que = questions[currentIndex];

  document.querySelector("#question-number").textContent =
    `Question ${currentIndex + 1} of ${questions.length}`;

  document.querySelector("#question-text").textContent = que.question;

  const container = document.querySelector("#options-container");
  container.innerHTML = "";

  que.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "option-btn";

    btn.addEventListener("click", function () {
      const allBtns = document.querySelectorAll(".option-btn");

      if (index === que.correct) {
        btn.classList.add("correct");
        score = score + 1;
      } else {
        btn.classList.add("wrong");
        allBtns[que.correct].classList.add("correct");
      }

      allBtns.forEach((b) => (b.disabled = true));

      document.getElementById("next-btn").style.display = "block";
    });

    container.appendChild(btn);
  });
};

showQuestion();

document.querySelector("#next-btn").addEventListener("click", function () {
  currentIndex = currentIndex + 1;

  if (currentIndex < questions.length) {
    document.querySelector("#next-btn").style.display = "none";
    showQuestion();
  } else {
    showScore();
  }
});

const showScore = () => {
  const container = document.querySelector("#quiz-container");

  container.innerHTML = `
    <div style="text-align:center; padding: 20px 0;">
      <div style="font-size:48px; margin-bottom:16px;">
        ${score >= questions.length / 2 ? "🎉" : "📚"}
      </div>
      <h2>You scored ${score} / ${questions.length}</h2>
      <p style="color:#888; margin:12px 0 28px;">
        ${
          score === questions.length
            ? "Perfect score! Amazing!"
            : score >= questions.length / 2
              ? "Good job! Keep practicing."
              : "Keep going, you'll get it!"
        }
      </p>
      <button onclick="restartQuiz()"
        style="padding:12px 32px; background:#6c63ff;
               color:white; border:none; border-radius:10px;
               font-size:15px; cursor:pointer;">
        Try Again
      </button>
    </div>
    `;
};

const restartQuiz = () => {
  currentIndex = 0;
  score = 0;

  document.getElementById("quiz-container").innerHTML = `
    <div style="background:#e0e0e0; border-radius:99px; height:6px; margin-bottom:20px;">
     <div id="progress-bar" style="height:6px; border-radius:99px; background:#6c63ff; width:0%; transition: width 0.4s ease;"></div>
    </div>
    <div id="question-number"></div>
    <h2 id="question-text"></h2>
    <div id="options-container"></div>
    <button id="next-btn" style="display:none">Next Question</button>
    `;

  document.getElementById("next-btn").addEventListener("click", function () {
    currentIndex = currentIndex + 1;

    if (currentIndex < questions.length) {
      document.querySelector("#next-btn").style.display = "none";
      showQuestion();
    } else {
      showScore();
    }
  });

  showQuestion();
};
